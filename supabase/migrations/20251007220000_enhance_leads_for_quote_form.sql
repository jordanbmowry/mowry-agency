-- Enhanced leads table migration for comprehensive quote form
-- This migration enhances the leads table to support all quote form fields
-- Created: 2025-10-07

-- 1. Add date_of_birth field to replace age field (more accurate for insurance)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- 2. Add enhanced health information fields
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS health_conditions TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS current_medications TEXT;

-- 3. Add enhanced coverage and contact preference fields
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR(50) DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'email', 'text'));
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS coverage_amount VARCHAR(50); -- e.g., "$250K", "$500K", "$1M"
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS quote_urgency VARCHAR(50) DEFAULT 'no_rush' CHECK (quote_urgency IN ('urgent', 'soon', 'no_rush'));

-- 4. Update lead_source enum to include quote_form specifically
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_lead_source_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_lead_source_check 
  CHECK (lead_source IN ('website', 'referral', 'advertisement', 'contact_form', 'quote_form', 'join_us_form', 'social_media', 'phone_inquiry'));

-- 5. Update status enum to include more insurance-specific statuses
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check 
  CHECK (status IN ('new', 'contacted', 'info_gathering', 'quoted', 'application_submitted', 'underwriting', 'approved', 'policy_issued', 'declined', 'not_interested', 'follow_up_later'));

-- 6. Create function to calculate age from date_of_birth
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$ LANGUAGE plpgsql;

-- 7. Create computed column view that includes calculated age
CREATE OR REPLACE VIEW public.leads_with_calculated_age AS
SELECT 
    *,
    CASE 
        WHEN date_of_birth IS NOT NULL THEN calculate_age(date_of_birth)
        ELSE age
    END AS calculated_age
FROM public.leads;

-- 8. Create comprehensive insurance quote leads view
DROP VIEW IF EXISTS public.insurance_leads;
CREATE VIEW public.insurance_leads AS
SELECT 
    id,
    first_name,
    last_name,
    first_name || ' ' || last_name as full_name,
    email,
    phone,
    city,
    state,
    date_of_birth,
    calculate_age(date_of_birth) as age,
    coverage_type,
    coverage_amount,
    health_conditions,
    current_medications,
    preferred_contact_method,
    best_call_time,
    quote_urgency,
    message,
    lead_source,
    status,
    created_at,
    updated_at
FROM public.leads
WHERE lead_type = 'insurance_quote' OR lead_source = 'quote_form'
ORDER BY created_at DESC;

-- 9. Create quote form specific view for easy querying
CREATE VIEW public.quote_form_submissions AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    coverage_type,
    health_conditions,
    current_medications,
    message,
    status,
    created_at
FROM public.leads
WHERE lead_source = 'quote_form'
ORDER BY created_at DESC;

-- 10. Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_leads_date_of_birth ON public.leads (date_of_birth);
CREATE INDEX IF NOT EXISTS idx_leads_health_conditions ON public.leads USING gin(to_tsvector('english', health_conditions));
CREATE INDEX IF NOT EXISTS idx_leads_medications ON public.leads USING gin(to_tsvector('english', current_medications));
CREATE INDEX IF NOT EXISTS idx_leads_preferred_contact ON public.leads (preferred_contact_method);
CREATE INDEX IF NOT EXISTS idx_leads_coverage_amount ON public.leads (coverage_amount);
CREATE INDEX IF NOT EXISTS idx_leads_quote_urgency ON public.leads (quote_urgency);

-- 11. Update table and column comments
COMMENT ON COLUMN public.leads.date_of_birth IS 'Customer date of birth for accurate age calculation and underwriting';
COMMENT ON COLUMN public.leads.health_conditions IS 'Current health conditions and medical history (replaces health_issues)';
COMMENT ON COLUMN public.leads.current_medications IS 'Current medications including dosages (replaces medications)';
COMMENT ON COLUMN public.leads.preferred_contact_method IS 'How the customer prefers to be contacted';
COMMENT ON COLUMN public.leads.coverage_amount IS 'Desired coverage amount for insurance policy';
COMMENT ON COLUMN public.leads.quote_urgency IS 'How urgently the customer needs a quote';

-- 12. Update recent_leads view to include new fields
DROP VIEW IF EXISTS public.recent_leads;
CREATE VIEW public.recent_leads AS
SELECT 
    id,
    first_name,
    last_name,
    first_name || ' ' || last_name as full_name,
    email,
    phone,
    city,
    state,
    date_of_birth,
    CASE 
        WHEN date_of_birth IS NOT NULL THEN calculate_age(date_of_birth)
        ELSE age
    END AS calculated_age,
    coverage_type,
    coverage_amount,
    preferred_contact_method,
    best_call_time,
    quote_urgency,
    lead_type,
    lead_source,
    status,
    created_at
FROM public.leads
ORDER BY created_at DESC
LIMIT 100;

-- 13. Create a comprehensive lead analytics view
CREATE VIEW public.lead_analytics AS
SELECT 
    DATE(created_at) as date,
    lead_source,
    lead_type,
    status,
    COUNT(*) as count,
    AVG(CASE WHEN date_of_birth IS NOT NULL THEN calculate_age(date_of_birth) ELSE age END) as avg_age,
    COUNT(CASE WHEN health_conditions IS NOT NULL AND health_conditions != 'None' THEN 1 END) as leads_with_health_conditions,
    COUNT(CASE WHEN current_medications IS NOT NULL AND current_medications != 'None' THEN 1 END) as leads_with_medications
FROM public.leads
GROUP BY DATE(created_at), lead_source, lead_type, status
ORDER BY date DESC;

-- 14. Insert enhanced sample data for testing
INSERT INTO public.leads (
    first_name, last_name, email, phone, city, state, date_of_birth, 
    coverage_type, coverage_amount, health_conditions, current_medications, 
    preferred_contact_method, best_call_time, quote_urgency,
    lead_type, lead_source, message, status
) VALUES
(
    'Sarah', 'Johnson', 'sarah.johnson@example.com', '555-555-0101', 
    'Houston', 'TX', '1985-03-15', 'Term Life Insurance', '$750K',
    'Occasional migraines, well controlled', 'Sumatriptan as needed for migraines', 
    'phone', 'Evening', 'soon',
    'insurance_quote', 'quote_form', 'Need coverage for my growing family. Have two young children.', 'new'
),
(
    'Michael', 'Chen', 'michael.chen@example.com', '555-555-0102',
    'San Antonio', 'TX', '1978-11-22', 'Whole Life Insurance', '$1M',
    'Type 2 diabetes, well managed with diet and medication', 'Metformin 500mg twice daily', 
    'email', 'Morning', 'no_rush',
    'insurance_quote', 'quote_form', 'Looking for permanent life insurance with cash value component for retirement planning.', 'new'
),
(
    'Amanda', 'Rodriguez', 'amanda.rodriguez@example.com', '555-555-0103',
    'Austin', 'TX', '1992-07-08', 'Term Life Insurance', '$500K',
    'None', 'Prenatal vitamins', 
    'text', 'Afternoon', 'urgent',
    'insurance_quote', 'quote_form', 'Just had a baby and need coverage immediately. Currently on maternity leave.', 'new'
);

-- 15. Grant necessary permissions
GRANT SELECT ON public.insurance_leads TO anon, authenticated;
GRANT SELECT ON public.quote_form_submissions TO anon, authenticated;
GRANT SELECT ON public.recent_leads TO anon, authenticated;
GRANT SELECT ON public.lead_analytics TO authenticated;
GRANT SELECT ON public.leads_with_calculated_age TO authenticated;