-- Add resume_url to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url text;

-- Create storage buckets for avatars and resumes
-- Note: You might need to run this in the Supabase SQL Editor if your migration system doesn't support storage operations directly
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' );

-- Policies for resumes
DROP POLICY IF EXISTS "Resumes are publicly accessible" ON storage.objects;
CREATE POLICY "Resumes are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'resumes' );

DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'resumes' );

DROP POLICY IF EXISTS "Users can update own resume" ON storage.objects;
CREATE POLICY "Users can update own resume"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( auth.uid() = owner )
  WITH CHECK ( bucket_id = 'resumes' );
