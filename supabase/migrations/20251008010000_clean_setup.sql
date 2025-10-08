-- Clean database setup - single leads table for quote forms
-- Drop all views first (confirmed these exist as views)
DROP VIEW IF EXISTS lead_summary CASCADE;
DROP VIEW IF EXISTS quote_form_submissions CASCADE; 
DROP VIEW IF EXISTS recent_leads CASCADE;

-- Drop any extra tables we don't need
DROP TABLE IF EXISTS job_applications CASCADE;

-- Ensure leads table exists with correct structure
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Quote form fields (matching QuoteForm.vue exactly)
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  coverage_type VARCHAR(100) NOT NULL,
  health_conditions TEXT NOT NULL,
  current_medications TEXT NOT NULL,
  message TEXT,
  
  -- Simple lead management
  status VARCHAR(50) DEFAULT 'new' NOT NULL 
    CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'not_interested'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;
DROP POLICY IF EXISTS "Allow public inserts" ON leads;
DROP POLICY IF EXISTS "Enable anonymous inserts for quote forms" ON leads;
DROP POLICY IF EXISTS "Users can read their own submissions" ON leads;
DROP POLICY IF EXISTS "Allow quote form submissions" ON leads;
DROP POLICY IF EXISTS "Allow anonymous quote submissions" ON leads;
DROP POLICY IF EXISTS "leads_insert_policy" ON leads;
DROP POLICY IF EXISTS "allow_anonymous_inserts" ON leads;
DROP POLICY IF EXISTS "quote_form_inserts" ON leads;
DROP POLICY IF EXISTS "enable_insert_for_quote_forms" ON leads;

-- Create one simple policy for anonymous form submissions
CREATE POLICY "quote_form_submissions" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Grant permissions to anonymous users (for form submissions)
GRANT INSERT ON leads TO anon;
GRANT SELECT ON leads TO anon;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger for updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();