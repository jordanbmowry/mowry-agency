#!/bin/bash

# Test unsubscribe API endpoint directly
echo "🧪 Testing Unsubscribe API Endpoint"
echo "=================================="

# Test the same token that was used
TOKEN="am9yZGFuLm1vd3J5QGdtYWlsLmNvbQ=="
EMAIL="jordan.mowry@gmail.com"

echo ""
echo "📋 Testing unsubscribe with token: $TOKEN"
echo "📋 Expected email: $EMAIL"
echo ""

# Test the unsubscribe endpoint
echo "Making request to: https://mowryagency.com/api/unsubscribe?email=${EMAIL}&token=${TOKEN}"
echo ""

curl -v "https://mowryagency.com/api/unsubscribe?email=${EMAIL}&token=${TOKEN}" \
  -H "User-Agent: UnsubscribeTest/1.0" \
  --include \
  --silent \
  --show-error

echo ""
echo ""
echo "✅ Test completed!"
echo ""
echo "🎯 Check the server logs to see if there were any database errors"
echo "🎯 If successful, check the database for:"
echo "   - unsubscribes table should have a new record"
echo "   - leads table should have unsubscribed_at set for $EMAIL"