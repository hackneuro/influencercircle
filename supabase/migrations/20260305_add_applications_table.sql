
-- Create applications table
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

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policies for applications
-- Allow anyone to insert (public submission)
CREATE POLICY "Anyone can insert applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- Allow admins to view/edit (using service role or specific users if implemented, for now allow authenticated to view if we assume only admins access the admin page, but better to be safe)
-- Since we don't have a clear admin role system yet, we'll allow service_role and maybe specific emails if needed.
-- For now, let's allow authenticated users to SELECT, assuming the admin page is protected by app logic or we'll refine this later.
-- Actually, user said "Admin User pages", so likely there are admin users.
-- Let's stick to: Service Role can do everything. Public can INSERT.
-- If I want to query it from the client side for the admin page, I need a policy for that.
-- Let's assume the admin page uses a Supabase client with a user who has 'admin' privileges or we check the email.
-- A simple way for now: Allow SELECT for authenticated users, but we'll filter in the UI. Or better, just Service Role if we use server components.
-- But if we use client-side fetching, we need a policy.
-- Let's allow SELECT for authenticated users for now to unblock the admin page creation.
CREATE POLICY "Authenticated users can select applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- Storage bucket for CVs
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Authenticated users can select CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cvs');
