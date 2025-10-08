-- Comprehensive leads table redesign - consolidate all lead types into one table
-- This migration drops the job_applications table and redesigns leads table

-- 1. Drop existing tables and views to start fresh
DROP VIEW IF EXISTS public.recent_leads;
DROP VIEW IF EXISTS public.lead_summary;
DROP VIEW IF EXISTS public.lead_details;
DROP TABLE IF EXISTS public.job_applications;

-- 2. Drop and recreate the leads table with all required fields
DROP TABLE IF EXISTS public.leads;

CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic contact information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Location information
    city VARCHAR(100),
    state VARCHAR(2), -- US state abbreviation
    
    -- Insurance-specific information
    age INTEGER CHECK (age >= 18 AND age <= 120),
    coverage_type VARCHAR(100), -- Term Life, Whole Life, Universal Life, etc.
    health_issues TEXT,
    medications TEXT,
    best_call_time VARCHAR(50), -- Morning, Afternoon, Evening, Weekends
    
    -- Lead management
    lead_type VARCHAR(50) DEFAULT 'insurance_quote', -- insurance_quote, contact_form, career_inquiry
    lead_source VARCHAR(100) DEFAULT 'website', -- website, referral, advertisement, etc.
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, quoted, sold, closed_lost
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create indexes for performance
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_email ON public.leads (email);
CREATE INDEX idx_leads_lead_source ON public.leads (lead_source);
CREATE INDEX idx_leads_lead_type ON public.leads (lead_type);
CREATE INDEX idx_leads_state ON public.leads (state);
CREATE INDEX idx_leads_age ON public.leads (age);
CREATE INDEX idx_leads_coverage_type ON public.leads (coverage_type);
CREATE INDEX idx_leads_best_call_time ON public.leads (best_call_time);

-- 4. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for authenticated users (admin access)
CREATE POLICY "Enable all access for authenticated users" ON public.leads
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. Allow anonymous users to submit leads (form submissions)
CREATE POLICY "Enable insert for anonymous users" ON public.leads
    FOR INSERT TO anon WITH CHECK (true);

-- 8. Create comprehensive views
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
    age,
    coverage_type,
    best_call_time,
    lead_type,
    lead_source,
    status,
    created_at
FROM public.leads
ORDER BY created_at DESC;

CREATE VIEW public.lead_summary AS
SELECT 
    lead_type,
    lead_source,
    status,
    COUNT(*) as count,
    DATE(created_at) as date
FROM public.leads
GROUP BY lead_type, lead_source, status, DATE(created_at)
ORDER BY date DESC;

CREATE VIEW public.insurance_leads AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    city,
    state,
    age,
    coverage_type,
    health_issues,
    medications,
    best_call_time,
    message,
    status,
    created_at
FROM public.leads
WHERE lead_type = 'insurance_quote'
ORDER BY created_at DESC;

-- 9. Add comprehensive table comments
COMMENT ON TABLE public.leads IS 'Unified table for all lead types - insurance quotes, contact forms, career inquiries';

COMMENT ON COLUMN public.leads.first_name IS 'Customer first name';
COMMENT ON COLUMN public.leads.last_name IS 'Customer last name';
COMMENT ON COLUMN public.leads.email IS 'Customer email address';
COMMENT ON COLUMN public.leads.phone IS 'Customer phone number';
COMMENT ON COLUMN public.leads.city IS 'Customer city';
COMMENT ON COLUMN public.leads.state IS 'US state abbreviation (2 characters)';
COMMENT ON COLUMN public.leads.age IS 'Customer age for insurance underwriting';
COMMENT ON COLUMN public.leads.coverage_type IS 'Type of insurance coverage interested in';
COMMENT ON COLUMN public.leads.health_issues IS 'Any health issues or medical conditions';
COMMENT ON COLUMN public.leads.medications IS 'Current medications or prescriptions';
COMMENT ON COLUMN public.leads.best_call_time IS 'Preferred time of day for agent contact';
COMMENT ON COLUMN public.leads.lead_type IS 'Type of lead: insurance_quote, contact_form, career_inquiry';
COMMENT ON COLUMN public.leads.lead_source IS 'Source of the lead: website, referral, advertisement';
COMMENT ON COLUMN public.leads.status IS 'Current status in the sales pipeline';

-- 10. Insert sample data for testing
INSERT INTO public.leads (
    first_name, last_name, email, phone, city, state, age, 
    coverage_type, health_issues, medications, best_call_time,
    lead_type, lead_source, message, status
) VALUES
(
    'John', 'Doe', 'john.doe@example.com', '555-123-4567', 
    'Austin', 'TX', 35, 'Term Life Insurance', 
    'High blood pressure', 'Lisinopril 10mg daily', 'Morning',
    'insurance_quote', 'website', 'Looking for $500K term life policy', 'new'
),
(
    'Jane', 'Smith', 'jane.smith@example.com', '555-987-6543',
    'Dallas', 'TX', 42, 'Whole Life Insurance',
    'None', 'None', 'Evening',
    'insurance_quote', 'website', 'Interested in permanent life insurance with cash value', 'new'
);