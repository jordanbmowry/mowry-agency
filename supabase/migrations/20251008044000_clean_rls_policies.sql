-- Clean up conflicting RLS policies
-- Remove all existing policies and create simple, working ones

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts for leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated full access to leads" ON public.leads;
DROP POLICY IF EXISTS "allow_all_inserts" ON public.leads;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.leads;

-- Make sure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Grant basic permissions
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO authenticated;

-- Create simple, non-conflicting policies
-- Policy 1: Allow anonymous users to insert (for quote form)
CREATE POLICY "anon_can_insert" ON public.leads
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Policy 2: Allow authenticated users full access (for admin)
CREATE POLICY "auth_full_access" ON public.leads
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);