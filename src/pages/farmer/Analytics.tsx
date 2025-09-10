import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { SalesAnalytics } from '@/types/farmer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TimeRange = '7days' | '30days' | '90days' | '1year';

const timeRangeOptions = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: '1year', label: 'Last Year' },
];

export default function FarmerAnalytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [loading, setLoading] = useState(true);
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const startDate = getStartDate(timeRange);

      // Fetch sales analytics
      const { data: salesData, error: salesError } = await supabase.rpc(
        'get_farmer_sales_analytics',
        {
          p_farmer_id: user?.id,
          p_start_date: startDate.toISOString(),
          p_end_date: new Date().toISOString(),
        }
      );

      if (salesError) throw salesError;
      setSalesAnalytics(salesData);

      // Fetch monthly trends
      const { data: trendsData, error: trendsError } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .eq('farmer_id', user?.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (trendsError) throw trendsError;

      const trends = aggregateMonthlyTrends(trendsData);
      setMonthlyTrends(trends);

      // Fetch low stock products
      const { data: stockData, error: stockError } = await supabase
        .from('products')
        .select('id, name, stock_quantity, image_url')
        .eq('farmer_id', user?.id)
        .lt('stock_quantity', 5)
        .order('stock_quantity', { ascending: true });

      if (stockError) throw stockError;
      setLowStockProducts(stockData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range: TimeRange) => {
    const date = new Date();
    switch (range) {
      case '7days':
        date.setDate(date.getDate() - 7);
        break;
      case '30days':
        date.setDate(date.getDate() - 30);
        break;
      case '90days':
        date.setDate(date.getDate() - 90);
        break;
      case '1year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
  };

  const aggregateMonthlyTrends = (data: any[]) => {
    const trends = data.reduce((acc: any, curr: any) => {
      const date = new Date(curr.created_at);
      const monthYear = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          sales: 0,
        };
      }

      acc[monthYear].sales += curr.total_price;
      return acc;
    }, {});

    return Object.values(trends);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monthly Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatPrice(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product_name" />
                  <YAxis yAxisId="left" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => formatPrice(value)}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'total_sales') return formatPrice(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="total_quantity"
                    fill="#82ca9d"
                    name="Quantity Sold"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="total_sales"
                    fill="#8884d8"
                    name="Total Sales"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-4 rounded-lg border p-4"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock_quantity} units
                    </p>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-4">
                  No products with low stock
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
