-- Add TCPA consent tracking fields to leads table
-- Run this in Supabase SQL Editor after the main schema

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS tcpa_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tcpa_consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- Update the leads table to make tcpa_consent required for new records
-- (existing records will have false by default)
ALTER TABLE public.leads 
ALTER COLUMN tcpa_consent SET NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.leads.tcpa_consent IS 'TCPA consent for phone/SMS/email contact - required for compliance';
COMMENT ON COLUMN public.leads.tcpa_consent_timestamp IS 'Timestamp when TCPA consent was given';
COMMENT ON COLUMN public.leads.city IS 'Customer city for quote requests';
COMMENT ON COLUMN public.leads.state IS 'Customer state for quote requests and licensing compliance';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_tcpa_consent ON public.leads(tcpa_consent);
CREATE INDEX IF NOT EXISTS idx_leads_state ON public.leads(state);