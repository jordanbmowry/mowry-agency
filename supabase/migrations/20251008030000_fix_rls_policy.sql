-- Fix RLS policy for anonymous inserts - simple approach

-- Disable RLS temporarily to see if table structure is the issue
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Re-enable it
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies and create one simple one
DROP POLICY IF EXISTS "quote_form_submissions" ON leads;
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

-- Create a very simple policy that allows all inserts
CREATE POLICY "allow_all_inserts" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure permissions are granted
GRANT INSERT ON leads TO anon;
GRANT SELECT ON leads TO anon;