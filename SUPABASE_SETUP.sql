
-- 1. Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL, -- Influencer | Executive | Student | Beginner
  email text NOT NULL,
  mobile text NOT NULL,
  linkedin_url text,
  objective text,
  cv_url text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 3. Create Storage Bucket for CVs (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Create Policies for Applications Table
-- Allow public inserts (so anyone can apply)
CREATE POLICY "Public can insert applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- Allow admins (authenticated users) to view applications
CREATE POLICY "Admins can view applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- 5. Create Policies for Storage (CVs)
-- Allow public access to read/write CVs
CREATE POLICY "Public Access CVs"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'cvs')
WITH CHECK (bucket_id = 'cvs');
