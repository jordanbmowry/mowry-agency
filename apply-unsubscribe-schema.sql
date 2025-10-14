-- Apply unsubscribe functionality to production database
-- Run this in your Supabase SQL Editor if the schema check shows missing tables/columns

-- Step 1: Add unsubscribe columns to leads table (if they don't exist)
DO $$ 
BEGIN
    -- Add unsubscribed_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'unsubscribed_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads 
        ADD COLUMN unsubscribed_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add email_marketing_consent column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'email_marketing_consent'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.leads 
        ADD COLUMN email_marketing_consent BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Step 2: Update existing records to have email marketing consent = true by default
UPDATE public.leads 
SET email_marketing_consent = true 
WHERE email_marketing_consent IS NULL;

-- Step 3: Make email_marketing_consent NOT NULL after setting defaults
ALTER TABLE public.leads 
ALTER COLUMN email_marketing_consent SET NOT NULL;

-- Step 4: Create unsubscribes table (if it doesn't exist)
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

-- Step 5: Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_leads_email_marketing_consent 
ON public.leads(email_marketing_consent);

CREATE INDEX IF NOT EXISTS idx_leads_unsubscribed_at 
ON public.leads(unsubscribed_at);

CREATE INDEX IF NOT EXISTS idx_unsubscribes_email 
ON public.unsubscribes(email);

CREATE INDEX IF NOT EXISTS idx_unsubscribes_created_at 
ON public.unsubscribes(created_at DESC);

-- Step 6: Add comments for documentation
COMMENT ON COLUMN public.leads.unsubscribed_at IS 'Timestamp when customer unsubscribed from marketing emails';
COMMENT ON COLUMN public.leads.email_marketing_consent IS 'Whether customer consents to receiving marketing emails';
COMMENT ON TABLE public.unsubscribes IS 'Tracks email unsubscribes for CAN-SPAM compliance audit trail';

-- Step 7: Enable RLS on unsubscribes table (for consistency)
ALTER TABLE public.unsubscribes ENABLE ROW LEVEL SECURITY;

-- Step 8: Verify the setup worked
SELECT 'unsubscribes table created' as status, 
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'unsubscribes') as table_exists;

SELECT 'leads columns added' as status,
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name IN ('unsubscribed_at', 'email_marketing_consent')) as columns_added;