-- Add unsubscribe functionality and CAN-SPAM compliance
-- Migration: 20251014130625_add_unsubscribe_functionality.sql

-- Add unsubscribe-related columns to existing leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_marketing_consent BOOLEAN DEFAULT true;

-- Update existing records to have email marketing consent = true by default
UPDATE public.leads 
SET email_marketing_consent = true 
WHERE email_marketing_consent IS NULL;

-- Make email_marketing_consent NOT NULL after setting defaults
ALTER TABLE public.leads 
ALTER COLUMN email_marketing_consent SET NOT NULL;

-- Create unsubscribes table for CAN-SPAM compliance tracking
CREATE TABLE IF NOT EXISTS public.unsubscribes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email VARCHAR(255) NOT NULL,
  reason VARCHAR(255),
  ip_address TEXT,
  user_agent TEXT,
  
  -- Ensure unique email addresses in unsubscribes
  CONSTRAINT unique_unsubscribe_email UNIQUE (email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email_marketing_consent 
ON public.leads(email_marketing_consent);

CREATE INDEX IF NOT EXISTS idx_leads_unsubscribed_at 
ON public.leads(unsubscribed_at);

CREATE INDEX IF NOT EXISTS idx_unsubscribes_email 
ON public.unsubscribes(email);

CREATE INDEX IF NOT EXISTS idx_unsubscribes_created_at 
ON public.unsubscribes(created_at DESC);

-- Add comments for documentation
COMMENT ON COLUMN public.leads.unsubscribed_at IS 'Timestamp when customer unsubscribed from marketing emails';
COMMENT ON COLUMN public.leads.email_marketing_consent IS 'Whether customer consents to receiving marketing emails';
COMMENT ON TABLE public.unsubscribes IS 'Tracks email unsubscribes for CAN-SPAM compliance audit trail';

-- Enable RLS on unsubscribes table (for consistency)
ALTER TABLE public.unsubscribes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for unsubscribes (service role access only)
DROP POLICY IF EXISTS "Service role can manage unsubscribes" ON public.unsubscribes;
CREATE POLICY "Service role can manage unsubscribes" 
ON public.unsubscribes 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);