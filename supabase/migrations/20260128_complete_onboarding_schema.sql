-- Comprehensive migration to ensure all onboarding fields exist in the profiles table
-- This script is safe to run multiple times (idempotent) due to IF NOT EXISTS checks

-- Step 1 Fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_types text[]; -- Stores the raw selection from "I am a..." (e.g. ['influencer', 'investor'])
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS advisor_sub_choices text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS influencer_channels text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_level text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_type text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investor_type text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS executive_experience text[]; 

-- Step 2 Fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS objective text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS market_objective text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_objective text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS average_content_price numeric; 
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS about_yourself text;

-- Step 3 Fields (Connections - Explicit flags)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_connected boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_connected boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_connected boolean DEFAULT false;

-- Step 4 Fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text; -- 'member', 'elite', 'advisor'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS region text; -- For Elite plan target region
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS disclaimer_accepted boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS campaign_preference text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_cause_preference text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;
