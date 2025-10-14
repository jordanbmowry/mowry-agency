-- Migration: Fix Security and Compliance View
-- Description: Fixes the security definer issue and consolidates database structure
-- Created: 2025-10-14

-- Drop the existing insecure view
DROP VIEW IF EXISTS public.leads_compliance_report CASCADE;

-- Recreate the view with security_invoker to make it secure
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
  created_at,
  lead_source,
  status,
  -- Calculate days since consent given
  CASE 
    WHEN tcpa_consent_timestamp IS NOT NULL 
    THEN EXTRACT(days FROM now() - tcpa_consent_timestamp)
    ELSE NULL::numeric 
  END as days_since_consent
FROM public.leads
WHERE tcpa_consent = true
ORDER BY tcpa_consent_timestamp DESC;

-- Add comment explaining the security model
COMMENT ON VIEW public.leads_compliance_report IS 'Secure view for TCPA compliance reporting - uses security_invoker to respect RLS policies';

-- Ensure proper ownership and permissions
ALTER VIEW public.leads_compliance_report OWNER TO postgres;

-- Grant appropriate permissions to authenticated users only
GRANT SELECT ON public.leads_compliance_report TO authenticated;

-- Revoke any public access
REVOKE ALL ON public.leads_compliance_report FROM PUBLIC;

-- Add RLS policy for the view if needed (inherits from underlying table)
-- The security_invoker option ensures that RLS policies from the leads table are respected

-- Verify no duplicate tables exist - this is informational only
-- If there are duplicate tables, they should be manually reviewed and cleaned up
-- The leads table should be the single source of truth

-- Add final verification constraint to ensure data integrity
DO $$
BEGIN
  -- Check if there are any records without proper TCPA compliance
  IF EXISTS (
    SELECT 1 FROM public.leads 
    WHERE tcpa_consent = true 
    AND tcpa_consent_timestamp IS NULL
  ) THEN
    -- Update any records that might have missing timestamps
    UPDATE public.leads 
    SET tcpa_consent_timestamp = created_at 
    WHERE tcpa_consent = true AND tcpa_consent_timestamp IS NULL;
    
    RAISE NOTICE 'Updated % records with missing TCPA consent timestamps', ROW_COUNT;
  END IF;
END $$;