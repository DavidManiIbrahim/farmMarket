-- Clean up problematic views and functions, use simple product data only
DROP VIEW IF EXISTS public.farmer_public_info CASCADE;
DROP FUNCTION IF EXISTS public.get_farmer_public_info(uuid) CASCADE;

-- Since we can't safely expose farmer profile data without security risks,
-- let's modify products table to include a display_name field instead
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS farmer_display_name text;

-- Update existing products to use farmer's full name from profiles
UPDATE public.products 
SET farmer_display_name = (
  SELECT full_name 
  FROM public.profiles 
  WHERE profiles.user_id = products.farmer_id
)
WHERE farmer_display_name IS NULL;