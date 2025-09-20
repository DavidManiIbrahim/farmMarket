import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Package, MapPin, User, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [movingToCart, setMovingToCart] = useState<string | null>(null);

  const handleMoveToCart = async (product: any) => {
    setMovingToCart(product.id);
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image_url: product.image_url,
        farmer_id: product.farmer_id
      }, 1);
      
      // Remove from wishlist after adding to cart
      await removeFromWishlist(product.id);
    } catch (error) {
      console.error('Error moving to cart:', error);
    } finally {
      setMovingToCart(null);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/buyer/products')}
          >
            Continue Shopping
          </Button>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Save products you love by clicking the heart icon
              </p>
              <Button onClick={() => navigate('/buyer/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
                    {item.products.image_url ? (
                      <img 
                        src={item.products.image_url} 
                        alt={item.products.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Remove from Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleRemoveFromWishlist(item.products.id)}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>

                    {/* Stock Badge */}
                    {!item.products.is_available && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                    {item.products.stock_quantity < 10 && item.products.is_available && (
                      <Badge variant="secondary" className="absolute top-2 left-2">
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                        {item.products.name}
                      </h3>
                    </div>

                    {/* Farmer Info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{item.products.profiles?.full_name || 'Unknown Farmer'}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          ₦{item.products.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{item.products.unit}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.products.stock_quantity} {item.products.unit} available
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/buyer/products`)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleMoveToCart(item.products)}
                        disabled={!item.products.is_available || movingToCart === item.products.id}
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {movingToCart === item.products.id ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Wishlist;
