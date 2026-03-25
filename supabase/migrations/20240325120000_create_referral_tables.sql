-- Migration: create_referral_tables

-- 1. Add referral_code column to profiles table if it doesn't exist
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. Create referral_campaigns table
CREATE TABLE IF NOT EXISTS public.referral_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  show_inviter_name BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.referral_campaigns ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
-- Allow users to manage their own campaigns
CREATE POLICY "Users can manage their own referral campaigns"
ON public.referral_campaigns
FOR ALL
USING (auth.uid() = owner_id);

-- Allow anyone to read campaigns (needed for referral link resolution)
CREATE POLICY "Anyone can view referral campaigns"
ON public.referral_campaigns
FOR SELECT
USING (true);
