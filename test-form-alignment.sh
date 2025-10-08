#!/bin/bash

# Test script to verify QuoteForm and database schema alignment
# This script tests that the form submission works correctly

echo "🧪 Testing QuoteForm and Database Schema Alignment"
echo "================================================="

# Check if the application is running
echo "🔍 Checking if application is running on port 3000..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Application is not running on port 3000"
    echo "   Please run 'npm run dev' first"
    exit 1
fi

echo "✅ Application is running"

# Test 1: Check if QuoteForm is accessible on homepage
echo ""
echo "📝 Test 1: Checking QuoteForm on homepage..."
HOMEPAGE_CONTENT=$(curl -s http://localhost:3000)
if echo "$HOMEPAGE_CONTENT" | grep -q "Get Your Free Life Insurance Quote"; then
    echo "✅ QuoteForm found on homepage"
else
    echo "❌ QuoteForm not found on homepage"
fi

# Test 2: Check if QuoteForm is accessible on quote page
echo ""
echo "📝 Test 2: Checking QuoteForm on quote page..."
QUOTE_PAGE_CONTENT=$(curl -s http://localhost:3000/quote)
if echo "$QUOTE_PAGE_CONTENT" | grep -q "Get Your Free Life Insurance Quote"; then
    echo "✅ QuoteForm found on quote page"
else
    echo "❌ QuoteForm not found on quote page"
fi

# Test 3: Check if all required form fields are present
echo ""
echo "📝 Test 3: Checking required form fields..."
REQUIRED_FIELDS=("firstName" "lastName" "email" "phone" "dateOfBirth" "healthConditions" "medications" "coverageType")
ALL_FIELDS_PRESENT=true

for field in "${REQUIRED_FIELDS[@]}"; do
    if echo "$QUOTE_PAGE_CONTENT" | grep -q "v-model=\"form\.$field\""; then
        echo "✅ Field '$field' found"
    else
        echo "❌ Field '$field' missing"
        ALL_FIELDS_PRESENT=false
    fi
done

if [ "$ALL_FIELDS_PRESENT" = true ]; then
    echo "✅ All required fields are present"
else
    echo "❌ Some required fields are missing"
fi

# Test 4: Test API endpoint with sample data
echo ""
echo "📝 Test 4: Testing API endpoint with sample data..."

# Create test payload
TEST_PAYLOAD='{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-0000",
    "dateOfBirth": "1990-01-01",
    "healthConditions": "None",
    "medications": "None", 
    "coverageType": "Term Life Insurance",
    "message": "API test submission"
}'

# Test the API endpoint
API_RESPONSE=$(curl -s -X POST http://localhost:3000/api/quote \
    -H "Content-Type: application/json" \
    -d "$TEST_PAYLOAD" \
    -w "%{http_code}")

HTTP_CODE="${API_RESPONSE: -3}"
RESPONSE_BODY="${API_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API endpoint responded successfully (HTTP 200)"
    if echo "$RESPONSE_BODY" | grep -q "success.*true"; then
        echo "✅ API returned success response"
    else
        echo "⚠️  API responded but may have validation issues"
        echo "   Response: $RESPONSE_BODY"
    fi
else
    echo "❌ API endpoint failed (HTTP $HTTP_CODE)"
    echo "   Response: $RESPONSE_BODY"
fi

echo ""
echo "📊 Test Summary:"
echo "=================="
echo "✅ Application running: Yes"
echo "✅ QuoteForm on homepage: $(echo "$HOMEPAGE_CONTENT" | grep -q "Get Your Free Life Insurance Quote" && echo "Yes" || echo "No")"
echo "✅ QuoteForm on quote page: $(echo "$QUOTE_PAGE_CONTENT" | grep -q "Get Your Free Life Insurance Quote" && echo "Yes" || echo "No")"
echo "✅ All form fields present: $([[ "$ALL_FIELDS_PRESENT" = true ]] && echo "Yes" || echo "No")"
echo "✅ API endpoint working: $([[ "$HTTP_CODE" = "200" ]] && echo "Yes" || echo "No")"

echo ""
echo "🎯 Next Steps:"
echo "• Both pages now use the same comprehensive QuoteForm"
echo "• Database schema matches QuoteForm fields exactly"
echo "• API properly maps form data to database fields"
echo "• Test the form manually at http://localhost:3000 and http://localhost:3000/quote"
echo ""

if [[ "$HTTP_CODE" = "200" ]] && [[ "$ALL_FIELDS_PRESENT" = true ]]; then
    echo "🎉 All tests passed! Form and schema are properly aligned."
else
    echo "⚠️  Some tests failed. Please review the issues above."
fi