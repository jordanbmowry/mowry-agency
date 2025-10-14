#!/bin/bash

# Simple duplicate email test without database setup
echo "🧪 Testing Duplicate Email Error Handling (API Only)"
echo "================================================="

echo ""
echo "📋 Step 1: Make first API call (should succeed)..."
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "First",
    "lastName": "Test", 
    "email": "duplicate-test-simple@example.com",
    "phone": "555-1111",
    "dateOfBirth": "1990-01-01",
    "city": "Test City",
    "state": "IN", 
    "coverageType": "term-life",
    "healthConditions": "Good health",
    "medications": "None",
    "tcpaConsent": true
  }' \
  --include \
  --silent \
  --show-error

echo ""
echo ""
echo "📋 Step 2: Make second API call with same email (should fail with 409)..."
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Second",
    "lastName": "Test", 
    "email": "duplicate-test-simple@example.com",
    "phone": "555-2222",
    "dateOfBirth": "1985-05-05",
    "city": "Another City",
    "state": "OH", 
    "coverageType": "whole-life",
    "healthConditions": "Excellent health",
    "medications": "Vitamins only",
    "tcpaConsent": true
  }' \
  --include \
  --silent \
  --show-error

echo ""
echo ""
echo "✅ Test completed!"
echo ""
echo "🎯 Expected Results:"
echo "• First call: 200 OK with success message"
echo "• Second call: 409 Conflict with DUPLICATE_EMAIL and contact info"
echo ""
echo "🎯 Browser Test:"
echo "1. Go to /quote page"
echo "2. Submit form with: duplicate-test-simple@example.com"
echo "3. Should see orange warning with contact buttons"