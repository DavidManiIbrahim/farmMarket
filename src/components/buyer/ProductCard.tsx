import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, MapPin, Calendar, User, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  } | null;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onContactFarmer?: (product: Product) => void;
  isInWishlist: boolean;
  isInCart: boolean;
}

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  onContactFarmer,
  isInWishlist, 
  isInCart 
}: ProductCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => onToggleWishlist(product.id)}
            >
              <Heart className={cn(
                "w-4 h-4",
                isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} />
            </Button>

            {/* Badges */}
            <div className="absolute top-2 left-2 space-y-1">
              {product.is_organic && (
                <Badge className="bg-primary text-white">Organic</Badge>
              )}
              {product.stock_quantity < 10 && (
                <Badge variant="destructive">Low Stock</Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Farmer Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{product.profiles?.full_name}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{product.location}</span>
            </div>

            {/* Price and Stock */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${product.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{product.unit}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.stock_quantity} {product.unit} available
                </p>
              </div>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="flex-1"
              >
                View Details
              </Button>
              <Button
                onClick={() => onAddToCart(product)}
                disabled={isInCart || product.stock_quantity === 0}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Product Image */}
            {product.image_url && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>${product.price}/{product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Stock:</span>
                  <span>{product.stock_quantity} {product.unit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Farmer:</span>
                  <span>{product.profiles?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{product.location}</span>
                </div>
                {product.harvest_date && (
                  <div className="flex justify-between">
                    <span className="font-medium">Harvested:</span>
                    <span>{new Date(product.harvest_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.is_organic && (
                <Badge className="bg-primary">Organic</Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onToggleWishlist(product.id)}
                className="flex-1"
              >
                <Heart className={cn(
                  "w-4 h-4 mr-2",
                  isInWishlist ? "fill-current" : ""
                )} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button
                onClick={() => {
                  onAddToCart(product);
                  setShowDetails(false);
                }}
                disabled={isInCart || product.stock_quantity === 0}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isInCart ? 'Already in Cart' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};