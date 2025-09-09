import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, DollarSign, Users, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import DashboardLayout from '@/components/DashboardLayout';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string;
  is_organic: boolean;
  harvest_date?: string;
  expiry_date?: string;
  location: string;
  is_available: boolean;
  created_at: string;
}

const FarmerDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    unit: 'kg',
    stock_quantity: 0,
    image_url: '',
    is_organic: false,
    harvest_date: '',
    expiry_date: '',
    location: ''
  });

  const categories = [
    'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Herbs', 'Other'
  ];

  const units = ['kg', 'lbs', 'piece', 'dozen', 'bunch', 'bag'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...newProduct,
          farmer_id: user.id,
          is_available: true
        }]);

      if (error) throw error;

      toast({
        title: "Product Added",
        description: "Your product has been listed successfully."
      });

      setIsAddingProduct(false);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: 0,
        unit: 'kg',
        stock_quantity: 0,
        image_url: '',
        is_organic: false,
        harvest_date: '',
        expiry_date: '',
        location: ''
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "Product removed successfully."
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleProductAvailability = async (productId: string, isAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !isAvailable })
        .eq('id', productId);

      if (error) throw error;

      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalProducts: products.length,
    availableProducts: products.filter(p => p.is_available).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || 'Farmer'}!</p>
          </div>
          
          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button variant="farm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newProduct.unit}
                      onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="harvest_date">Harvest Date</Label>
                    <Input
                      id="harvest_date"
                      type="date"
                      value={newProduct.harvest_date}
                      onChange={(e) => setNewProduct({ ...newProduct, harvest_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newProduct.location}
                      onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                      placeholder="Farm location"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="farm">
                    Add Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard userRole="farmer" />

        {/* Products List */}
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
                <p className="text-muted-foreground">No products listed yet. Add your first product!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleProductAvailability(product.id, product.is_available)}
                          >
                            <Badge variant={product.is_available ? "default" : "secondary"}>
                              {product.is_available ? "Live" : "Hidden"}
                            </Badge>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
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

export default FarmerDashboard;