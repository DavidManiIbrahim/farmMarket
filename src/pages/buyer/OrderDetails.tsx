import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ProductLite {
  id: string;
  name: string;
  price?: number;
}

interface OrderFull {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  quantity?: number;
  products: ProductLite | null;
}

const OrderDetailsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<OrderFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !id) return;
      try {
        const { data } = await supabase
          .from('orders')
          .select(`id, status, total_price, created_at, quantity, products (id, name, price)`) 
          .eq('buyer_id', user.id)
          .eq('id', id)
          .single();
        setOrder((data as any) || null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [user, id]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
          <Button variant="outline" onClick={() => navigate('/buyer/orders')}>Back to Orders</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : !order ? (
              <p className="text-muted-foreground">Order not found.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span>{order.products?.name || 'Product'}</span>
                </div>
                {order.quantity !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span>{order.quantity}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">${Number(order.total_price).toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;


