import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Package, ShoppingCart, DollarSign, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import DashboardLayout from '@/components/DashboardLayout';
import { EnhancedUsers } from '@/pages/admin/EnhancedUsers';

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  user_roles: { role: string }[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  is_available: boolean;
  profiles: {
    full_name: string;
  };
}

interface Order {
  id: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  products: {
    name: string;
  };
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch users (no join)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch products (no join)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch orders (no join)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // TODO: If you need user roles or farmer names, fetch those tables separately and map in JS

      if (!usersError && usersData) setUsers(usersData as any);
      if (!productsError && productsData) setProducts(productsData as any);
      if (!ordersError && ordersData) setOrders(ordersData as any);
      if (usersError) console.error('Users fetch error:', usersError);
      if (productsError) console.error('Products fetch error:', productsError);
      if (ordersError) console.error('Orders fetch error:', ordersError);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully."
      });

      fetchAllData();
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

      fetchAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalUsers: users.length,
    farmers: users.filter(u => u.user_roles?.some(r => r.role === 'farmer')).length,
    sellers: users.filter(u => u.user_roles?.some(r => r.role === 'seller')).length,
    totalProducts: products.length,
    availableProducts: products.filter(p => p.is_available).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total_price, 0)
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.products.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || filterStatus === '' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, products, and orders</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'products', label: 'Products' },
            { id: 'orders', label: 'Orders' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* User Statistics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.farmers} Farmers • {stats.sellers} Buyers
                </div>
              </CardContent>
            </Card>

            {/* Product Statistics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.availableProducts} Available Products
                </div>
              </CardContent>
            </Card>

            {/* Order Statistics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.pendingOrders} Pending Orders
                </div>
              </CardContent>
            </Card>

            {/* Revenue Statistics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString('en-NG')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  From {stats.totalOrders} Orders
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && <EnhancedUsers />}

        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                      <p className="text-sm">
                        ₦{product.price.toLocaleString('en-NG')} • {product.stock_quantity} in stock
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_available ? 'default' : 'secondary'}>
                        {product.is_available ? 'Available' : 'Hidden'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleProductAvailability(product.id, product.is_available)}
                      >
                        {product.is_available ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.products.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity} items • ₦{order.total_price.toLocaleString('en-NG')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;