-- Enhanced TCPA Compliance Migration (FIXED)
-- Handles existing columns and structures properly
-- Run this in Supabase SQL Editor

-- 1. Add enhanced TCPA compliance fields to leads table (only new ones)
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS tcpa_text TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS form_version VARCHAR(20) DEFAULT 'v1.0',
ADD COLUMN IF NOT EXISTS compliance_review_status VARCHAR(20) DEFAULT 'pending';

-- Note: email_marketing_consent and unsubscribed_at already exist, so we skip them

-- 2. Add check constraints for data integrity (only if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_compliance_review_status' 
        AND table_name = 'leads'
    ) THEN
        ALTER TABLE public.leads 
        ADD CONSTRAINT check_compliance_review_status 
        CHECK (compliance_review_status IN ('pending', 'reviewed', 'flagged'));
    END IF;
END $$;

-- 3. Add comments for documentation (safe to re-run)
COMMENT ON COLUMN public.leads.tcpa_text IS 'Exact TCPA consent text presented to user at time of submission';
COMMENT ON COLUMN public.leads.ip_address IS 'IP address of user when consent was given - for audit trail';
COMMENT ON COLUMN public.leads.user_agent IS 'Browser user agent when consent was given - for audit trail';
COMMENT ON COLUMN public.leads.form_version IS 'Version of form/page when consent was captured';
COMMENT ON COLUMN public.leads.compliance_review_status IS 'Internal compliance review status';
COMMENT ON COLUMN public.leads.email_marketing_consent IS 'Separate consent for marketing emails';
COMMENT ON COLUMN public.leads.unsubscribed_at IS 'Timestamp when user unsubscribed from communications';

-- 4. Create additional indexes for compliance queries (only new ones)
CREATE INDEX IF NOT EXISTS idx_leads_compliance_review_status ON public.leads(compliance_review_status);
CREATE INDEX IF NOT EXISTS idx_leads_form_version ON public.leads(form_version);
CREATE INDEX IF NOT EXISTS idx_leads_tcpa_consent_timestamp ON public.leads(tcpa_consent_timestamp);
CREATE INDEX IF NOT EXISTS idx_leads_tcpa_text ON public.leads(tcpa_text);
CREATE INDEX IF NOT EXISTS idx_leads_ip_address ON public.leads(ip_address);

-- Note: idx_leads_unsubscribed_at and idx_leads_email_marketing_consent already exist

-- 5. Drop existing compliance report if it's a view or table and recreate properly
DROP VIEW IF EXISTS public.leads_compliance_report CASCADE;
DROP TABLE IF EXISTS public.leads_compliance_report CASCADE;

-- Create comprehensive compliance report table (fresh)
CREATE TABLE public.leads_compliance_report (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Lead identification
  lead_id UUID REFERENCES public.leads(id),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  state VARCHAR(100),
  
  -- Consent tracking
  tcpa_consent BOOLEAN,
  tcpa_consent_timestamp TIMESTAMP WITH TIME ZONE,
  tcpa_text TEXT,
  email_marketing_consent BOOLEAN,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit information
  created_at TIMESTAMP WITH TIME ZONE,
  lead_source VARCHAR(50),
  status VARCHAR(50),
  form_version VARCHAR(20),
  compliance_review_status VARCHAR(20),
  ip_address TEXT,
  
  -- Calculated compliance metrics
  days_since_consent INTEGER,
  days_since_unsubscribed INTEGER,
  consent_age_category VARCHAR(20), -- 'fresh', 'aging', 'stale'
  compliance_score INTEGER -- 1-10 compliance rating
);

-- 6. Create indexes for compliance report table (now safe)
CREATE INDEX idx_compliance_report_generated_at ON public.leads_compliance_report(generated_at DESC);
CREATE INDEX idx_compliance_report_lead_id ON public.leads_compliance_report(lead_id);
CREATE INDEX idx_compliance_report_consent_age ON public.leads_compliance_report(consent_age_category);

-- 7. Create function to calculate compliance score
CREATE OR REPLACE FUNCTION public.calculate_compliance_score(
  p_tcpa_consent BOOLEAN,
  p_tcpa_text TEXT,
  p_ip_address TEXT,
  p_days_since_consent INTEGER,
  p_unsubscribed_at TIMESTAMP WITH TIME ZONE
)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Base score for TCPA consent
  IF p_tcpa_consent THEN
    score := score + 3;
  END IF;
  
  -- Bonus for having consent text
  IF p_tcpa_text IS NOT NULL AND LENGTH(p_tcpa_text) > 0 THEN
    score := score + 2;
  END IF;
  
  -- Bonus for having IP address (audit trail)
  IF p_ip_address IS NOT NULL AND LENGTH(p_ip_address) > 0 THEN
    score := score + 1;
  END IF;
  
  -- Age-based scoring
  IF p_days_since_consent IS NOT NULL THEN
    CASE 
      WHEN p_days_since_consent <= 30 THEN score := score + 3; -- Fresh consent
      WHEN p_days_since_consent <= 90 THEN score := score + 2; -- Good consent
      WHEN p_days_since_consent <= 180 THEN score := score + 1; -- Aging consent
      ELSE score := score + 0; -- Stale consent
    END CASE;
  END IF;
  
  -- Penalty for unsubscribed leads
  IF p_unsubscribed_at IS NOT NULL THEN
    score := score - 5;
  END IF;
  
  -- Ensure score is within 1-10 range
  RETURN GREATEST(1, LEAST(10, score));
END;
$$ LANGUAGE plpgsql;

-- 8. Create function to generate compliance report
CREATE OR REPLACE FUNCTION public.generate_compliance_report()
RETURNS TABLE (
  report_summary JSONB
) AS $$
DECLARE
  total_leads INTEGER;
  compliant_leads INTEGER;
  flagged_leads INTEGER;
  report_id UUID;
BEGIN
  -- Clear previous reports (keep only last 30 days)
  DELETE FROM public.leads_compliance_report 
  WHERE generated_at < (NOW() - INTERVAL '30 days');
  
  -- Generate new compliance report
  INSERT INTO public.leads_compliance_report (
    lead_id, first_name, last_name, email, phone, state,
    tcpa_consent, tcpa_consent_timestamp, tcpa_text,
    email_marketing_consent, unsubscribed_at,
    created_at, lead_source, status, form_version,
    compliance_review_status, ip_address,
    days_since_consent, days_since_unsubscribed,
    consent_age_category, compliance_score
  )
  SELECT 
    l.id,
    l.first_name,
    l.last_name,
    l.email,
    l.phone,
    l.state,
    l.tcpa_consent,
    l.tcpa_consent_timestamp,
    l.tcpa_text,
    l.email_marketing_consent,
    l.unsubscribed_at,
    l.created_at,
    l.lead_source,
    l.status,
    l.form_version,
    l.compliance_review_status,
    l.ip_address,
    EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp)::INTEGER,
    EXTRACT(DAY FROM NOW() - l.unsubscribed_at)::INTEGER,
    CASE 
      WHEN EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp) <= 30 THEN 'fresh'
      WHEN EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp) <= 90 THEN 'aging'
      ELSE 'stale'
    END,
    public.calculate_compliance_score(
      l.tcpa_consent,
      l.tcpa_text,
      l.ip_address,
      EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp)::INTEGER,
      l.unsubscribed_at
    )
  FROM public.leads l;
  
  -- Get summary statistics
  SELECT COUNT(*) INTO total_leads FROM public.leads;
  SELECT COUNT(*) INTO compliant_leads FROM public.leads WHERE tcpa_consent = true AND unsubscribed_at IS NULL;
  SELECT COUNT(*) INTO flagged_leads FROM public.leads WHERE compliance_review_status = 'flagged';
  
  -- Return summary
  RETURN QUERY SELECT jsonb_build_object(
    'total_leads', total_leads,
    'compliant_leads', compliant_leads,
    'flagged_leads', flagged_leads,
    'compliance_rate', ROUND((compliant_leads::NUMERIC / NULLIF(total_leads, 0)) * 100, 2),
    'generated_at', NOW(),
    'report_count', (SELECT COUNT(*) FROM public.leads_compliance_report WHERE generated_at::DATE = NOW()::DATE)
  );
END;
$$ LANGUAGE plpgsql;

-- 9. Create view for easy compliance monitoring
CREATE OR REPLACE VIEW public.compliance_dashboard AS
SELECT 
  l.id,
  l.first_name,
  l.last_name,
  l.email,
  l.phone,
  l.state,
  l.tcpa_consent,
  l.tcpa_consent_timestamp,
  l.email_marketing_consent,
  l.unsubscribed_at,
  l.lead_source,
  l.status,
  l.form_version,
  l.compliance_review_status,
  l.created_at,
  EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp)::INTEGER AS days_since_consent,
  CASE 
    WHEN l.unsubscribed_at IS NOT NULL THEN 'UNSUBSCRIBED'
    WHEN l.tcpa_consent = false THEN 'NO_CONSENT'
    WHEN EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp) > 90 THEN 'AGING_CONSENT'
    WHEN l.tcpa_text IS NULL OR LENGTH(l.tcpa_text) = 0 THEN 'MISSING_CONSENT_TEXT'
    WHEN l.ip_address IS NULL THEN 'MISSING_AUDIT_TRAIL'
    ELSE 'COMPLIANT'
  END AS compliance_status,
  public.calculate_compliance_score(
    l.tcpa_consent,
    l.tcpa_text,
    l.ip_address,
    EXTRACT(DAY FROM NOW() - l.tcpa_consent_timestamp)::INTEGER,
    l.unsubscribed_at
  ) AS compliance_score
FROM public.leads l
ORDER BY l.created_at DESC;

-- 10. Grant permissions for new functions and tables
GRANT EXECUTE ON FUNCTION public.calculate_compliance_score TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.generate_compliance_report TO authenticated, service_role;
GRANT SELECT ON public.compliance_dashboard TO authenticated, service_role;
GRANT ALL ON public.leads_compliance_report TO authenticated, service_role;

-- 11. Add RLS for compliance report table
ALTER TABLE public.leads_compliance_report ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage compliance reports" ON public.leads_compliance_report
  FOR ALL
  TO authenticated
  WITH CHECK (true);

-- 12. Create a simple function to update form version when needed
CREATE OR REPLACE FUNCTION public.update_form_version(new_version VARCHAR(20))
RETURNS TEXT AS $$
BEGIN
  -- This can be called when deploying new form versions
  UPDATE public.leads 
  SET form_version = new_version 
  WHERE compliance_review_status = 'pending' 
  AND created_at > (NOW() - INTERVAL '1 hour');
  
  RETURN 'Form version updated to ' || new_version;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.update_form_version TO authenticated, service_role;