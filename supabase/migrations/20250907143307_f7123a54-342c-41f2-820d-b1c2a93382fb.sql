-- Insert mock farmer profiles and products
-- First, let's add some mock farmer users with profiles and products

-- Insert mock farmer profiles (these would normally be created via signup)
INSERT INTO profiles (user_id, email, full_name, phone, address, city, state, zip_code, bio)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'john.farmer@example.com', 'John Smith', '+1-555-0101', '123 Farm Road', 'Farmville', 'CA', '95123', 'Organic vegetable farmer with 20 years experience'),
  ('22222222-2222-2222-2222-222222222222', 'mary.grower@example.com', 'Mary Johnson', '+1-555-0102', '456 Green Valley Lane', 'Greendale', 'CA', '95124', 'Fruit specialist growing seasonal organic produce'),
  ('33333333-3333-3333-3333-333333333333', 'tom.harvest@example.com', 'Tom Wilson', '+1-555-0103', '789 Sunny Acres Drive', 'Sunnydale', 'CA', '95125', 'Family farm producing fresh herbs and leafy greens')
ON CONFLICT (user_id) DO NOTHING;

-- Insert mock farmer roles
INSERT INTO user_roles (user_id, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'farmer'),
  ('22222222-2222-2222-2222-222222222222', 'farmer'),
  ('33333333-3333-3333-3333-333333333333', 'farmer')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert mock products
INSERT INTO products (
  farmer_id, 
  name, 
  description, 
  category, 
  price, 
  unit, 
  stock_quantity, 
  is_organic, 
  harvest_date, 
  location, 
  image_url,
  is_available
) VALUES 
  -- John Smith's products
  ('11111111-1111-1111-1111-111111111111', 'Fresh Tomatoes', 'Juicy red tomatoes perfect for salads and cooking', 'Vegetables', 4.50, 'lb', 150, true, '2024-01-15', 'Farmville, CA', 'https://images.unsplash.com/photo-1546470427-e4c57d78d5e6?w=400', true),
  ('11111111-1111-1111-1111-111111111111', 'Organic Carrots', 'Sweet and crunchy organic carrots', 'Vegetables', 3.25, 'lb', 200, true, '2024-01-10', 'Farmville, CA', 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400', true),
  ('11111111-1111-1111-1111-111111111111', 'Bell Peppers', 'Colorful mix of red, yellow, and green bell peppers', 'Vegetables', 5.00, 'lb', 80, true, '2024-01-18', 'Farmville, CA', 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9d4?w=400', true),
  
  -- Mary Johnson's products  
  ('22222222-2222-2222-2222-222222222222', 'Strawberries', 'Sweet and fresh strawberries, perfect for desserts', 'Fruits', 6.00, 'pint', 50, true, '2024-01-20', 'Greendale, CA', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', true),
  ('22222222-2222-2222-2222-222222222222', 'Organic Apples', 'Crisp Honeycrisp apples from our orchard', 'Fruits', 4.75, 'lb', 120, true, '2024-01-12', 'Greendale, CA', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', true),
  ('22222222-2222-2222-2222-222222222222', 'Fresh Blueberries', 'Antioxidant-rich blueberries, great for smoothies', 'Fruits', 8.00, 'pint', 30, true, '2024-01-22', 'Greendale, CA', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400', true),
  
  -- Tom Wilson's products
  ('33333333-3333-3333-3333-333333333333', 'Fresh Basil', 'Aromatic basil leaves, perfect for cooking', 'Herbs', 2.50, 'bunch', 40, true, '2024-01-25', 'Sunnydale, CA', 'https://images.unsplash.com/photo-1618616568052-d4b5d7d8f5d3?w=400', true),
  ('33333333-3333-3333-3333-333333333333', 'Baby Spinach', 'Tender baby spinach leaves for salads', 'Leafy Greens', 3.75, 'bag', 60, true, '2024-01-16', 'Sunnydale, CA', 'https://images.unsplash.com/photo-1576045057862-d3f8c06c9ecb?w=400', true),
  ('33333333-3333-3333-3333-333333333333', 'Mixed Lettuce', 'Fresh mix of lettuce varieties', 'Leafy Greens', 4.00, 'head', 35, true, '2024-01-19', 'Sunnydale, CA', 'https://images.unsplash.com/photo-1556801388-2e32c1b9f8c9?w=400', true),
  ('33333333-3333-3333-3333-333333333333', 'Fresh Rosemary', 'Fragrant rosemary sprigs for seasoning', 'Herbs', 2.25, 'bunch', 25, true, '2024-01-23', 'Sunnydale, CA', 'https://images.unsplash.com/photo-1597671963936-35e61aeb8e27?w=400', true);