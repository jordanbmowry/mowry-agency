-- Migration: Final cleanup of duplicate records in leads table
-- Description: Remove any remaining duplicate records and ensure data integrity
-- Created: 2025-10-14

-- Step 1: Check for actual duplicates in the leads table
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT email, COUNT(*)
    FROM public.leads
    GROUP BY email
    HAVING COUNT(*) > 1
  ) duplicates;
  
  RAISE NOTICE 'Found % email addresses with duplicate records in leads table', duplicate_count;
  
  -- Also check for phone number duplicates
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT phone, COUNT(*)
    FROM public.leads
    GROUP BY phone
    HAVING COUNT(*) > 1
  ) phone_duplicates;
  
  RAISE NOTICE 'Found % phone numbers with duplicate records in leads table', duplicate_count;
END $$;

-- Step 2: Remove duplicates by keeping the most recent record for each email
WITH ranked_leads AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY email 
      ORDER BY 
        created_at DESC,
        updated_at DESC,
        id DESC
    ) as rn
  FROM public.leads
),
duplicates_to_delete AS (
  SELECT id, email, created_at
  FROM ranked_leads 
  WHERE rn > 1
)
DELETE FROM public.leads 
WHERE id IN (
  SELECT id FROM duplicates_to_delete
);

-- Step 3: Log how many records were cleaned up
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Cleaned up % duplicate records from leads table', deleted_count;
END $$;

-- Step 4: Try to add unique constraint on email if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_email_per_lead' 
    AND table_name = 'leads'
    AND table_schema = 'public'
  ) THEN
    BEGIN
      ALTER TABLE public.leads 
      ADD CONSTRAINT unique_email_per_lead UNIQUE (email);
      RAISE NOTICE 'Successfully added unique constraint on email column';
    EXCEPTION
      WHEN unique_violation THEN
        RAISE NOTICE 'Cannot add unique constraint - duplicates still exist';
        -- Show which emails are still duplicated
        RAISE NOTICE 'Remaining duplicate emails: %', (
          SELECT STRING_AGG(email, ', ')
          FROM (
            SELECT email
            FROM public.leads
            GROUP BY email
            HAVING COUNT(*) > 1
            LIMIT 5
          ) remaining_dups
        );
    END;
  ELSE
    RAISE NOTICE 'Unique email constraint already exists';
  END IF;
END $$;

-- Step 5: Verify the leads_compliance_report view is working correctly
DO $$
DECLARE
  total_leads INTEGER;
  consented_leads INTEGER;
  view_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_leads FROM public.leads;
  SELECT COUNT(*) INTO consented_leads FROM public.leads WHERE tcpa_consent = true;
  SELECT COUNT(*) INTO view_count FROM public.leads_compliance_report;
  
  RAISE NOTICE 'Database summary:';
  RAISE NOTICE '  Total leads: %', total_leads;
  RAISE NOTICE '  Leads with TCPA consent: %', consented_leads;
  RAISE NOTICE '  Records in compliance view: %', view_count;
  
  IF consented_leads = view_count THEN
    RAISE NOTICE 'SUCCESS: Compliance view is correctly showing all consented leads';
  ELSE
    RAISE NOTICE 'WARNING: Compliance view count does not match consented leads count';
  END IF;
END $$;

-- Step 6: Final verification - ensure no duplicates remain
DO $$
DECLARE
  remaining_email_dups INTEGER;
  remaining_phone_dups INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_email_dups
  FROM (
    SELECT email
    FROM public.leads
    GROUP BY email
    HAVING COUNT(*) > 1
  ) email_dups;
  
  SELECT COUNT(*) INTO remaining_phone_dups
  FROM (
    SELECT phone
    FROM public.leads
    GROUP BY phone
    HAVING COUNT(*) > 1
  ) phone_dups;
  
  IF remaining_email_dups = 0 AND remaining_phone_dups = 0 THEN
    RAISE NOTICE 'SUCCESS: No duplicate records remain in leads table';
  ELSE
    RAISE NOTICE 'WARNING: % email duplicates and % phone duplicates still exist', 
                 remaining_email_dups, remaining_phone_dups;
  END IF;
END $$;