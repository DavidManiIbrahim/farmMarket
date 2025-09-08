import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  DollarSign,
  Users,
  Star,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  totalProducts: number;
  totalRequests: number;
  totalValue: number;
  paidRequests: number;
  recentRequests: any[];
  productsByCategory: { [key: string]: number };
  monthlyRevenue: number;
}

interface AnalyticsDashboardProps {
  userRole: string;
}

const AnalyticsDashboard = ({ userRole }: AnalyticsDashboardProps) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProducts: 0,
    totalRequests: 0,
    totalValue: 0,
    paidRequests: 0,
    recentRequests: [],
    productsByCategory: {},
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, userRole]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      let totalProducts = 0;
      let totalRequests = 0;
      let totalValue = 0;
      let paidRequests = 0;
      let recentRequests: any[] = [];
      let productsByCategory: { [key: string]: number } = {};
      let monthlyRevenue = 0;

      if (userRole === 'farmer') {
        // Farmer analytics
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('farmer_id', user.id);

        const { data: requests } = await supabase
          .from('purchase_requests')
          .select(`
            *,
            products (name, category, price),
            profiles:buyer_id (full_name)
          `)
          .eq('farmer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        totalProducts = products?.length || 0;
        totalRequests = requests?.length || 0;
        paidRequests = requests?.filter(r => r.status === 'paid').length || 0;
        totalValue = requests?.reduce((sum, r) => sum + Number(r.total_amount), 0) || 0;
        monthlyRevenue = requests?.filter(r => 
          r.status === 'paid' && 
          new Date(r.created_at).getMonth() === new Date().getMonth()
        ).reduce((sum, r) => sum + Number(r.total_amount), 0) || 0;

        recentRequests = requests || [];

        // Group products by category
        products?.forEach(product => {
          productsByCategory[product.category] = (productsByCategory[product.category] || 0) + 1;
        });

      } else if (userRole === 'seller' || userRole === 'buyer') {
        // Buyer/Seller analytics
        const { data: requests } = await supabase
          .from('purchase_requests')
          .select(`
            *,
            products (name, category, price),
            profiles:farmer_id (full_name)
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        totalRequests = requests?.length || 0;
        paidRequests = requests?.filter(r => r.status === 'paid').length || 0;
        totalValue = requests?.reduce((sum, r) => sum + Number(r.total_amount), 0) || 0;
        recentRequests = requests || [];

      } else if (userRole === 'admin') {
        // Admin analytics
        const { data: products } = await supabase
          .from('products')
          .select('*');

        const { data: requests } = await supabase
          .from('purchase_requests')
          .select(`
            *,
            products (name, category),
            buyer:profiles!buyer_id (full_name),
            farmer:profiles!farmer_id (full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: users } = await supabase
          .from('profiles')
          .select('*');

        totalProducts = products?.length || 0;
        totalRequests = requests?.length || 0;
        paidRequests = requests?.filter(r => r.status === 'paid').length || 0;
        totalValue = requests?.reduce((sum, r) => sum + Number(r.total_amount), 0) || 0;
        recentRequests = requests || [];

        // Group products by category for admin
        products?.forEach(product => {
          productsByCategory[product.category] = (productsByCategory[product.category] || 0) + 1;
        });
      }

      setAnalytics({
        totalProducts,
        totalRequests,
        totalValue,
        paidRequests,
        recentRequests,
        productsByCategory,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userRole === 'farmer' && (
          <>
            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purchase Requests</p>
                    <p className="text-2xl font-bold text-agricultural-green">{analytics.totalRequests}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-agricultural-green" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-harvest-gold">{formatCurrency(analytics.totalValue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-harvest-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid Orders</p>
                    <p className="text-2xl font-bold text-farm-blue">{analytics.paidRequests}</p>
                  </div>
                  <Star className="w-8 h-8 text-farm-blue" />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {(userRole === 'seller' || userRole === 'buyer') && (
          <>
            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.totalRequests}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Orders</p>
                    <p className="text-2xl font-bold text-agricultural-green">{analytics.paidRequests}</p>
                  </div>
                  <Star className="w-8 h-8 text-agricultural-green" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-harvest-gold">{formatCurrency(analytics.totalValue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-harvest-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-farm-blue">
                      {analytics.totalRequests > 0 ? Math.round((analytics.paidRequests / analytics.totalRequests) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-farm-blue" />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold text-agricultural-green">{analytics.totalRequests}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-agricultural-green" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                    <p className="text-2xl font-bold text-harvest-gold">{formatCurrency(analytics.totalValue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-harvest-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-farm-blue">
                      {analytics.totalRequests > 0 ? Math.round((analytics.paidRequests / analytics.totalRequests) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-farm-blue" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent {userRole === 'farmer' ? 'Purchase Requests' : 'Orders'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {analytics.recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{request.products?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {request.quantity} • {formatCurrency(request.total_amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'paid' ? 'bg-agricultural-light text-agricultural-green' :
                      request.status === 'pending' ? 'bg-harvest-gold/20 text-harvest-gold' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;