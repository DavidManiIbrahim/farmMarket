-- Fix RLS security issues
ALTER TABLE public.farmer_public_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for these tables
CREATE POLICY "Users can view their own farmer info" 
ON public.farmer_public_info 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own farmer info" 
ON public.farmer_public_info 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farmer info" 
ON public.farmer_public_info 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Notifications policies (if needed)
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Request notifications policies
CREATE POLICY "Users can view their own request notifications" 
ON public.request_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Requests policies
CREATE POLICY "Users can view their own requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

CREATE POLICY "Users can create requests" 
ON public.requests 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own requests" 
ON public.requests 
FOR UPDATE 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Users table policies (basic access)
CREATE POLICY "Users can view public user info" 
ON public.users 
FOR SELECT 
USING (true);