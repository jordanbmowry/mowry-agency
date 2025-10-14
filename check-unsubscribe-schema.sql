-- Check if unsubscribe functionality is properly set up in the database
-- Run these queries in your Supabase SQL Editor to diagnose the issue

-- 1. Check if unsubscribed_at column exists in leads table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND table_schema = 'public' 
  AND column_name = 'unsubscribed_at';

-- 2. Check if email_marketing_consent column exists in leads table  
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND table_schema = 'public' 
  AND column_name = 'email_marketing_consent';

-- 3. Check if unsubscribes table exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'unsubscribes' 
  AND table_schema = 'public';

-- 4. If unsubscribes table exists, check its structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'unsubscribes' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check if your test email exists in leads table
SELECT id, first_name, last_name, email, unsubscribed_at, email_marketing_consent
FROM public.leads 
WHERE email = 'jordan.mowry@gmail.com';

-- 6. Check if any records exist in unsubscribes table
SELECT COUNT(*) as total_unsubscribes FROM public.unsubscribes;

-- 7. Check specific unsubscribe record
SELECT * FROM public.unsubscribes 
WHERE email = 'jordan.mowry@gmail.com';