-- Clean up database by removing job_applications table and ensuring proper leads table structure
-- Migration: Remove job_applications table and fix leads table for quote form only
-- Created: 2025-10-08

-- 1. Drop the unwanted job_applications table and all its dependencies
DROP TABLE IF EXISTS public.job_applications CASCADE;

-- 2. Clean up any existing policies on leads table to recreate them properly
DO $$
BEGIN
    -- Drop policies only if they exist
    DROP POLICY IF EXISTS "Anonymous users can submit leads" ON public.leads;
    DROP POLICY IF EXISTS "Authenticated users can manage leads" ON public.leads;
    DROP POLICY IF EXISTS "Quote form submissions" ON public.leads;
    DROP POLICY IF EXISTS "allow_public_insert_leads" ON public.leads;
    DROP POLICY IF EXISTS "allow_authenticated_all_leads" ON public.leads;
EXCEPTION WHEN OTHERS THEN
    -- Ignore errors if policies don't exist
    NULL;
END $$;

-- 3. Ensure leads table has the correct columns (add missing ones if needed)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS coverage_type VARCHAR(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS health_conditions TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS current_medications TEXT;

-- 4. Update lead_source constraint to only allow quote_form
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_lead_source_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_lead_source_check 
    CHECK (lead_source IN ('quote_form'));

-- 5. Ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 6. Create the correct RLS policy for quote form submissions
CREATE POLICY "Quote form submissions" ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (lead_source = 'quote_form');

-- 7. Create policy for authenticated users (admin access)
CREATE POLICY "Authenticated users can manage leads" ON public.leads
  FOR ALL
  TO authenticated
  WITH CHECK (true);

-- 8. Ensure proper permissions are granted
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

-- 9. Grant function execution permissions if the function exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO anon;
        GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
    END IF;
END $$;