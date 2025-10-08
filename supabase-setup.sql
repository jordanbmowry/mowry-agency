-- Supabase Database Setup for Mowry Agency
-- Run these commands in the Supabase SQL Editor

-- 1. Create leads table
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    lead_source VARCHAR(50) CHECK (lead_source IN ('contact_form', 'join_us_form')) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'not_interested')) DEFAULT 'new' NOT NULL,
    agent_notes TEXT
);

-- 2. Create job_applications table
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
    agree_to_terms BOOLEAN DEFAULT false NOT NULL
);

-- 3. Create indexes for better performance
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_email ON public.leads (email);
CREATE INDEX idx_job_applications_created_at ON public.job_applications (created_at DESC);
CREATE INDEX idx_job_applications_status ON public.job_applications (status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.leads
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.job_applications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.job_applications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.job_applications
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. Grant permissions to anon role for form submissions
CREATE POLICY "Enable insert for anonymous users" ON public.leads
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON public.job_applications
    FOR INSERT TO anon WITH CHECK (true);

-- 7. Insert sample data for testing (optional)
INSERT INTO public.leads (name, email, phone, message, lead_source, status) VALUES
('Test User', 'test@example.com', '555-123-4567', 'Sample lead for testing', 'contact_form', 'new');

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('leads', 'job_applications');