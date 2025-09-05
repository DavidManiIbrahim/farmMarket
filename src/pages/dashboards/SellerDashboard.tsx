import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Package, DollarSign, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
  location: string;
  farmer_id: string;
  profiles?: {
    full_name: string;
    phone?: string;
  };
}

interface Order {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
  delivery_address: string;
  created_at: string;
  products: Product;
  profiles?: {
    full_name: string;
  };
}

const SellerDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    delivery_address: '',
    notes: ''
  });

  const categories = [
    'All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Herbs', 'Other'
  ];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles!products_farmer_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as any || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (*),
          profiles!orders_farmer_id_fkey (
            full_name
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as any || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProduct) return;

    const totalPrice = selectedProduct.price * orderForm.quantity;

    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          buyer_id: user.id,
          farmer_id: selectedProduct.farmer_id,
          product_id: selectedProduct.id,
          quantity: orderForm.quantity,
          unit_price: selectedProduct.price,
          total_price: totalPrice,
          delivery_address: orderForm.delivery_address,
          notes: orderForm.notes,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Order Placed",
        description: "Your order has been submitted successfully."
      });

      setSelectedProduct(null);
      setOrderForm({ quantity: 1, delivery_address: '', notes: '' });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalSpent: orders.reduce((sum, o) => sum + o.total_price, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Buyer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || 'Buyer'}!</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-farm-blue">{stats.pendingOrders}</p>
                </div>
                <Package className="w-8 h-8 text-farm-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-harvest-gold">${stats.totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-harvest-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Browse Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category === 'All' ? '' : category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Price:</span>
                            <span>${product.price}/{product.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Stock:</span>
                            <span>{product.stock_quantity} {product.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Farmer:</span>
                            <span>{product.profiles?.full_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Location:</span>
                            <span>{product.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          {product.is_organic && (
                            <Badge variant="default" className="bg-agricultural-green">Organic</Badge>
                          )}
                        </div>

                        <Dialog 
                          open={selectedProduct?.id === product.id} 
                          onOpenChange={(open) => !open && setSelectedProduct(null)}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full" 
                              variant="farm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Order Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Place Order - {product.name}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateOrder} className="space-y-4">
                              <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max={product.stock_quantity}
                                  value={orderForm.quantity}
                                  onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
                                />
                                <p className="text-sm text-muted-foreground">
                                  Available: {product.stock_quantity} {product.unit}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label>Delivery Address</Label>
                                <Textarea
                                  value={orderForm.delivery_address}
                                  onChange={(e) => setOrderForm({ ...orderForm, delivery_address: e.target.value })}
                                  placeholder="Enter your delivery address"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Notes (Optional)</Label>
                                <Textarea
                                  value={orderForm.notes}
                                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                                  placeholder="Any special instructions"
                                />
                              </div>

                              <div className="bg-muted p-4 rounded-lg">
                                <div className="flex justify-between text-sm">
                                  <span>Unit Price:</span>
                                  <span>${product.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Quantity:</span>
                                  <span>{orderForm.quantity} {product.unit}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                  <span>Total:</span>
                                  <span>${(product.price * orderForm.quantity).toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setSelectedProduct(null)}>
                                  Cancel
                                </Button>
                                <Button type="submit" variant="farm" className="flex-1">
                                  Place Order
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet. Browse products above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{order.products.name}</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Farmer:</span> {order.profiles?.full_name}</p>
                            <p><span className="font-medium">Quantity:</span> {order.quantity} {order.products.unit}</p>
                            <p><span className="font-medium">Total:</span> ${order.total_price.toFixed(2)}</p>
                            <p><span className="font-medium">Address:</span> {order.delivery_address}</p>
                            <p><span className="font-medium">Ordered:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            order.status === 'pending' ? 'secondary' :
                            order.status === 'confirmed' ? 'default' :
                            order.status === 'delivered' ? 'default' : 'destructive'
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
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

export default SellerDashboard;