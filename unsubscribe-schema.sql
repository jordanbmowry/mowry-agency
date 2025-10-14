-- Add unsubscribe tracking table for CAN-SPAM compliance
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.unsubscribes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  reason VARCHAR(255),
  ip_address INET,
  user_agent TEXT
);

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_unsubscribes_email ON public.unsubscribes(email);

-- Add unsubscribe status to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_marketing_consent BOOLEAN DEFAULT true;

-- Create index for email marketing queries
CREATE INDEX IF NOT EXISTS idx_leads_email_marketing_consent ON public.leads(email_marketing_consent);

-- Add comment for documentation
COMMENT ON TABLE public.unsubscribes IS 'Tracks email unsubscribes for CAN-SPAM compliance';
COMMENT ON COLUMN public.leads.unsubscribed_at IS 'Timestamp when customer unsubscribed from emails';
COMMENT ON COLUMN public.leads.email_marketing_consent IS 'Whether customer consents to marketing emails';