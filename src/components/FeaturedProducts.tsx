import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const sampleProducts = [
  {
    id: "1",
    name: "Fresh Organic Tomatoes",
    price: 2500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1546470427-e8f832e3b41b?w=400&h=300&fit=crop",
    farmer: {
      name: "Adebayo Farm",
      location: "Ogun State",
      rating: 4.8,
      verified: true
    },
    category: "Vegetables",
    inStock: true,
    discount: 15
  },
  {
    id: "2",
    name: "Sweet Yellow Corn",
    price: 1800,
    unit: "bag",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
    farmer: {
      name: "Emeka Agric",
      location: "Enugu State",
      rating: 4.9,
      verified: true
    },
    category: "Grains",
    inStock: true
  },
  {
    id: "3",
    name: "Fresh Cassava Tubers",
    price: 3200,
    unit: "bag",
    image: "https://images.unsplash.com/photo-1609501676725-7186f28fa6a4?w=400&h=300&fit=crop",
    farmer: {
      name: "Kano Farms Ltd",
      location: "Kano State",
      rating: 4.7,
      verified: true
    },
    category: "Tubers",
    inStock: true
  },
  {
    id: "4",
    name: "Premium Rice (Local)",
    price: 4500,
    unit: "bag",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    farmer: {
      name: "Kebbi Rice Mill",
      location: "Kebbi State",
      rating: 4.6,
      verified: true
    },
    category: "Grains",
    inStock: false
  },
  {
    id: "5",
    name: "Fresh Plantain Bunches",
    price: 1500,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop",
    farmer: {
      name: "Cross River Farms",
      location: "Cross River State",
      rating: 4.8,
      verified: true
    },
    category: "Fruits",
    inStock: true,
    discount: 10
  },
  {
    id: "6",
    name: "Organic Yam Tubers",
    price: 2800,
    unit: "tuber",
    image: "https://images.unsplash.com/photo-1574636830912-a4c8b65db86f?w=400&h=300&fit=crop",
    farmer: {
      name: "Benue Yam Growers",
      location: "Benue State",
      rating: 4.9,
      verified: true
    },
    category: "Tubers",
    inStock: true
  }
];

export const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fresh from the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              Farm
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the freshest produce directly from verified farmers across Nigeria. 
            Quality guaranteed, prices fair.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8"
            onClick={() => alert('Product catalog requires Supabase integration')}
          >
            View All Products
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};