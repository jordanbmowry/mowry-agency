-- Migration: Add unsubscribe functionality for CAN-SPAM compliance
-- Created: 2025-10-14

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
        RAISE NOTICE 'Added unsubscribed_at column to leads table';
    ELSE
        RAISE NOTICE 'unsubscribed_at column already exists in leads table';
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
        RAISE NOTICE 'Added email_marketing_consent column to leads table';
    ELSE
        RAISE NOTICE 'email_marketing_consent column already exists in leads table';
    END IF;
END $$;

-- Step 2: Update existing records to have email marketing consent = true by default
UPDATE public.leads 
SET email_marketing_consent = true 
WHERE email_marketing_consent IS NULL;

-- Step 3: Make email_marketing_consent NOT NULL after setting defaults
DO $$
BEGIN
    -- Check if the column allows NULL values
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'email_marketing_consent'
        AND table_schema = 'public'
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.leads 
        ALTER COLUMN email_marketing_consent SET NOT NULL;
        RAISE NOTICE 'Set email_marketing_consent to NOT NULL';
    ELSE
        RAISE NOTICE 'email_marketing_consent is already NOT NULL';
    END IF;
END $$;

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

-- Step 8: Create RLS policy for unsubscribes table (optional - adjust as needed)
DO $$
BEGIN
    -- Create a policy that allows authenticated users to view unsubscribes
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'unsubscribes' 
        AND policyname = 'Allow authenticated users to view unsubscribes'
    ) THEN
        CREATE POLICY "Allow authenticated users to view unsubscribes" 
        ON public.unsubscribes FOR SELECT 
        TO authenticated 
        USING (true);
        
        RAISE NOTICE 'Created RLS policy for unsubscribes table';
    ELSE
        RAISE NOTICE 'RLS policy already exists for unsubscribes table';
    END IF;
END $$;

-- Step 9: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.unsubscribes TO authenticated;
-- Note: No sequence to grant since we use UUID with gen_random_uuid()

-- Step 10: Verify the setup worked
DO $$
DECLARE
    table_count INTEGER;
    column_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_name = 'unsubscribes' AND table_schema = 'public';
    
    SELECT COUNT(*) INTO column_count 
    FROM information_schema.columns 
    WHERE table_name = 'leads' 
    AND table_schema = 'public'
    AND column_name IN ('unsubscribed_at', 'email_marketing_consent');
    
    RAISE NOTICE 'Migration verification:';
    RAISE NOTICE '- unsubscribes table exists: %', (table_count > 0);
    RAISE NOTICE '- leads columns added: % out of 2', column_count;
    
    IF table_count > 0 AND column_count = 2 THEN
        RAISE NOTICE 'Migration completed successfully!';
    ELSE
        RAISE WARNING 'Migration may have failed. Please check manually.';
    END IF;
END $$;