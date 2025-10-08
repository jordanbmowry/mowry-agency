-- Temporarily disable RLS to test if the issue is with policies or client configuration
-- Migration: Disable RLS for testing
-- Created: 2025-10-08

-- Temporarily disable RLS on leads table for testing
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- Add a comment to track this change
COMMENT ON TABLE public.leads IS 'RLS temporarily disabled for testing - re-enable after confirming insert works';