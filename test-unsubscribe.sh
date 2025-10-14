#!/bin/bash

# Test script for unsubscribe functionality
# Run this script to test the database operations after migration

echo "🧪 Testing Unsubscribe Functionality"
echo "======================================"

# Test 1: Check if new columns exist in leads table
echo "📋 Test 1: Checking database schema..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND table_schema = 'public' 
  AND column_name IN ('unsubscribed_at', 'email_marketing_consent')
ORDER BY column_name;
"

# Test 2: Check if unsubscribes table exists
echo ""
echo "📋 Test 2: Checking unsubscribes table..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'unsubscribes' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
"

# Test 3: Insert a test lead and verify columns
echo ""
echo "📋 Test 3: Testing lead insertion with new columns..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
-- Insert test lead
INSERT INTO leads (
  first_name, last_name, email, phone, 
  date_of_birth, city, state, coverage_type,
  tcpa_consent, tcpa_consent_timestamp,
  email_marketing_consent, lead_type, lead_source
) VALUES (
  'Test', 'User', 'test@example.com', '555-0123',
  '1990-01-01', 'Test City', 'IN', 'term-life',
  true, NOW(),
  true, 'insurance_quote', 'quote_form'
) ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  email_marketing_consent = EXCLUDED.email_marketing_consent;

-- Verify the insertion
SELECT 
  first_name, last_name, email, 
  email_marketing_consent, unsubscribed_at,
  tcpa_consent, created_at
FROM leads 
WHERE email = 'test@example.com';
"

# Test 4: Test unsubscribe operation
echo ""
echo "📋 Test 4: Testing unsubscribe operation..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
-- Add to unsubscribes table
INSERT INTO unsubscribes (email, reason, ip_address, user_agent)
VALUES ('test@example.com', 'Testing unsubscribe', '127.0.0.1', 'Test Script')
ON CONFLICT (email) DO UPDATE SET
  reason = EXCLUDED.reason;

-- Update leads table
UPDATE leads 
SET 
  email_marketing_consent = false,
  unsubscribed_at = NOW()
WHERE email = 'test@example.com';

-- Verify the unsubscribe
SELECT 
  email, email_marketing_consent, unsubscribed_at
FROM leads 
WHERE email = 'test@example.com';

-- Check unsubscribes table
SELECT 
  email, reason, ip_address, created_at
FROM unsubscribes 
WHERE email = 'test@example.com';
"

# Test 5: Test compliance views
echo ""
echo "📋 Test 5: Testing compliance views..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
-- Test leads_compliance_report view (should exclude unsubscribed)
SELECT 'Active leads in compliance view:' as description, COUNT(*) as count
FROM leads_compliance_report;

-- Test leads_audit_report view (should include all)
SELECT 'All leads in audit view:' as description, COUNT(*) as count
FROM leads_audit_report;

-- Test compliance status breakdown
SELECT 
  compliance_status,
  COUNT(*) as count
FROM leads_audit_report
GROUP BY compliance_status
ORDER BY compliance_status;
"

# Test 6: Test unsubscribe token generation
echo ""
echo "📋 Test 5: Testing unsubscribe token generation..."
node -e "
const email = 'test@example.com';
const token = Buffer.from(email).toString('base64');
const decoded = Buffer.from(token, 'base64').toString('utf-8');
console.log('Original email:', email);
console.log('Generated token:', token);
console.log('Decoded email:', decoded);
console.log('Test URL: /api/unsubscribe?token=' + token);
console.log('Match:', email === decoded ? '✅ PASS' : '❌ FAIL');
"

echo ""
echo "🧹 Cleaning up test data..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
-- Clean up test data
DELETE FROM unsubscribes WHERE email = 'test@example.com';
DELETE FROM leads WHERE email = 'test@example.com';
"

echo "✅ Test completed!"
echo ""
echo "🚀 Next steps:"
echo "1. Run 'supabase db push' to apply the migration"
echo "2. Test the /api/unsubscribe endpoint"
echo "3. Submit a quote form to test email generation"