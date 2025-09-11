import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  farmer: {
    name: string;
    location: string;
    rating: number;
    verified: boolean;
  };
  category: string;
  inStock: boolean;
  discount?: number;
}

export const ProductCard = ({ 
  name, 
  price, 
  unit, 
  image, 
  farmer, 
  category, 
  inStock, 
  discount 
}: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const discountedPrice = discount ? price - (price * discount / 100) : price;
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="group bg-gradient-card rounded-xl shadow-card hover:shadow-hero transition-all duration-300 overflow-hidden border border-border hover:scale-105 hover:border-primary/30">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!inStock && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
          {discount && (
            <Badge className="bg-harvest-gold text-foreground text-xs">
              {discount}% OFF
            </Badge>
          )}
          {farmer.verified && (
            <Badge className="bg-farm-blue text-white text-xs">
              Verified
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
          />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <Badge variant="outline" className="mb-2 text-xs">
          {category}
        </Badge>

        {/* Product Name */}
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Farmer Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <span className="font-medium">{farmer.name}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-harvest-gold text-harvest-gold" />
              <span>{farmer.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{farmer.location}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-foreground">
              ₦{discountedPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/{unit}</span>
            {discount && (
              <span className="text-sm text-muted-foreground line-through">
                ₦{price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant={inStock ? "farm" : "outline"} 
          className="w-full" 
          disabled={!inStock}
          onClick={() => {
            if (!inStock) return;
            if (!user) {
              navigate('/auth');
            } else {
              // Add to cart functionality will be implemented later
              alert('Cart functionality will be available soon');
            }
          }}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};