import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clear, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user || items.length === 0) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          items: items.map(item => ({
            product: {
              name: item.name,
              price: item.price,
              image_url: item.image_url,
              farmer_name: item.farmer_display_name || 'Unknown Farmer'
            },
            quantity: item.quantity
          })),
          buyerId: user.id 
        }
      });

      if (error) throw error;

      if (data?.sessionId) {
        // Open Stripe checkout in new tab
        window.open(`https://checkout.stripe.com/c/pay/${data.sessionId}#fidkdWxOYHwnPyd1blpxYHZxWjA0SjJsMnd%2FZ1Y2fEEzdUQyT2JiZGpHN2tRVWdpdGZLQ1clM2B8aUxUT3J8YUpLUmNrPWxBVW5rPD1VcGZ8Y212NUZgd3U3blh8VENpV2x8N14yTVAzZnZgQlE2PX1lMnR2PScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl`, '_blank');
        clear(); // Clear cart after successful checkout
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process checkout. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          {items.length > 0 && (
            <Button variant="ghost" onClick={clear} className="text-destructive">Clear Cart</Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Items ({totalItems})</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 bg-muted rounded overflow-hidden flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-sm text-muted-foreground">No image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.unit}</p>
                        <p className="text-sm font-semibold">₦{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                          className="w-20"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">₦{totalPrice.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full mt-4" 
                  disabled={items.length === 0 || loading}
                  onClick={handleCheckout}
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CartPage;


