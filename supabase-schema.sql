-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/evaekmusrxnycollboke/sql)

-- 1. Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  lead_source VARCHAR(50) NOT NULL CHECK (lead_source IN ('contact_form', 'join_us_form')),
  status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'not_interested')),
  agent_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create job_applications table
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  experience VARCHAR(50),
  state VARCHAR(100) NOT NULL,
  message TEXT,
  resume_url TEXT,
  status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'reviewing', 'interview_scheduled', 'hired', 'rejected')),
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX idx_job_applications_email ON job_applications(email);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- 5. Create policies to allow public inserts (for forms)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can create job applications" ON job_applications
  FOR INSERT 
  WITH CHECK (true);

-- 6. Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at 
  BEFORE UPDATE ON job_applications 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();