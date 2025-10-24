-- Drop the old CHECK constraint on sex column
ALTER TABLE leads 
DROP CONSTRAINT IF EXISTS leads_sex_check;

-- Add new CHECK constraint with lowercase values
ALTER TABLE leads 
ADD CONSTRAINT leads_sex_check CHECK (sex IN ('male', 'female'));

-- Update existing data to lowercase (if any exists with capitalized values)
UPDATE leads 
SET sex = LOWER(sex)
WHERE sex IN ('Male', 'Female');

-- Update column comment
COMMENT ON COLUMN leads.sex IS 'Biological sex of the lead (male/female)';
