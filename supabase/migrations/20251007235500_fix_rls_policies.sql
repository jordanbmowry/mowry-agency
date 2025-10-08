-- Fix RLS (Row Level Security) policies for leads table
-- This migration ensures anonymous users can insert quote requests

-- Drop any existing policies that might be misconfigured
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;
DROP POLICY IF EXISTS "Allow public inserts" ON leads;

-- Ensure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a proper policy to allow anonymous inserts for quote forms
CREATE POLICY "Enable anonymous inserts for quote forms" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Optional: Add a policy to allow users to read their own submissions
-- (This is useful if you want to show confirmation or allow updates)
CREATE POLICY "Users can read their own submissions" ON leads
  FOR SELECT
  USING (true);

-- Grant necessary permissions to anonymous users
GRANT INSERT ON leads TO anon;
GRANT SELECT ON leads TO anon;

-- Verify the policy was created correctly
DO $$
BEGIN
  -- Check if the policy exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Enable anonymous inserts for quote forms'
  ) THEN
    RAISE NOTICE 'RLS policy "Enable anonymous inserts for quote forms" created successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create RLS policy';
  END IF;
END $$;