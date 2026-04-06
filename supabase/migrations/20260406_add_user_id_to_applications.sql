-- Add user_id to applications table to link with auth.users
ALTER TABLE IF EXISTS public.applications
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update RLS to allow users to see their own applications
-- (existing policy already allows authenticated users to see all, but let's be explicit)
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR email = auth.jwt()->>'email');
