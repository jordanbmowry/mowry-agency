#!/bin/bash

# Quick script to check compliance views after migration
echo "🔍 Checking Compliance Views"
echo "============================"

echo ""
echo "📊 Compliance Report View (Active Marketing Leads Only):"
echo "--------------------------------------------------------"
npx supabase sql --db-url "$SUPABASE_URL" --query "
SELECT 
  COUNT(*) as total_active_leads,
  COUNT(CASE WHEN tcpa_consent = true THEN 1 END) as tcpa_consented,
  COUNT(CASE WHEN email_marketing_consent = true THEN 1 END) as marketing_consented,
  AVG(days_since_consent) as avg_days_since_consent
FROM leads_compliance_report;
"

echo ""
echo "📊 Audit Report View (All Leads with Status):"
echo "----------------------------------------------"
npx supabase sql --db-url "$SUPABASE_URL" --query "
SELECT 
  compliance_status,
  COUNT(*) as count,
  ROUND(AVG(days_since_consent), 1) as avg_days_since_consent,
  ROUND(AVG(days_since_unsubscribed), 1) as avg_days_since_unsubscribed
FROM leads_audit_report
GROUP BY compliance_status
ORDER BY 
  CASE compliance_status
    WHEN 'ACTIVE' THEN 1
    WHEN 'UNSUBSCRIBED' THEN 2
    WHEN 'NO_TCPA_CONSENT' THEN 3
    ELSE 4
  END;
"

echo ""
echo "📊 Recent Activity Summary:"
echo "----------------------------"
npx supabase sql --db-url "$SUPABASE_URL" --query "
SELECT 
  'Last 7 days' as period,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_leads,
  COUNT(CASE WHEN unsubscribed_at >= NOW() - INTERVAL '7 days' THEN 1 END) as unsubscribes
FROM leads_audit_report

UNION ALL

SELECT 
  'Last 30 days' as period,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_leads,
  COUNT(CASE WHEN unsubscribed_at >= NOW() - INTERVAL '30 days' THEN 1 END) as unsubscribes
FROM leads_audit_report;
"

echo ""
echo "✅ View check completed!"