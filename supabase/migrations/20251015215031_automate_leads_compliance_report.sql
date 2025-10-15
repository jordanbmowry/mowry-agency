-- Migration: create reporting function and idempotent "owner action required" marker
-- Run as a non-superuser / normal DB role. This migration does NOT modify cron.job.

--------------------------------------------------------------------------------
-- 1) Create or replace the reporting function
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_weekly_leads_compliance_report()
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_rows_inserted integer := 0;
  v_rows_updated integer := 0;
BEGIN
  -- Build weekly dataset
  CREATE TEMP TABLE IF NOT EXISTS tmp_weekly_leads ON COMMIT DROP AS
  SELECT
    l.id AS lead_id,
    l.first_name,
    l.last_name,
    l.email,
    l.phone,
    l.state,
    l.tcpa_consent,
    l.tcpa_consent_timestamp,
    l.tcpa_text,
    l.email_marketing_consent,
    l.unsubscribed_at,
    l.created_at,
    l.lead_source,
    l.status,
    l.form_version,
    l.ip_address,
    CASE WHEN l.tcpa_consent_timestamp IS NULL THEN NULL
         ELSE EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp)::int
    END AS days_since_consent,
    CASE WHEN l.unsubscribed_at IS NULL THEN NULL
         ELSE EXTRACT(DAY FROM NOW() - l.unsubscribed_at)::int
    END AS days_since_unsubscribed,
    r.compliance_review_status AS existing_review_status
  FROM public.leads l
  LEFT JOIN public.leads_compliance_report r ON r.lead_id = l.id
  WHERE l.created_at > NOW() - INTERVAL '7 days';

  -- Temp table for result flags
  CREATE TEMP TABLE IF NOT EXISTS tmp_upsert_results (inserted_flag boolean) ON COMMIT DROP;

  WITH moved_rows AS (
    INSERT INTO public.leads_compliance_report (
      lead_id,
      generated_at,
      first_name,
      last_name,
      email,
      phone,
      state,
      tcpa_consent,
      tcpa_consent_timestamp,
      tcpa_text,
      email_marketing_consent,
      unsubscribed_at,
      created_at,
      lead_source,
      status,
      form_version,
      ip_address,
      days_since_consent,
      days_since_unsubscribed,
      compliance_review_status
    )
    SELECT
      lead_id,
      NOW() AT TIME ZONE 'UTC' AS generated_at,
      first_name,
      last_name,
      email,
      phone,
      state,
      tcpa_consent,
      tcpa_consent_timestamp,
      tcpa_text,
      email_marketing_consent,
      unsubscribed_at,
      created_at,
      lead_source,
      status,
      form_version,
      ip_address,
      days_since_consent,
      days_since_unsubscribed,
      COALESCE(existing_review_status, 'pending')
    FROM tmp_weekly_leads l
    ON CONFLICT (lead_id) DO UPDATE
    SET
      generated_at = EXCLUDED.generated_at,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      state = EXCLUDED.state,
      tcpa_consent = EXCLUDED.tcpa_consent,
      tcpa_consent_timestamp = EXCLUDED.tcpa_consent_timestamp,
      tcpa_text = EXCLUDED.tcpa_text,
      email_marketing_consent = EXCLUDED.email_marketing_consent,
      unsubscribed_at = EXCLUDED.unsubscribed_at,
      created_at = EXCLUDED.created_at,
      lead_source = EXCLUDED.lead_source,
      status = EXCLUDED.status,
      form_version = EXCLUDED.form_version,
      ip_address = EXCLUDED.ip_address,
      days_since_consent = EXCLUDED.days_since_consent,
      days_since_unsubscribed = EXCLUDED.days_since_unsubscribed,
      compliance_review_status = EXCLUDED.compliance_review_status
    RETURNING (xmax = 0) AS inserted_flag
  )
  INSERT INTO tmp_upsert_results
  SELECT inserted_flag FROM moved_rows;

  SELECT COUNT(*) FROM tmp_upsert_results WHERE inserted_flag = true INTO v_rows_inserted;
  SELECT COUNT(*) FROM tmp_upsert_results WHERE inserted_flag = false INTO v_rows_updated;

  RETURN jsonb_build_object(
    'ok', true,
    'generated_at', now(),
    'rows_inserted', v_rows_inserted,
    'rows_updated', v_rows_updated
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('ok', false, 'error', SQLERRM);
END;
$function$;

--------------------------------------------------------------------------------
-- 2) Ensure logging table exists (idempotent)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads_compliance_report_runs (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  result jsonb NOT NULL,
  rows_inserted integer,
  rows_updated integer
);

--------------------------------------------------------------------------------
-- 3) Owner-required marker (idempotent)
-- This records that an owner must create the scheduled job via the Dashboard.
-- Safe for non-owner roles; avoids touching cron.job.
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public._owner_required_migrations (
  tag text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  note text
);

INSERT INTO public._owner_required_migrations (tag, note)
SELECT 'create_weekly_leads_compliance_report_job',
       'Owner must create scheduled job weekly_leads_compliance_report_with_log via Dashboard: schedule 0 0 * * 1 to run: WITH result AS (SELECT public.generate_weekly_leads_compliance_report() AS res) INSERT INTO public.leads_compliance_report_runs (result, rows_inserted, rows_updated) SELECT res.res, (res.res ->> ''rows_inserted'')::int, (res.res ->> ''rows_updated'')::int FROM result;'
WHERE NOT EXISTS (
  SELECT 1 FROM public._owner_required_migrations WHERE tag = 'create_weekly_leads_compliance_report_job'
);

--------------------------------------------------------------------------------
-- OPTIONAL: Owner-only cron upsert block (commented)
-- If an owner wants to apply the cron.job change via SQL, they can run the block below.
-- It is commented out to avoid permission errors when applied by non-owners.
--------------------------------------------------------------------------------
-- /*
-- DO $$
-- DECLARE
--   v_jobname text := 'weekly_leads_compliance_report_with_log';
-- BEGIN
--   DELETE FROM cron.job WHERE jobname = v_jobname;
--   INSERT INTO cron.job (schedule, command, jobname, active)
--   VALUES (
--     '0 0 * * 1',
--     $cmd$
--     WITH result AS (
--       SELECT public.generate_weekly_leads_compliance_report() AS res
--     )
--     INSERT INTO public.leads_compliance_report_runs (result, rows_inserted, rows_updated)
--     SELECT res.res, (res.res ->> 'rows_inserted')::int, (res.res ->> 'rows_updated')::int
--     FROM result;
--     $cmd$,
--     v_jobname,
--     true
--   );
-- END
-- $$;
-- */

-- End of migration