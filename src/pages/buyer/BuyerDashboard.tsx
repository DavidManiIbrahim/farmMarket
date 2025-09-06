import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { BuyerSidebar } from '@/components/buyer/BuyerSidebar';
import { ProductCard } from '@/components/buyer/ProductCard';
import { useNavigate } from 'react-router-dom';

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
  status: string;
  total_price: number;
  created_at: string;
  products: Product;
}

const BuyerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    favoriteProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch recent products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          profiles!products_farmer_id_fkey (
            full_name,
            phone
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          products (*)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate stats
      const { data: allOrders } = await supabase
        .from('orders')
        .select('status, total_price')
        .eq('buyer_id', user.id);

      const totalOrders = allOrders?.length || 0;
      const totalSpent = allOrders?.reduce((sum, order) => sum + order.total_price, 0) || 0;
      const pendingOrders = allOrders?.filter(order => order.status === 'pending').length || 0;

      setRecentProducts(productsData as any || []);
      setRecentOrders(ordersData as any || []);
      setStats({
        totalOrders,
        totalSpent,
        pendingOrders,
        favoriteProducts: 0 // TODO: Implement wishlist count
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
  };

  const handleToggleWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', productId);
  };

  if (loading) {
    return (
      <BuyerSidebar>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </BuyerSidebar>
    );
  }

  return (
    <BuyerSidebar>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.full_name || 'Buyer'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover fresh produce from local farmers
            </p>
          </div>
          <Button 
            onClick={() => navigate('/buyer/products')}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                  <p className="text-xs text-primary">All time</p>
                </div>
                <Package className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-primary">All time</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
                  <p className="text-xs text-orange-500">Awaiting delivery</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                  <p className="text-2xl font-bold text-foreground">{stats.favoriteProducts}</p>
                  <p className="text-xs text-red-500">Saved products</p>
                </div>
                <Heart className="w-8 h-8 text-red-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Orders
            </CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/buyer/orders')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground">Start shopping to see your orders here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{order.products.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total_price.toFixed(2)}</p>
                      <Badge 
                        variant={
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'confirmed' ? 'default' :
                          order.status === 'delivered' ? 'default' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Fresh Products
            </CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/buyer/products')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={false}
                    isInCart={false}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BuyerSidebar>
  );
};

export default BuyerDashboard;