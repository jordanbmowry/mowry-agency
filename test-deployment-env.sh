#!/bin/bash

echo "🔍 Checking Environment Configuration on Deployment"
echo "=================================================="

echo ""
echo "📋 Testing environment variables on mowryagency.netlify.app..."

curl -s "https://mowryagency.netlify.app/api/debug-env" | jq . || \
curl -s "https://mowryagency.netlify.app/api/debug-env"

echo ""
echo ""
echo "📋 Testing environment variables on mowryagency.com..."

curl -s "https://mowryagency.com/api/debug-env" | jq . || \
curl -s "https://mowryagency.com/api/debug-env"

echo ""
echo ""
echo "✅ Environment check completed!"
echo ""
echo "🎯 What to look for:"
echo "- supabaseUrl and supabaseKey should be 'isSet: true'"
echo "- supabaseConnection should be 'success: true'"
echo "- If any are false, check Netlify environment variables"