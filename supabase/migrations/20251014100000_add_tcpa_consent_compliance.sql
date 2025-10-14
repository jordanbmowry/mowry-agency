-- Migration: Add TCPA consent and compliance fields
-- Description: Adds TCPA consent tracking, timestamps, and updates for compliance with TCPA regulations
-- Created: 2025-10-14

-- Add TCPA consent tracking fields to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS tcpa_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tcpa_consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Make tcpa_consent required for new records (existing records will have false by default)
ALTER TABLE public.leads 
ALTER COLUMN tcpa_consent SET NOT NULL;

-- Add constraint to ensure tcpa_consent_timestamp is set when tcpa_consent is true
CREATE OR REPLACE FUNCTION update_tcpa_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- If tcpa_consent is being set to true and timestamp is null, set current timestamp
  IF NEW.tcpa_consent = true AND (OLD.tcpa_consent = false OR OLD.tcpa_consent IS NULL) THEN
    NEW.tcpa_consent_timestamp = timezone('utc'::text, now());
  END IF;
  
  -- If tcpa_consent is being set to false, clear the timestamp
  IF NEW.tcpa_consent = false THEN
    NEW.tcpa_consent_timestamp = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically manage tcpa_consent_timestamp
DROP TRIGGER IF EXISTS trigger_update_tcpa_timestamp ON public.leads;
CREATE TRIGGER trigger_update_tcpa_timestamp
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_tcpa_timestamp();

-- Add comments for documentation
COMMENT ON COLUMN public.leads.tcpa_consent IS 'TCPA consent for phone/SMS/email contact - required for compliance. Must be true for new leads.';
COMMENT ON COLUMN public.leads.tcpa_consent_timestamp IS 'Timestamp when TCPA consent was given - automatically managed by trigger';

-- Create indexes for better query performance on consent tracking
CREATE INDEX IF NOT EXISTS idx_leads_tcpa_consent ON public.leads(tcpa_consent);
CREATE INDEX IF NOT EXISTS idx_leads_tcpa_timestamp ON public.leads(tcpa_consent_timestamp);
CREATE INDEX IF NOT EXISTS idx_leads_state ON public.leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Add a compound index for common queries (consent + timestamp + state)
CREATE INDEX IF NOT EXISTS idx_leads_compliance_tracking 
ON public.leads(tcpa_consent, tcpa_consent_timestamp, state, created_at);

-- Update existing records to have proper timestamps where consent exists
-- (This is safe to run multiple times)
UPDATE public.leads 
SET tcpa_consent_timestamp = created_at 
WHERE tcpa_consent = true AND tcpa_consent_timestamp IS NULL;

-- Add a check constraint to ensure data integrity
ALTER TABLE public.leads 
ADD CONSTRAINT chk_tcpa_consent_with_timestamp 
CHECK (
  -- If consent is true, timestamp must exist
  (tcpa_consent = true AND tcpa_consent_timestamp IS NOT NULL) OR
  -- If consent is false, timestamp should be null
  (tcpa_consent = false)
);

-- Create a view for compliance reporting (optional but useful)
CREATE OR REPLACE VIEW public.leads_compliance_report AS
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
    THEN EXTRACT(DAYS FROM (NOW() - tcpa_consent_timestamp))
    ELSE NULL 
  END as days_since_consent
FROM public.leads
WHERE tcpa_consent = true
ORDER BY tcpa_consent_timestamp DESC;

-- Grant appropriate permissions
GRANT SELECT ON public.leads_compliance_report TO authenticated;

-- Add RLS policy for the compliance view if needed
ALTER VIEW public.leads_compliance_report OWNER TO postgres;