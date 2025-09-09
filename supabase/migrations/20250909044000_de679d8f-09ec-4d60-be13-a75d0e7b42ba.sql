-- Fix the security definer view issue by creating a proper RLS-compliant view
DROP VIEW IF EXISTS public.farmer_public_info;

-- Create a simple view without security definer that respects RLS
CREATE VIEW public.farmer_public_info AS
SELECT 
  p.user_id,
  p.full_name,
  p.city,
  p.state
FROM public.profiles p
WHERE EXISTS (
  SELECT 1 FROM public.products pr
  WHERE pr.farmer_id = p.user_id 
  AND pr.is_available = true
);

-- Create a secure function to get farmer public info
CREATE OR REPLACE FUNCTION public.get_farmer_public_info(farmer_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  city text,
  state text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.full_name,
    p.city,
    p.state
  FROM public.profiles p
  WHERE p.user_id = farmer_user_id
  AND EXISTS (
    SELECT 1 FROM public.products pr
    WHERE pr.farmer_id = p.user_id 
    AND pr.is_available = true
  );
$$;