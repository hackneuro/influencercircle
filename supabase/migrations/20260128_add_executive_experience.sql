-- Add executive_experience column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS executive_experience text[];
