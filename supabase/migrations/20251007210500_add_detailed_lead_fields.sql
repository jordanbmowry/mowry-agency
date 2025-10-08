-- Add detailed insurance lead fields to the leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS state VARCHAR(2); -- US state abbreviation
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 18 AND age <= 120);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS health_issues TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS medications TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS best_call_time VARCHAR(50);

-- Add indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_leads_city ON public.leads (city);
CREATE INDEX IF NOT EXISTS idx_leads_state ON public.leads (state);
CREATE INDEX IF NOT EXISTS idx_leads_age ON public.leads (age);
CREATE INDEX IF NOT EXISTS idx_leads_best_call_time ON public.leads (best_call_time);

-- Add comments to document the new fields
COMMENT ON COLUMN public.leads.city IS 'Customer city for insurance lead';
COMMENT ON COLUMN public.leads.state IS 'US state abbreviation (2 characters)';
COMMENT ON COLUMN public.leads.age IS 'Customer age for insurance underwriting';
COMMENT ON COLUMN public.leads.health_issues IS 'Any health issues or medical conditions';
COMMENT ON COLUMN public.leads.medications IS 'Current medications or prescriptions';
COMMENT ON COLUMN public.leads.best_call_time IS 'Preferred time of day for agent contact';

-- Update the recent_leads view to include new fields
DROP VIEW IF EXISTS public.recent_leads;
CREATE VIEW public.recent_leads AS
SELECT 
    id,
    name,
    email,
    phone,
    city,
    state,
    age,
    best_call_time,
    lead_source,
    status,
    created_at
FROM public.leads
ORDER BY created_at DESC;

-- Create a comprehensive lead details view
CREATE VIEW public.lead_details AS
SELECT 
    id,
    name,
    email,
    phone,
    city,
    state,
    age,
    health_issues,
    medications,
    best_call_time,
    message,
    lead_source,
    status,
    created_at,
    updated_at
FROM public.leads
ORDER BY created_at DESC;