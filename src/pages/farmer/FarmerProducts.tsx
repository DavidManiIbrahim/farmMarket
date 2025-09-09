import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { Package, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string | null;
  is_organic: boolean;
  location: string;
  is_available: boolean;
  created_at: string;
}

const FarmerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts((data as any) || []);
    } catch (e) {
      console.error('Error loading products', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !product.is_available })
        .eq('id', product.id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_available: !p.is_available } : p));
    } catch (e) {
      console.error('Error updating availability', e);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      console.error('Error deleting product', e);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Products</h1>
          <p className="text-muted-foreground">Manage the products you have created</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleAvailability(product)}>
                            <Badge variant={product.is_available ? 'default' : 'secondary'}>
                              {product.is_available ? 'Live' : 'Hidden'}
                            </Badge>
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
                      )}
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Category:</span> {product.category}</p>
                        <p><span className="font-medium">Price:</span> ${product.price}/{product.unit}</p>
                        <p><span className="font-medium">Stock:</span> {product.stock_quantity} {product.unit}</p>
                        <p><span className="font-medium">Location:</span> {product.location}</p>
                        {product.is_organic && (
                          <Badge variant="secondary" className="text-xs">Organic</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerProducts;


