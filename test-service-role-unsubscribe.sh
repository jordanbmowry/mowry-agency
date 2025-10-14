#!/bin/bash

echo "🧪 Testing Unsubscribe with Service Role Client"
echo "=============================================="

# Test the same token that was used
TOKEN="am9yZGFuLm1vd3J5QGdtYWlsLmNvbQ=="
EMAIL="jordan.mowry@gmail.com"

echo ""
echo "📋 Testing unsubscribe with service role client fix"
echo "📋 Token: $TOKEN"
echo "📋 Expected email: $EMAIL"
echo ""

# Test against localhost first (if running)
echo "🔄 Testing localhost (if available)..."
curl -s "http://localhost:3000/api/unsubscribe?email=${EMAIL}&token=${TOKEN}" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Localhost is running - testing there"
    curl -v "http://localhost:3000/api/unsubscribe?email=${EMAIL}&token=${TOKEN}" \
      -H "User-Agent: ServiceRoleTest/1.0" \
      --include \
      --silent \
      --show-error
else
    echo "⚠️  Localhost not running - testing production"
    
    # Test the production endpoint
    curl -v "https://mowryagency.netlify.app/api/unsubscribe?email=${EMAIL}&token=${TOKEN}" \
      -H "User-Agent: ServiceRoleTest/1.0" \
      --include \
      --silent \
      --show-error
fi

echo ""
echo ""
echo "✅ Test completed!"
echo ""
echo "🎯 What changed:"
echo "   - Now using serverSupabaseServiceRole (bypasses RLS)"
echo "   - Should be able to UPDATE leads table"
echo "   - Check Netlify function logs for detailed debug output"