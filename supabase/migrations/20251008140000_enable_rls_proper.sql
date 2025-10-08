-- Re-enable RLS with correct policies based on official Supabase documentation
-- Reference: https://supabase.com/docs/guides/database/postgres/row-level-security
-- Migration: Enable RLS with proper anonymous insert policy
-- Created: 2025-10-08

-- Re-enable RLS on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "authenticated can manage leads" ON public.leads;

-- Create policy for anonymous users to insert leads (following official docs pattern)
-- This allows quote form submissions from anonymous users
CREATE POLICY "Enable insert for anon users" ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated users to have full access (admin functionality)
CREATE POLICY "Enable all access for authenticated users" ON public.leads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure proper permissions are granted (as per documentation)
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

-- Remove the test comment
COMMENT ON TABLE public.leads IS NULL;