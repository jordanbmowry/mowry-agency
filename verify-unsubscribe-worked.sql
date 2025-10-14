-- Verify unsubscribe functionality worked
-- Run this in your Supabase SQL Editor to confirm the database updates

-- 1. Check if the email was added to unsubscribes table
SELECT 
    'Unsubscribes Table' as table_name,
    id,
    email,
    created_at,
    reason,
    ip_address
FROM public.unsubscribes 
WHERE email = 'jordan.mowry@gmail.com'
ORDER BY created_at DESC;

-- 2. Check if the leads table was updated with unsubscribe info
SELECT 
    'Leads Table' as table_name,
    id,
    first_name,
    last_name,
    email,
    email_marketing_consent,
    unsubscribed_at,
    created_at
FROM public.leads 
WHERE email = 'jordan.mowry@gmail.com';

-- 3. Check compliance view (should exclude this lead now)
SELECT 
    'Compliance View' as source,
    COUNT(*) as lead_count
FROM public.leads_compliance_report 
WHERE email = 'jordan.mowry@gmail.com';

-- 4. Check audit view (should still include this lead)
SELECT 
    'Audit View' as source,
    email,
    compliance_status,
    days_since_unsubscribed
FROM public.leads_audit_report 
WHERE email = 'jordan.mowry@gmail.com';