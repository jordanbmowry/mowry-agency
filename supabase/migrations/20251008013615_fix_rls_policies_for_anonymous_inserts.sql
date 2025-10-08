-- Fix RLS policies for anonymous inserts - COMPREHENSIVE FIX
-- This allows the quote form to submit data from anonymous users

-- First, ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.leads;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous inserts for leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated full access to leads" ON public.leads;

-- Grant explicit table permissions
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO authenticated;

-- Create specific RLS policies with proper targeting
CREATE POLICY "anon_insert_leads" ON public.leads
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "auth_all_leads" ON public.leads
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Also grant permissions to the service_role for admin access
GRANT ALL ON public.leads TO service_role;
