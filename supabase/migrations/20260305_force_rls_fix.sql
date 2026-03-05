
-- Force enable RLS on applications table (just in case)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on applications to start fresh
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can select applications" ON applications;
DROP POLICY IF EXISTS "Enable insert for all users" ON applications;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON applications;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON applications;
DROP POLICY IF EXISTS "Public can insert applications" ON applications;
DROP POLICY IF EXISTS "Admins can view applications" ON applications;

-- Create ultra-permissive policies for applications
-- 1. INSERT: Allow ANYONE (anon + authenticated) to insert
CREATE POLICY "Public can insert applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- 2. SELECT: Allow authenticated users (and service role) to view
CREATE POLICY "Admins can view applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- 3. UPDATE: Allow authenticated users to update status
CREATE POLICY "Admins can update applications"
ON applications FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant explicit permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE applications TO anon, authenticated, service_role;


-- STORAGE POLICIES
-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies on storage.objects for this bucket
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select CVs" ON storage.objects;
DROP POLICY IF EXISTS "Give anon access to upload cvs" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to read cvs" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Public can read CVs" ON storage.objects;

-- Create permissive storage policies
-- 1. INSERT: Allow ANYONE to upload to 'cvs' bucket
CREATE POLICY "Public can upload CVs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'cvs');

-- 2. SELECT: Allow ANYONE to read from 'cvs' bucket
CREATE POLICY "Public can read CVs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cvs');

-- Grant usage on storage schema just in case
GRANT USAGE ON SCHEMA storage TO anon, authenticated;
GRANT ALL ON TABLE storage.objects TO anon, authenticated;
