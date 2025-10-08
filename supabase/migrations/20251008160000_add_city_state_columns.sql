-- Add separate city and state columns to leads table
-- Migration: Split location data into city and state fields

-- Add new columns for city and state
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS city VARCHAR(255),
ADD COLUMN IF NOT EXISTS state VARCHAR(2);

-- Add comment for clarity
COMMENT ON COLUMN public.leads.city IS 'City name where the lead is located';
COMMENT ON COLUMN public.leads.state IS 'US state code (2 letters) where the lead is located';

-- Optional: Add index for better query performance on location-based searches
CREATE INDEX IF NOT EXISTS idx_leads_city_state ON public.leads(city, state);
CREATE INDEX IF NOT EXISTS idx_leads_state ON public.leads(state);