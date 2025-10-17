-- Update status check constraint on leads table
-- Drop the old constraint
ALTER TABLE leads DROP CONSTRAINT leads_status_check;

-- Add new constraint with updated status values
ALTER TABLE leads ADD CONSTRAINT leads_status_check 
  CHECK (status IN ('new', 'in_progress', 'contacted', 'closed'));