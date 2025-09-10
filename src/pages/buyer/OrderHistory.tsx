import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

interface OrderStatus {
  status: string;
  timestamp: string;
  note?: string;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_price: number;
  created_at: string;
  tracking_number?: string;
  estimated_delivery?: string;
  status_history: OrderStatus[];
  products: {
    id: string;
    name: string;
    price: number;
    unit: string;
    image_url?: string;
  };
  quantity?: number;
}

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            total_price,
            created_at,
            tracking_number,
            estimated_delivery,
            status_history,
            quantity,
            products (
              id,
              name,
              price,
              unit,
              image_url
            )
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders((data as any) || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed' },
      { key: 'processing', label: 'Processing' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' }
    ];

    const currentIndex = steps.findIndex(step => step.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
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
        <h1 className="text-3xl font-bold text-foreground">Order History & Tracking</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">Start shopping to see your order history here</p>
              <Button onClick={() => navigate('/buyer/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const progressSteps = getProgressSteps(order.status);
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <p className="text-lg font-semibold mt-1">
                          ${Number(order.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Product Info */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      {order.products.image_url ? (
                        <img 
                          src={order.products.image_url} 
                          alt={order.products.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{order.products.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${order.products.price}/{order.products.unit}
                          {order.quantity && ` • Qty: ${order.quantity}`}
                        </p>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.tracking_number && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                          <p className="text-sm text-blue-700 font-mono">{order.tracking_number}</p>
                        </div>
                      </div>
                    )}

                    {order.estimated_delivery && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Estimated Delivery</p>
                          <p className="text-sm text-green-700">
                            {new Date(order.estimated_delivery).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Progress Stepper */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Order Progress</h4>
                      <div className="flex items-center justify-between">
                        {progressSteps.map((step, index) => (
                          <div key={step.key} className="flex flex-col items-center flex-1">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center mb-2
                              ${step.completed 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                              }
                            `}>
                              {step.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-medium">{index + 1}</span>
                              )}
                            </div>
                            <span className={`text-xs text-center ${
                              step.current ? 'font-medium text-primary' : 'text-muted-foreground'
                            }`}>
                              {step.label}
                            </span>
                            {index < progressSteps.length - 1 && (
                              <div className={`
                                absolute top-4 left-1/2 w-full h-0.5 -z-10
                                ${step.completed ? 'bg-primary' : 'bg-muted'}
                              `} style={{ width: 'calc(100% - 2rem)', marginLeft: '2rem' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status History */}
                    {order.status_history && order.status_history.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Status History</h4>
                        <div className="space-y-2">
                          {order.status_history.map((status, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="capitalize font-medium">{status.status}</span>
                              <span className="text-muted-foreground">
                                {new Date(status.timestamp).toLocaleString()}
                              </span>
                              {status.note && (
                                <span className="text-muted-foreground">• {status.note}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderHistory;
