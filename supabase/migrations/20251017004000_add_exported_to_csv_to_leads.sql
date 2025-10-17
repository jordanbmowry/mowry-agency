-- Add exported_to_csv column to leads table
ALTER TABLE leads 
ADD COLUMN exported_to_csv BOOLEAN DEFAULT false;

-- Create index for better query performance
CREATE INDEX idx_leads_exported_to_csv ON leads(exported_to_csv);