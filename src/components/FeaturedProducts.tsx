import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import organicTomatoes from "@/assets/organic-tomatoes.jpg";
import yellowCorn from "@/assets/yellow-corn.jpg";
import cassavaTubers from "@/assets/cassava-tubers.jpg";
import premiumRice from "@/assets/premium-rice.jpg";
import plantainBunches from "@/assets/plantain-bunches.jpg";
import organicYam from "@/assets/organic-yam.jpg";

const sampleProducts = [
  {
    id: "1",
    name: "Fresh Organic Tomatoes",
    price: 125000,
    unit: "kg",
    image: organicTomatoes,
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
    price: 180000,
    unit: "bag",
    image: yellowCorn,
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
    price: 150000,
    unit: "bag",
    image: cassavaTubers,
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
    price: 200000,
    unit: "bag",
    image: premiumRice,
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
    price: 100000,
    unit: "bunch",
    image: plantainBunches,
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
    price: 135000,
    unit: "tuber",
    image: organicYam,
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
  const navigate = useNavigate();
  const { user } = useAuth();
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
            onClick={() => user ? navigate('/buyer/products') : navigate('/auth')}
          >
            View All Products
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};