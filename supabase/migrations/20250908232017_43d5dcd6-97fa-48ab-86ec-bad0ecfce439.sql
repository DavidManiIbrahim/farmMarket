-- Create purchase_requests table
CREATE TABLE public.purchase_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  farmer_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid', 'completed', 'cancelled')),
  notes TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for purchase_requests
CREATE POLICY "Users can view their own purchase requests" 
ON public.purchase_requests 
FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

CREATE POLICY "Buyers can create purchase requests" 
ON public.purchase_requests 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own requests" 
ON public.purchase_requests 
FOR UPDATE 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Create trigger to update timestamps
CREATE TRIGGER update_purchase_requests_updated_at
BEFORE UPDATE ON public.purchase_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_purchase_requests_buyer_id ON public.purchase_requests(buyer_id);
CREATE INDEX idx_purchase_requests_farmer_id ON public.purchase_requests(farmer_id);
CREATE INDEX idx_purchase_requests_product_id ON public.purchase_requests(product_id);
CREATE INDEX idx_purchase_requests_status ON public.purchase_requests(status);