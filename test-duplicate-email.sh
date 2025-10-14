#!/bin/bash

# Test script for duplicate email error handling
echo "🧪 Testing Duplicate Email Error Handling"
echo "=========================================="

echo ""
echo "📋 Step 1: Insert a test lead to create duplicate scenario..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
-- Insert test lead
INSERT INTO leads (
  first_name, last_name, email, phone, 
  date_of_birth, city, state, coverage_type,
  tcpa_consent, tcpa_consent_timestamp,
  email_marketing_consent, lead_type, lead_source
) VALUES (
  'Test', 'User', 'duplicate-test@example.com', '555-0123',
  '1990-01-01', 'Test City', 'IN', 'term-life',
  true, NOW(),
  true, 'insurance_quote', 'quote_form'
) ON CONFLICT (email) DO NOTHING;
"

echo ""
echo "📋 Step 2: Test duplicate email via API..."
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Duplicate",
    "lastName": "Test", 
    "email": "duplicate-test@example.com",
    "phone": "555-9999",
    "dateOfBirth": "1985-05-05",
    "city": "Another City",
    "state": "OH", 
    "coverageType": "whole-life",
    "healthConditions": "Good health",
    "medications": "None",
    "tcpaConsent": true
  }' \
  --include \
  --silent \
  --show-error

echo ""
echo ""
echo "📋 Step 3: Verify error response structure..."
echo "Expected: 409 status with DUPLICATE_EMAIL message"
echo "Should include phone and email contact information"

echo ""
echo "🧹 Step 4: Cleaning up test data..."
npx supabase sql --db-url "$SUPABASE_URL" --query "
DELETE FROM leads WHERE email = 'duplicate-test@example.com';
"

echo ""
echo "✅ Test completed!"
echo ""
echo "🎯 What to test in the browser:"
echo "1. Go to /quote page"
echo "2. Submit form with duplicate email"
echo "3. Should see orange warning with contact buttons"
echo "4. Should have clickable phone and email links"