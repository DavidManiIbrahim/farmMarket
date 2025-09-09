import { supabase } from '@/integrations/supabase/client';
import { mockCategories, mockProducts } from './mockProducts';

export async function seedDatabase() {
  try {
    // First, insert categories and get their IDs
    console.log('Inserting categories...');
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .upsert(mockCategories, { onConflict: 'name' })
      .select();

    if (categoryError) throw categoryError;
    console.log('Categories inserted successfully');

    // Create a map of category names to IDs
    const categoryMap = categories?.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    // Insert products with correct category IDs
    console.log('Inserting products...');
    const productsWithCategories = mockProducts.map(product => ({
      ...product,
      category_id: categoryMap[product.category],
    }));

    const { error: productError } = await supabase
      .from('products')
      .upsert(productsWithCategories);

    if (productError) throw productError;
    console.log('Products inserted successfully');

    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}
