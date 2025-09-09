import { useState, useEffect, lazy, Suspense } from 'react';
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
import { ProductCard } from '@/components/buyer/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
const AnalyticsDashboard = lazy(() => import('@/components/analytics/AnalyticsDashboard'));
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
  status: string;
  total_price: number;
  created_at: string;
  products: Product;
}

const BuyerDashboard = () => {
  const { user, profile, userRole } = useAuth();
  const { addItem } = useCart();
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
      // Fetch recent products and orders in parallel
      const [productsResult, ordersResult] = await Promise.all([
        supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            category,
            price,
            unit,
            stock_quantity,
            image_url,
            is_organic,
            harvest_date,
            location,
            farmer_id,
            profiles:farmer_id (
              full_name,
              phone
            )
          `)
          .eq('is_available', true)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('orders')
          .select(`
            id,
            status,
            total_price,
            created_at,
            products (id, name)
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const productsData = productsResult.data as any[] | null;
      const ordersData = ordersResult.data as any[] | null;

      const totalOrders = ordersData?.length || 0;
      const totalSpent = ordersData?.reduce((sum: number, order: any) => sum + Number(order.total_price || 0), 0) || 0;
      const pendingOrders = ordersData?.filter((order: any) => order.status === 'pending').length || 0;

      setRecentProducts((productsData || []) as any);
      setRecentOrders((ordersData || []) as any);
      setStats({
        totalOrders,
        totalSpent,
        pendingOrders,
        favoriteProducts: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image_url: product.image_url,
      farmer_id: product.farmer_id
    }, 1);
  };

  const handleToggleWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', productId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Buyer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || 'Buyer'}!</p>
          </div>
          <Button 
            onClick={() => navigate('/buyer/products')}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Button>
        </div>

        {/* Analytics Dashboard (lazy-loaded) */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <AnalyticsDashboard userRole={userRole?.role || 'buyer'} />
        </Suspense>

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
    </DashboardLayout>
  );
};

export default BuyerDashboard;