-- Comprehensive Database Setup for Mowry Agency
-- Created: 2025-10-08
-- This migration sets up the complete database schema with RLS policies

-- Drop existing tables if they exist (for fresh start)
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_lead_name() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_age(date) CASCADE;

-- 1. Create leads table with all required fields
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Contact information
  name VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  
  -- Quote-specific fields
  date_of_birth DATE,
  coverage_type VARCHAR(100),
  health_conditions TEXT,
  current_medications TEXT,
  
  -- Lead management
  lead_type VARCHAR(50) CHECK (lead_type IN ('contact', 'job_application', 'insurance_quote')),
  lead_source VARCHAR(50) NOT NULL CHECK (lead_source IN ('contact_form', 'join_us_form', 'quote_form')),
  status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'not_interested')),
  agent_notes TEXT
);

-- 2. Create job_applications table
CREATE TABLE public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Personal information
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  
  -- Application details
  position VARCHAR(100) NOT NULL,
  experience VARCHAR(50),
  state VARCHAR(100) NOT NULL,
  message TEXT,
  resume_url TEXT,
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  
  -- Application management
  status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'reviewing', 'interview_scheduled', 'hired', 'rejected'))
);

-- 3. Create utility functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.update_lead_name()
RETURNS TRIGGER AS $$
BEGIN
    -- If first_name and last_name are provided, combine them for the name field
    IF NEW.first_name IS NOT NULL AND NEW.last_name IS NOT NULL THEN
        NEW.name = CONCAT(NEW.first_name, ' ', NEW.last_name);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.calculate_age(birth_date date)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$;

-- 4. Create triggers
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON public.leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at 
  BEFORE UPDATE ON public.job_applications 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_lead_name
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW 
  EXECUTE FUNCTION update_lead_name();

-- 5. Create indexes for performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_lead_type ON public.leads(lead_type);
CREATE INDEX idx_leads_coverage_type ON public.leads(coverage_type);
CREATE INDEX idx_leads_first_name ON public.leads(first_name);
CREATE INDEX idx_leads_last_name ON public.leads(last_name);

CREATE INDEX idx_job_applications_email ON public.job_applications(email);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_created_at ON public.job_applications(created_at DESC);

-- 6. Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies following official Supabase best practices
-- Reference: https://supabase.com/docs/guides/database/postgres/row-level-security

-- Create policy for anonymous users to insert leads (for quote/contact forms)
CREATE POLICY "Anonymous users can submit leads" ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for anonymous users to insert job applications
CREATE POLICY "Anonymous users can submit applications" ON public.job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create comprehensive policy for authenticated users (admin access)
CREATE POLICY "Authenticated users can manage leads" ON public.leads
  FOR ALL
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage applications" ON public.job_applications
  FOR ALL
  TO authenticated
  WITH CHECK (true);

-- 8. Grant necessary permissions to anonymous users (for form submissions)
GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.job_applications TO anon;

-- 9. Grant all permissions to authenticated users and service role
GRANT ALL ON public.leads TO authenticated;
GRANT ALL ON public.job_applications TO authenticated;
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.job_applications TO service_role;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Ensure anon role can execute functions
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO anon;
GRANT EXECUTE ON FUNCTION public.update_lead_name() TO anon;