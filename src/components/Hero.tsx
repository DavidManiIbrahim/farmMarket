import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fresh Nigerian farm produce – rural farmers marketplace hero"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Connect Rural Farmers with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              Global Markets
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Breaking geographical barriers to bring fresh, quality produce directly from 
            farm to table. Secure payments, verified farmers, trusted marketplace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start Buying Fresh
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="farm" size="lg" className="text-lg px-8 py-4">
              Sell Your Produce
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-agricultural-light rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-agricultural-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">5,000+</div>
                <div className="text-sm text-muted-foreground">Verified Farmers</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-agricultural-light rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-agricultural-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">200+</div>
                <div className="text-sm text-muted-foreground">Rural Communities</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-agricultural-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-agricultural-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">₦2.5M+</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};