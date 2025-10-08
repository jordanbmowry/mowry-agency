-- Fix RLS policy for quote form submissions
-- Based on official Supabase Nuxt.js quickstart pattern
-- Created: 2025-10-08

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Quote form submissions" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON public.leads;

-- Create simple RLS policy following official Supabase pattern
-- Allow anonymous users to insert leads (for quote form)
CREATE POLICY "public can insert leads" ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users full access (for admin)
CREATE POLICY "authenticated can manage leads" ON public.leads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);