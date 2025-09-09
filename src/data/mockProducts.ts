import { addDays, subDays } from 'date-fns';

export const mockCategories = [
  { name: 'Vegetables' },
  { name: 'Fruits' },
  { name: 'Dairy' },
  { name: 'Grains' },
  { name: 'Herbs' },
  { name: 'Meat' },
  { name: 'Poultry' },
  { name: 'Eggs' }
];

export const mockProducts = [
  {
    name: 'Fresh Tomatoes',
    description: 'Locally grown, vine-ripened tomatoes. Perfect for salads and cooking.',
    price: 2.99,
    unit: 'lb',
    stock_quantity: 100,
    is_organic: true,
    harvest_date: subDays(new Date(), 2),
    location: 'Green Valley Farm',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4dacdcff9',
    is_available: true,
    category: 'Vegetables'
  },
  {
    name: 'Golden Apples',
    description: 'Sweet and crisp apples freshly picked from our orchard.',
    price: 1.99,
    unit: 'lb',
    stock_quantity: 200,
    is_organic: true,
    harvest_date: subDays(new Date(), 1),
    location: 'Sunny Orchard',
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    is_available: true,
    category: 'Fruits'
  },
  {
    name: 'Fresh Milk',
    description: 'Pure, whole milk from grass-fed cows.',
    price: 4.99,
    unit: 'gallon',
    stock_quantity: 50,
    is_organic: true,
    harvest_date: new Date(),
    location: 'Happy Cow Dairy',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    is_available: true,
    category: 'Dairy'
  },
  {
    name: 'Organic Carrots',
    description: 'Sweet and crunchy carrots, perfect for snacking or cooking.',
    price: 2.49,
    unit: 'bunch',
    stock_quantity: 75,
    is_organic: true,
    harvest_date: subDays(new Date(), 3),
    location: 'Root Valley Farm',
    image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
    is_available: true,
    category: 'Vegetables'
  },
  {
    name: 'Farm Fresh Eggs',
    description: 'Free-range chicken eggs collected daily.',
    price: 5.99,
    unit: 'dozen',
    stock_quantity: 40,
    is_organic: true,
    harvest_date: new Date(),
    location: 'Happy Hens Farm',
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f',
    is_available: true,
    category: 'Eggs'
  }
];
