-- Referral program: user hierarchy + commissions + referral campaigns
-- Run in Supabase SQL editor. Uses pgcrypto (already enabled in this project).

-- 1) Profiles: referral identity + referrer pointer
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referred_by_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_referred_by_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_referred_by_id_fkey
      FOREIGN KEY (referred_by_id) REFERENCES public.profiles(id)
      ON DELETE SET NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_referral_code_key'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_referral_code_key UNIQUE (referral_code);
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text AS $$
DECLARE
  c text;
  exists_row boolean;
BEGIN
  LOOP
    c := encode(gen_random_bytes(6), 'hex'); -- 12 chars
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = c) INTO exists_row;
    IF NOT exists_row THEN
      RETURN c;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.ensure_referral_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.referral_code IS NULL OR length(trim(NEW.referral_code)) = 0 THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_ensure_referral_code ON public.profiles;
CREATE TRIGGER trg_profiles_ensure_referral_code
BEFORE INSERT OR UPDATE OF referral_code ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE public.ensure_referral_code();

CREATE OR REPLACE FUNCTION public.lock_referred_by_id()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.referred_by_id IS NOT NULL AND NEW.referred_by_id IS DISTINCT FROM OLD.referred_by_id THEN
      RAISE EXCEPTION 'referred_by_id cannot be changed once set';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_lock_referred_by_id ON public.profiles;
CREATE TRIGGER trg_profiles_lock_referred_by_id
BEFORE UPDATE OF referred_by_id ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE public.lock_referred_by_id();

-- 2) Referral campaigns (link per campaign)
CREATE TABLE IF NOT EXISTS public.referral_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  location text,
  show_inviter_name boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_timestamp_referral_campaigns ON public.referral_campaigns;
CREATE TRIGGER set_timestamp_referral_campaigns
BEFORE UPDATE ON public.referral_campaigns
FOR EACH ROW
EXECUTE PROCEDURE public.set_current_timestamp_updated_at();

ALTER TABLE public.referral_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Select own referral campaigns" ON public.referral_campaigns;
CREATE POLICY "Select own referral campaigns"
ON public.referral_campaigns
FOR SELECT
USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Insert own referral campaigns" ON public.referral_campaigns;
CREATE POLICY "Insert own referral campaigns"
ON public.referral_campaigns
FOR INSERT
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Update own referral campaigns" ON public.referral_campaigns;
CREATE POLICY "Update own referral campaigns"
ON public.referral_campaigns
FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- 3) Commissions
CREATE TABLE IF NOT EXISTS public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level int NOT NULL CHECK (level IN (1,2,3)),
  percentage numeric(6,4) NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'commissions_order_recipient_level_key'
  ) THEN
    ALTER TABLE public.commissions
      ADD CONSTRAINT commissions_order_recipient_level_key UNIQUE (order_id, recipient_id, level);
  END IF;
END$$;

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Select own commissions" ON public.commissions;
CREATE POLICY "Select own commissions"
ON public.commissions
FOR SELECT
USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Service role manage commissions" ON public.commissions;
CREATE POLICY "Service role manage commissions"
ON public.commissions
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

