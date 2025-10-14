# Database Migration: TCPA Consent Compliance

## Overview

This migration adds TCPA (Telephone Consumer Protection Act) consent tracking to the leads table for legal compliance with insurance marketing regulations.

## What's Added

- `tcpa_consent` (BOOLEAN, NOT NULL) - Records user consent for contact
- `tcpa_consent_timestamp` (TIMESTAMP) - When consent was given
- Automatic timestamp management via database trigger
- Data integrity constraints and indexes
- Compliance reporting view

## How to Apply

### Option 1: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `20251014100000_add_tcpa_consent_compliance.sql`
4. Click "Run" to execute the migration

### Option 2: Via Supabase CLI

```bash
# Make sure you're in the project root
cd /Users/jordanmowry/Desktop/spotlight-nuxt

# Apply the migration
supabase migration up
```

## Verification

After applying the migration, verify it worked:

```sql
-- Check if columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('tcpa_consent', 'tcpa_consent_timestamp');

-- Check if indexes were created
SELECT indexname FROM pg_indexes
WHERE tablename = 'leads'
AND indexname LIKE '%tcpa%';

-- Verify the compliance view exists
SELECT * FROM public.leads_compliance_report LIMIT 1;
```

## Important Notes

- ✅ **Safe to run multiple times** - Uses `IF NOT EXISTS` clauses
- ✅ **Preserves existing data** - No data loss
- ✅ **Automatic timestamps** - Managed by database trigger
- ✅ **Performance optimized** - Includes appropriate indexes
- ⚠️ **New leads require consent** - `tcpa_consent` must be `true` for new records

## Integration

The quote form API (`server/api/quote.post.ts`) is already updated to:

- Require `tcpaConsent` in the request body
- Store consent status and timestamp in the database
- Validate consent before processing quotes

## Compliance Benefits

- 📋 **TCPA Compliance** - Proper consent tracking and timestamps
- 🛡️ **Legal Protection** - Audit trail for regulatory inquiries
- 📊 **Reporting** - Built-in compliance reporting view
- 🚀 **Ad Platform Ready** - Meets Google Ads and Meta requirements

## Rollback (if needed)

```sql
-- Remove added columns (use with caution)
ALTER TABLE public.leads
DROP COLUMN IF EXISTS tcpa_consent,
DROP COLUMN IF EXISTS tcpa_consent_timestamp;

-- Remove the view
DROP VIEW IF EXISTS public.leads_compliance_report;

-- Remove the trigger and function
DROP TRIGGER IF EXISTS trigger_update_tcpa_timestamp ON public.leads;
DROP FUNCTION IF EXISTS update_tcpa_timestamp();
```
