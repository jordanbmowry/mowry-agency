-- Complete the RLS setup after fixing the trigger syntax error

-- Create the RLS policy for quote form submissions (if it doesn't exist)
DROP POLICY IF EXISTS "quote_form_submissions" ON leads;
CREATE POLICY "quote_form_submissions" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Grant permissions to anonymous users (for form submissions)
GRANT INSERT ON leads TO anon;
GRANT SELECT ON leads TO anon;

-- Create trigger for updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();