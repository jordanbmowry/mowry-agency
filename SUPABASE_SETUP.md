# Supabase Database Schema for Mowry Agency

Run these SQL commands in your Supabase SQL Editor to create the necessary tables:

## 1. Leads Table

```sql
-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  lead_source VARCHAR(50) NOT NULL CHECK (lead_source IN ('contact_form', 'join_us_form')),
  status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'not_interested')),
  agent_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index on email for faster lookups
CREATE INDEX idx_leads_email ON leads(email);

-- Create index on status for filtering
CREATE INDEX idx_leads_status ON leads(status);

-- Create index on lead_source for analytics
CREATE INDEX idx_leads_source ON leads(lead_source);

-- Create index on created_at for ordering
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

## 2. Job Applications Table

```sql
-- Create job_applications table
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  experience VARCHAR(50),
  state VARCHAR(100) NOT NULL,
  message TEXT,
  resume_url TEXT,
  status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'reviewing', 'interview_scheduled', 'hired', 'rejected')),
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index on email for faster lookups
CREATE INDEX idx_job_applications_email ON job_applications(email);

-- Create index on status for filtering
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- Create index on position for analytics
CREATE INDEX idx_job_applications_position ON job_applications(position);

-- Create index on created_at for ordering
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at DESC);
```

## 3. Row Level Security (RLS) Policies

### Enable RLS

```sql
-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
```

### Create Policies (Public Insert, Admin Read/Update)

```sql
-- Allow anyone to insert leads (for form submissions)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to insert job applications (for form submissions)
CREATE POLICY "Anyone can create job applications" ON job_applications
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read leads (for admin dashboard)
-- You can modify this based on your authentication strategy
CREATE POLICY "Authenticated users can read leads" ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can read job applications
CREATE POLICY "Authenticated users can read job applications" ON job_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can update leads
CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only authenticated users can update job applications
CREATE POLICY "Authenticated users can update job applications" ON job_applications
  FOR UPDATE
  USING (auth.role() = 'authenticated');
```

## 4. Real-time Subscriptions (Optional)

```sql
-- Enable real-time for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- Enable real-time for job applications table
ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;
```

## 5. Updated At Triggers

```sql
-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for leads table
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for job_applications table
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions:

1. **Copy your Supabase URL and Anon Key:**
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the "Project URL" and "Project API keys" → "anon public"

2. **Create your .env file:**

   ```bash
   cp .env.example .env
   ```

3. **Add your Supabase credentials to .env:**

   ```bash
   SUPABASE_URL=your-project-url-here
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run the SQL commands:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste each SQL block above
   - Run them one at a time

5. **Test the connection:**
   - Restart your development server
   - Submit a form to test the integration

## Security Notes:

- The anon key is safe to use in client-side code
- RLS policies ensure data security
- Only form submissions are allowed publicly
- Admin operations require authentication
- All sensitive operations happen server-side
