-- Migration: Fix remaining duplicate data
-- Description: Clean up remaining duplicates that weren't handled by previous migration
-- Created: 2025-10-14

-- First, let's see what duplicates still exist
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
  
  RAISE NOTICE 'Found % email addresses with duplicate records', duplicate_count;
END $$;

-- Clean up duplicates by keeping only the most recent record for each email
-- Use a more reliable approach with CTEs
WITH duplicate_records AS (
  SELECT 
    id,
    email,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC, id DESC) as rn
  FROM public.leads
  WHERE email IN (
    SELECT email 
    FROM public.leads 
    GROUP BY email 
    HAVING COUNT(*) > 1
  )
),
records_to_delete AS (
  SELECT id 
  FROM duplicate_records 
  WHERE rn > 1
)
DELETE FROM public.leads 
WHERE id IN (SELECT id FROM records_to_delete);

-- Log how many records were deleted
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % duplicate records', deleted_count;
END $$;

-- Now try to add the unique constraint
DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_email_per_lead' 
    AND table_name = 'leads'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.leads 
    ADD CONSTRAINT unique_email_per_lead UNIQUE (email);
    RAISE NOTICE 'Successfully added unique constraint on email';
  ELSE
    RAISE NOTICE 'Unique email constraint already exists';
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Could not add unique constraint - duplicates still exist. Manual cleanup needed.';
    -- Show remaining duplicates
    RAISE NOTICE 'Remaining duplicates: %', (
      SELECT STRING_AGG(email || ' (' || count || ' records)', ', ')
      FROM (
        SELECT email, COUNT(*) as count
        FROM public.leads
        GROUP BY email
        HAVING COUNT(*) > 1
        LIMIT 10
      ) remaining
    );
END $$;

-- Final verification
DO $$
DECLARE
  remaining_duplicates INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_duplicates
  FROM (
    SELECT email
    FROM public.leads
    GROUP BY email
    HAVING COUNT(*) > 1
  ) still_duplicated;
  
  IF remaining_duplicates = 0 THEN
    RAISE NOTICE 'SUCCESS: No duplicate email records remain in leads table';
  ELSE
    RAISE NOTICE 'WARNING: % email addresses still have duplicates', remaining_duplicates;
  END IF;
END $$;