-- Fix missing columns for profile image and resume
-- Run this in Supabase SQL Editor

-- 1. Add columns if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url text;

-- 2. Ensure Storage Buckets exist
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT (id) DO NOTHING;

-- 3. Update Policies (Drop first to avoid conflicts)

-- AVATARS
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated USING ( auth.uid() = owner ) WITH CHECK ( bucket_id = 'avatars' );

-- RESUMES
DROP POLICY IF EXISTS "Resumes are publicly accessible" ON storage.objects;
CREATE POLICY "Resumes are publicly accessible" ON storage.objects FOR SELECT USING ( bucket_id = 'resumes' );

DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
CREATE POLICY "Authenticated users can upload resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'resumes' );

DROP POLICY IF EXISTS "Users can update own resume" ON storage.objects;
CREATE POLICY "Users can update own resume" ON storage.objects FOR UPDATE TO authenticated USING ( auth.uid() = owner ) WITH CHECK ( bucket_id = 'resumes' );

-- 4. Force refresh of schema cache (sometimes helps)
NOTIFY pgrst, 'reload schema';
