CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products
ADD COLUMN category_id UUID REFERENCES public.categories(id);

-- Optional: Add some default categories
INSERT INTO public.categories (name) VALUES
('Vegetable'),
('Fruit'),
('Dairy'),
('Bakery'),
('Meat');
