-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create categories" 
ON public.categories 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Add some default categories
INSERT INTO public.categories (name) VALUES 
('Vegetables'),
('Fruits'),
('Herbs'),
('Leafy Greens'),
('Root Vegetables'),
('Grains'),
('Dairy'),
('Meat'),
('Other');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add category_id column to products table and create foreign key
ALTER TABLE public.products ADD COLUMN category_id uuid REFERENCES public.categories(id);

-- Update existing products to reference categories by name
UPDATE public.products 
SET category_id = (
  SELECT id FROM public.categories 
  WHERE public.categories.name = public.products.category
)
WHERE category IS NOT NULL;

-- We'll keep the category text column for now to maintain compatibility