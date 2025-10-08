-- Simplified leads table migration to match QuoteForm exactly
-- This migration creates a clean schema that matches only the QuoteForm fields
-- Created: 2025-10-07

-- 1. Drop the previous enhanced migration views and constraints
DROP VIEW IF EXISTS public.lead_analytics;
DROP VIEW IF EXISTS public.quote_form_submissions;
DROP VIEW IF EXISTS public.insurance_leads;
DROP VIEW IF EXISTS public.recent_leads;
DROP VIEW IF EXISTS public.leads_with_calculated_age;

-- 2. Remove unnecessary columns that don't match our form
ALTER TABLE public.leads DROP COLUMN IF EXISTS preferred_contact_method;
ALTER TABLE public.leads DROP COLUMN IF EXISTS coverage_amount;
ALTER TABLE public.leads DROP COLUMN IF EXISTS quote_urgency;
ALTER TABLE public.leads DROP COLUMN IF EXISTS city;
ALTER TABLE public.leads DROP COLUMN IF EXISTS state;
ALTER TABLE public.leads DROP COLUMN IF EXISTS age;
ALTER TABLE public.leads DROP COLUMN IF EXISTS best_call_time;

-- 3. Ensure we have the exact fields that match QuoteForm
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS health_conditions TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS current_medications TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS coverage_type VARCHAR(100);

-- Ensure the name column exists for backwards compatibility
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- 4. Ensure lead_type and lead_source are correct
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_type VARCHAR(50) DEFAULT 'insurance_quote';

-- 5. Skip constraint updates here - will be handled in the fix migration

-- 6. Create indexes for performance on fields we actually use
CREATE INDEX IF NOT EXISTS idx_leads_first_name ON public.leads (first_name);
CREATE INDEX IF NOT EXISTS idx_leads_last_name ON public.leads (last_name);
CREATE INDEX IF NOT EXISTS idx_leads_date_of_birth ON public.leads (date_of_birth);
CREATE INDEX IF NOT EXISTS idx_leads_coverage_type ON public.leads (coverage_type);
CREATE INDEX IF NOT EXISTS idx_leads_health_conditions ON public.leads USING gin(to_tsvector('english', health_conditions));
CREATE INDEX IF NOT EXISTS idx_leads_medications ON public.leads USING gin(to_tsvector('english', current_medications));

-- 7. Create a simplified quote form view
CREATE VIEW public.quote_form_submissions AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    health_conditions,
    current_medications,
    coverage_type,
    message,
    lead_source,
    status,
    created_at,
    updated_at
FROM public.leads
WHERE lead_source = 'quote_form'
ORDER BY created_at DESC;

-- 8. Create a recent leads view that matches our simplified schema
CREATE VIEW public.recent_leads AS
SELECT 
    id,
    COALESCE(first_name || ' ' || last_name, name, 'Unknown') as full_name,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    coverage_type,
    lead_source,
    lead_type,
    status,
    created_at
FROM public.leads
ORDER BY created_at DESC
LIMIT 100;

-- 9. Update table comments to reflect the simplified schema
COMMENT ON TABLE public.leads IS 'Simplified leads table matching QuoteForm fields exactly';
COMMENT ON COLUMN public.leads.first_name IS 'Customer first name from quote form';
COMMENT ON COLUMN public.leads.last_name IS 'Customer last name from quote form';
COMMENT ON COLUMN public.leads.date_of_birth IS 'Customer date of birth for accurate insurance underwriting';
COMMENT ON COLUMN public.leads.health_conditions IS 'Customer health conditions from quote form';
COMMENT ON COLUMN public.leads.current_medications IS 'Customer current medications from quote form';
COMMENT ON COLUMN public.leads.coverage_type IS 'Type of insurance coverage customer is interested in';

-- 10. Insert sample data that matches our form exactly
INSERT INTO public.leads (
    first_name, last_name, email, phone, date_of_birth, 
    health_conditions, current_medications, coverage_type,
    lead_type, lead_source, message, status
) VALUES
(
    'Emily', 'Thompson', 'emily.thompson@example.com', '555-555-0201', '1985-06-20',
    'Mild asthma, well controlled', 'Albuterol inhaler as needed',
    'Term Life Insurance', 'insurance_quote', 'quote_form',
    'Looking for 20-year term life insurance to cover mortgage and children''s education.', 'new'
),
(
    'David', 'Martinez', 'david.martinez@example.com', '555-555-0202', '1979-12-15',
    'High cholesterol, managed with diet and exercise', 'None',
    'Whole Life Insurance', 'insurance_quote', 'quote_form',
    'Interested in permanent life insurance for estate planning purposes.', 'new'
);

-- 11. Grant permissions for the new views
GRANT SELECT ON public.quote_form_submissions TO anon, authenticated;
GRANT SELECT ON public.recent_leads TO anon, authenticated;