-- Add onboarding_format and connect_link_token to applications table
ALTER TABLE IF EXISTS public.applications
ADD COLUMN IF NOT EXISTS onboarding_format TEXT,
ADD COLUMN IF NOT EXISTS connect_link_token TEXT;
