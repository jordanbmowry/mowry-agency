-- Migration: Create leads and job applications tables for Mowry Agency
-- Created: 2025-10-07

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create leads table for contact form submissions
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    lead_source VARCHAR(50) CHECK (lead_source IN ('contact_form', 'join_us_form', 'quote_form')) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'not_interested')) DEFAULT 'new' NOT NULL,
    agent_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create job_applications table for career applications
CREATE TABLE public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    position VARCHAR(255) NOT NULL,
    experience TEXT,
    state VARCHAR(50) NOT NULL,
    message TEXT,
    resume_url TEXT,
    status VARCHAR(50) CHECK (status IN ('new', 'reviewing', 'interview_scheduled', 'hired', 'rejected')) DEFAULT 'new' NOT NULL,
    agree_to_terms BOOLEAN DEFAULT false NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create indexes for better performance
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_email ON public.leads (email);
CREATE INDEX idx_leads_source ON public.leads (lead_source);

CREATE INDEX idx_job_applications_created_at ON public.job_applications (created_at DESC);
CREATE INDEX idx_job_applications_status ON public.job_applications (status);
CREATE INDEX idx_job_applications_email ON public.job_applications (email);
CREATE INDEX idx_job_applications_position ON public.job_applications (position);

-- 4. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for authenticated users (admin access)
CREATE POLICY "Enable read access for authenticated users" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.leads
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON public.leads
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.job_applications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.job_applications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.job_applications
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON public.job_applications
    FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Grant permissions to anon role for form submissions
CREATE POLICY "Enable insert for anonymous users" ON public.leads
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON public.job_applications
    FOR INSERT TO anon WITH CHECK (true);

-- 8. Create views for easier querying
CREATE VIEW public.recent_leads AS
SELECT 
    id,
    name,
    email,
    phone,
    lead_source,
    status,
    created_at
FROM public.leads
ORDER BY created_at DESC;

CREATE VIEW public.lead_summary AS
SELECT 
    lead_source,
    status,
    COUNT(*) as count,
    DATE(created_at) as date
FROM public.leads
GROUP BY lead_source, status, DATE(created_at)
ORDER BY date DESC;

-- 9. Insert sample data for testing
INSERT INTO public.leads (name, email, phone, message, lead_source, status) VALUES
('Test User', 'test@example.com', '555-123-4567', 'Sample lead for testing the database migration', 'contact_form', 'new'),
('Migration Test', 'migration@test.com', '555-987-6543', 'Testing database migration deployment', 'quote_form', 'new');

-- 10. Add comments to tables for documentation
COMMENT ON TABLE public.leads IS 'Contact form submissions and quote requests from website visitors';
COMMENT ON TABLE public.job_applications IS 'Career applications from potential agents and employees';

COMMENT ON COLUMN public.leads.lead_source IS 'Source of the lead: contact_form, join_us_form, or quote_form';
COMMENT ON COLUMN public.leads.status IS 'Current status of the lead in the sales pipeline';
COMMENT ON COLUMN public.job_applications.agree_to_terms IS 'Indicates if applicant agreed to terms and conditions';
