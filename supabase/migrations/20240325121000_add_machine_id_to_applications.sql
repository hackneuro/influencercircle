-- Add machine_id and machine_name to applications table
ALTER TABLE IF EXISTS public.applications
ADD COLUMN IF NOT EXISTS machine_id UUID,
ADD COLUMN IF NOT EXISTS machine_name TEXT;
