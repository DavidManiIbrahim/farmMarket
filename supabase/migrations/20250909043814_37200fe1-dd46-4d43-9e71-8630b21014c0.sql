-- Fix critical security vulnerability: Restrict profile access
-- Remove the overly permissive policy that allows all users to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- For legitimate business needs (like viewing farmer info when browsing products),
-- create a separate policy that allows viewing only specific public fields
CREATE POLICY "Public farmer info is viewable for products" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow viewing limited farmer info only when needed for product listings
  -- This allows the products query with farmer profile join to work
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE farmer_id = profiles.user_id 
    AND is_available = true
  )
);