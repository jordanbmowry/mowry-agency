-- Fix existing data before applying new constraints
-- This migration updates existing lead_source values to match new constraints
-- Created: 2025-10-07

-- 1. First, let's see what lead_source values currently exist and update them
UPDATE public.leads 
SET lead_source = 'contact_form' 
WHERE lead_source NOT IN ('contact_form', 'quote_form', 'join_us_form');

-- 2. Update any website or other generic sources to contact_form
UPDATE public.leads 
SET lead_source = 'contact_form' 
WHERE lead_source IN ('website', 'referral', 'advertisement', 'social_media', 'phone_inquiry');

-- 3. Ensure all rows have a valid lead_source
UPDATE public.leads 
SET lead_source = 'contact_form' 
WHERE lead_source IS NULL OR lead_source = '';

-- 3.5. Update name column from first_name and last_name where available
UPDATE public.leads 
SET name = first_name || ' ' || last_name 
WHERE (name IS NULL OR name = '') AND first_name IS NOT NULL AND last_name IS NOT NULL;

-- 4. Now apply the constraint safely
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_lead_source_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_lead_source_check 
  CHECK (lead_source IN ('contact_form', 'quote_form', 'join_us_form'));

-- 5. Update status constraint safely by first updating any invalid values
UPDATE public.leads 
SET status = 'new' 
WHERE status NOT IN ('new', 'contacted', 'qualified', 'quoted', 'closed', 'not_interested');

-- 6. Apply the status constraint
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check 
  CHECK (status IN ('new', 'contacted', 'qualified', 'quoted', 'closed', 'not_interested'));

-- 7. Add a comment to document the cleanup
COMMENT ON TABLE public.leads IS 'Leads table with cleaned up constraints - updated existing data to match QuoteForm requirements';