-- Update leads_compliance_report view to exclude unsubscribed leads
-- Migration: 20251014130630_update_compliance_view_unsubscribe_filter.sql

-- Drop the existing view
DROP VIEW IF EXISTS public.leads_compliance_report CASCADE;

-- Recreate the view with unsubscribe filtering
CREATE VIEW public.leads_compliance_report 
WITH (security_invoker = on) AS
SELECT 
  id,
  first_name,
  last_name,
  email,
  phone,
  state,
  tcpa_consent,
  tcpa_consent_timestamp,
  email_marketing_consent,
  unsubscribed_at,
  created_at,
  lead_source,
  status,
  -- Calculate days since consent given
  CASE 
    WHEN tcpa_consent_timestamp IS NOT NULL 
    THEN EXTRACT(days FROM now() - tcpa_consent_timestamp)
    ELSE NULL::numeric 
  END as days_since_consent,
  -- Calculate days since unsubscribed (if applicable)
  CASE 
    WHEN unsubscribed_at IS NOT NULL 
    THEN EXTRACT(days FROM now() - unsubscribed_at)
    ELSE NULL::numeric 
  END as days_since_unsubscribed
FROM public.leads
WHERE 
  tcpa_consent = true 
  AND (email_marketing_consent = true OR email_marketing_consent IS NULL)
  AND unsubscribed_at IS NULL
ORDER BY tcpa_consent_timestamp DESC;

-- Add comment explaining the updated security and compliance model
COMMENT ON VIEW public.leads_compliance_report IS 
'Secure view for TCPA compliance reporting - excludes unsubscribed leads and uses security_invoker to respect RLS policies. Only shows leads who have given TCPA consent and have not unsubscribed from marketing communications.';

-- Ensure proper ownership and permissions
ALTER VIEW public.leads_compliance_report OWNER TO postgres;

-- Grant appropriate permissions to authenticated users only
GRANT SELECT ON public.leads_compliance_report TO authenticated;

-- Revoke public access for security
REVOKE ALL ON public.leads_compliance_report FROM PUBLIC;

-- Create a separate view for all leads (including unsubscribed) for audit purposes
CREATE OR REPLACE VIEW public.leads_audit_report 
WITH (security_invoker = on) AS
SELECT 
  id,
  first_name,
  last_name,
  email,
  phone,
  state,
  tcpa_consent,
  tcpa_consent_timestamp,
  email_marketing_consent,
  unsubscribed_at,
  created_at,
  lead_source,
  status,
  -- Compliance status indicator
  CASE 
    WHEN tcpa_consent = false THEN 'NO_TCPA_CONSENT'
    WHEN email_marketing_consent = false OR unsubscribed_at IS NOT NULL THEN 'UNSUBSCRIBED'
    WHEN tcpa_consent = true AND (email_marketing_consent = true OR email_marketing_consent IS NULL) AND unsubscribed_at IS NULL THEN 'ACTIVE'
    ELSE 'UNKNOWN'
  END as compliance_status,
  -- Calculate days since consent given
  CASE 
    WHEN tcpa_consent_timestamp IS NOT NULL 
    THEN EXTRACT(days FROM now() - tcpa_consent_timestamp)
    ELSE NULL::numeric 
  END as days_since_consent,
  -- Calculate days since unsubscribed (if applicable)
  CASE 
    WHEN unsubscribed_at IS NOT NULL 
    THEN EXTRACT(days FROM now() - unsubscribed_at)
    ELSE NULL::numeric 
  END as days_since_unsubscribed
FROM public.leads
ORDER BY created_at DESC;

-- Add comment for audit view
COMMENT ON VIEW public.leads_audit_report IS 
'Complete audit view for all leads including unsubscribed ones. Used for compliance auditing and data analysis. Includes compliance_status field for easy filtering.';

-- Set permissions for audit view (more restricted)
ALTER VIEW public.leads_audit_report OWNER TO postgres;
GRANT SELECT ON public.leads_audit_report TO authenticated;
REVOKE ALL ON public.leads_audit_report FROM PUBLIC;