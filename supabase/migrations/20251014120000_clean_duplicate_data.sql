-- Migration: Clean up duplicate data
-- Description: Identifies and removes duplicate records from the leads table
-- Created: 2025-10-14

-- First, let's identify duplicates based on email and phone (most likely duplicate identifiers)
-- Create a temporary table to hold duplicate information
CREATE TEMP TABLE duplicate_leads AS
SELECT 
  email,
  phone,
  COUNT(*) as duplicate_count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created,
  ARRAY_AGG(id ORDER BY created_at) as all_ids
FROM public.leads
GROUP BY email, phone
HAVING COUNT(*) > 1;

-- Log information about duplicates found
DO $$
DECLARE
  num_duplicate_sets INTEGER;
  total_duplicate_records INTEGER;
BEGIN
  SELECT COUNT(*) INTO num_duplicate_sets FROM duplicate_leads;
  SELECT SUM(duplicate_count - 1) INTO total_duplicate_records FROM duplicate_leads;
  
  RAISE NOTICE 'Found % sets of duplicates, with % total duplicate records to clean up', num_duplicate_sets, total_duplicate_records;
  
  -- If there are duplicates, show some information
  IF num_duplicate_sets > 0 THEN
    RAISE NOTICE 'Sample duplicate emails: %', (
      SELECT STRING_AGG(email, ', ') 
      FROM (SELECT email FROM duplicate_leads LIMIT 5) sample
    );
  END IF;
END $$;

-- Keep only the most recent record for each duplicate set
-- Delete older duplicates, keeping the newest record (most recent created_at)
DELETE FROM public.leads
WHERE id IN (
  SELECT lead_id
  FROM (
    SELECT 
      id as lead_id,
      ROW_NUMBER() OVER (PARTITION BY email, phone ORDER BY created_at DESC) as rn
    FROM public.leads
    WHERE (email, phone) IN (
      SELECT email, phone 
      FROM duplicate_leads
    )
  ) ranked
  WHERE rn > 1  -- Keep only the first (newest) record, delete the rest
);

-- Add a unique constraint to prevent future duplicates on email
-- This will prevent the same email from being submitted multiple times
DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_email_per_lead' 
    AND table_name = 'leads'
  ) THEN
    ALTER TABLE public.leads 
    ADD CONSTRAINT unique_email_per_lead UNIQUE (email);
    RAISE NOTICE 'Added unique constraint on email to prevent future duplicates';
  ELSE
    RAISE NOTICE 'Unique email constraint already exists';
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    RAISE NOTICE 'Could not add unique constraint - duplicates still exist. Manual cleanup may be needed.';
END $$;

-- Optional: If job_applications table exists and contains similar data to leads,
-- we might want to consolidate or remove it if it's not being used
DO $$
BEGIN
  -- Check if job_applications table exists and if it's empty or contains data that duplicates leads
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_applications' AND table_schema = 'public') THEN
    DECLARE
      job_app_count INTEGER;
      overlapping_emails INTEGER;
    BEGIN
      SELECT COUNT(*) INTO job_app_count FROM public.job_applications;
      
      -- Check for overlapping emails between job_applications and leads
      SELECT COUNT(*) INTO overlapping_emails 
      FROM public.job_applications ja
      WHERE EXISTS (SELECT 1 FROM public.leads l WHERE l.email = ja.email);
      
      RAISE NOTICE 'Job applications table has % records, % overlap with leads table', job_app_count, overlapping_emails;
      
      -- If all job applications also exist in leads, we might want to drop the job_applications table
      -- But we'll just report this for now and let the user decide
      IF job_app_count > 0 AND overlapping_emails = job_app_count THEN
        RAISE NOTICE 'All job applications appear to be duplicated in leads table - consider manual review';
      END IF;
    END;
  END IF;
END $$;

-- Final verification - check for any remaining duplicates
DO $$
DECLARE
  remaining_duplicates INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_duplicates
  FROM (
    SELECT email, phone, COUNT(*)
    FROM public.leads
    GROUP BY email, phone
    HAVING COUNT(*) > 1
  ) still_duplicated;
  
  IF remaining_duplicates = 0 THEN
    RAISE NOTICE 'SUCCESS: No duplicate records remain in leads table';
  ELSE
    RAISE NOTICE 'WARNING: % sets of duplicates still remain - manual review needed', remaining_duplicates;
  END IF;
END $$;