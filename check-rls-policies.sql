-- Check RLS policies for leads table UPDATE operations
-- Run this in your Supabase SQL Editor to diagnose the issue

-- 1. Check if RLS is enabled on leads table
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE t.tablename = 'leads' AND t.schemaname = 'public';

-- 2. Check existing RLS policies on leads table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'leads' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 3. Check if there are UPDATE policies specifically
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'UPDATE';

-- 4. Test if we can manually update a record (this should work if permissions are correct)
-- First, let's see what email addresses exist
SELECT email, email_marketing_consent, unsubscribed_at 
FROM public.leads 
WHERE email = 'jordan.mowry@gmail.com'
LIMIT 1;

-- 5. Try a manual update to see if it works
-- UPDATE public.leads 
-- SET email_marketing_consent = false, unsubscribed_at = NOW()
-- WHERE email = 'jordan.mowry@gmail.com';
-- 
-- -- Check if the update worked
-- SELECT email, email_marketing_consent, unsubscribed_at 
-- FROM public.leads 
-- WHERE email = 'jordan.mowry@gmail.com';