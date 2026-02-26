-- Update 50 Engagement Price ID
UPDATE public.services
SET stripe_price_id = 'price_1T52UFPcE1dEtoc2z6bUXZnt'
WHERE title = '50 Engagement';

-- Insert or Update 30 Engagement
-- First try to update if it exists
UPDATE public.services
SET stripe_price_id = 'price_1T52TfPcE1dEtoc2qkLfpUBm'
WHERE title = '30 Engagement';

-- If 30 Engagement does not exist, insert it
INSERT INTO public.services (owner_id, title, description, category, price, currency, stripe_price_id, is_active)
SELECT null, '30 Engagement', '30 Engagement package for a single post', 'Engagement', 19.00, 'USD', 'price_1T52TfPcE1dEtoc2qkLfpUBm', true
WHERE NOT EXISTS (
    SELECT 1 FROM public.services WHERE title = '30 Engagement'
);
