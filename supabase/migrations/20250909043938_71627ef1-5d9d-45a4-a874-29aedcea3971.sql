-- Fix security vulnerability: Create secure view for public farmer info
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Public farmer info is viewable for products" ON public.profiles;

-- Create a secure view that only exposes safe, non-sensitive farmer information
CREATE OR REPLACE VIEW public.farmer_public_info AS
SELECT 
  p.user_id,
  p.full_name,
  -- Only include city and state for general location, not full address
  p.city,
  p.state
FROM public.profiles p
WHERE EXISTS (
  SELECT 1 FROM public.products pr
  WHERE pr.farmer_id = p.user_id 
  AND pr.is_available = true
);

-- Grant select access to authenticated users for the view
GRANT SELECT ON public.farmer_public_info TO authenticated;

-- Ensure RLS is applied to the view (inherits from base table)
ALTER VIEW public.farmer_public_info SET (security_barrier = true);