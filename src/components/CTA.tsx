import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Leaf } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-16 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 transform rotate-12">
          <Leaf className="w-24 h-24 text-white" />
        </div>
        <div className="absolute top-20 right-20 transform -rotate-12">
          <Leaf className="w-16 h-16 text-white" />
        </div>
        <div className="absolute bottom-10 left-1/4 transform rotate-45">
          <Leaf className="w-20 h-20 text-white" />
        </div>
        <div className="absolute bottom-20 right-10 transform -rotate-45">
          <Leaf className="w-12 h-12 text-white" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Rural Agriculture?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of farmers and buyers who are already using FarmMarket 
            to build sustainable, profitable agricultural businesses.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-8 py-4 bg-white text-agricultural-green hover:bg-white/90"
            >
              <Smartphone className="mr-2 w-5 h-5" />
              Start Buying Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-white text-agricultural-green hover:bg-white/90 hover:text-agricultural-blue"
            >
              Become a Seller
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white/90">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-sm">Secure Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">48hrs</div>
              <div className="text-sm">Average Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};