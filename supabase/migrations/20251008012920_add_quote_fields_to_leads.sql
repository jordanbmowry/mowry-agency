-- Migration: Add quote-specific fields to leads table
-- Created: 2025-10-08

-- Add quote-specific columns to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS coverage_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS health_conditions TEXT,
ADD COLUMN IF NOT EXISTS current_medications TEXT,
ADD COLUMN IF NOT EXISTS lead_type VARCHAR(50) CHECK (lead_type IN ('contact', 'job_application', 'insurance_quote'));

-- Update the existing check constraint for lead_source to include all sources
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_lead_source_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_lead_source_check 
    CHECK (lead_source IN ('contact_form', 'join_us_form', 'quote_form'));

-- Update the existing check constraint for status to include quote-related statuses
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check 
    CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'not_interested'));

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads (lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_coverage_type ON public.leads (coverage_type);
CREATE INDEX IF NOT EXISTS idx_leads_first_name ON public.leads (first_name);
CREATE INDEX IF NOT EXISTS idx_leads_last_name ON public.leads (last_name);

-- Update the name field to be computed from first_name and last_name for quote leads
-- Add a trigger to automatically populate the name field
CREATE OR REPLACE FUNCTION update_lead_name()
RETURNS TRIGGER AS $$
BEGIN
    -- If first_name and last_name are provided, combine them for the name field
    IF NEW.first_name IS NOT NULL AND NEW.last_name IS NOT NULL THEN
        NEW.name = CONCAT(NEW.first_name, ' ', NEW.last_name);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for name field
DROP TRIGGER IF EXISTS trigger_update_lead_name ON public.leads;
CREATE TRIGGER trigger_update_lead_name
    BEFORE INSERT OR UPDATE ON public.leads
    FOR EACH ROW 
    EXECUTE FUNCTION update_lead_name();

-- Add comments for the new fields
COMMENT ON COLUMN public.leads.first_name IS 'First name for quote requests';
COMMENT ON COLUMN public.leads.last_name IS 'Last name for quote requests';
COMMENT ON COLUMN public.leads.date_of_birth IS 'Date of birth for insurance quotes';
COMMENT ON COLUMN public.leads.coverage_type IS 'Type of insurance coverage requested (term-life, whole-life, iul, etc.)';
COMMENT ON COLUMN public.leads.health_conditions IS 'Health conditions disclosed in quote request';
COMMENT ON COLUMN public.leads.current_medications IS 'Current medications disclosed in quote request';
COMMENT ON COLUMN public.leads.lead_type IS 'Type of lead: contact, job_application, or insurance_quote';
