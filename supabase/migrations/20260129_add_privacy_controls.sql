
-- Add privacy control columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT false;
