-- Add physical attributes columns to leads table
ALTER TABLE leads 
ADD COLUMN sex varchar(6) CHECK (sex IN ('male', 'female')),
ADD COLUMN height decimal(3,1),
ADD COLUMN weight decimal(5,1),
ADD COLUMN loan_amount decimal(10,2);

-- Add comments for clarity
COMMENT ON COLUMN leads.sex IS 'Biological sex of the lead (male/female)';
COMMENT ON COLUMN leads.height IS 'Height in decimal format (e.g., 5.5 for 5 feet 6 inches)';
COMMENT ON COLUMN leads.weight IS 'Weight in decimal format (e.g., 190.5 pounds)';
COMMENT ON COLUMN leads.loan_amount IS 'Requested loan amount in decimal format';