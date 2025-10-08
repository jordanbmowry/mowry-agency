-- FINAL FIX: RLS for anonymous inserts
-- Based on Supabase documentation and Stack Overflow solutions

-- First, ensure the anon role has INSERT permission on the table
GRANT INSERT ON TABLE public.leads TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "anon_can_insert" ON public.leads;
DROP POLICY IF EXISTS "auth_full_access" ON public.leads;

-- Ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create a simple, working policy for anonymous inserts
-- This allows any anonymous user to insert new rows
CREATE POLICY "allow_anon_insert_leads" ON public.leads
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Create a policy for authenticated users (for admin access)
CREATE POLICY "allow_auth_all_leads" ON public.leads
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);