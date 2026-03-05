
-- Fix RLS policies for applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can select applications" ON applications;
DROP POLICY IF EXISTS "Enable insert for all users" ON applications;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON applications;

-- Re-create policies
-- 1. Allow anyone (anon + authenticated) to insert a new application
CREATE POLICY "Enable insert for all users" 
ON applications 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 2. Allow authenticated users (admins) to view applications
CREATE POLICY "Enable select for authenticated users" 
ON applications 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Allow authenticated users to update status (for admin dashboard)
CREATE POLICY "Enable update for authenticated users" 
ON applications 
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure permissions are granted
GRANT ALL ON TABLE applications TO anon;
GRANT ALL ON TABLE applications TO authenticated;
GRANT ALL ON TABLE applications TO service_role;

-- Fix Storage Policies for CVs
-- Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies for this bucket
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can select CVs" ON storage.objects;
DROP POLICY IF EXISTS "Give anon access to upload cvs" ON storage.objects;

-- Create comprehensive storage policies
-- 1. Allow anyone to upload to 'cvs' bucket
CREATE POLICY "Give anon access to upload cvs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'cvs');

-- 2. Allow anyone to read from 'cvs' bucket (since it's public)
CREATE POLICY "Give public access to read cvs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cvs');
