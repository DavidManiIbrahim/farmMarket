import { Shield, CreditCard, MapPin, Users, TrendingUp, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Farmers Only",
    description: "All farmers are verified through our rigorous screening process to ensure quality and authenticity.",
    color: "text-agricultural-green"
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and secure payment processing with Flutterwave and Paystack integration for peace of mind.",
    color: "text-farm-blue"
  },
  {
    icon: MapPin,
    title: "Nationwide Delivery",
    description: "Connect with farmers from rural areas across Nigeria and get fresh produce delivered to your doorstep.",
    color: "text-harvest-gold"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built for farmers, by farmers. Supporting rural communities and sustainable agriculture practices.",
    color: "text-earth-brown"
  },
  {
    icon: TrendingUp,
    title: "Fair Pricing",
    description: "Transparent pricing that ensures farmers get fair value while buyers get competitive rates.",
    color: "text-agricultural-green"
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Every product comes with our quality guarantee. Not satisfied? We'll make it right.",
    color: "text-farm-blue"
  }
];

export const Features = () => {
  return (
    <section className="py-16 bg-agricultural-light/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              FarmMarket?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're revolutionizing how rural farmers connect with buyers, 
            ensuring trust, quality, and fair trade for everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-background rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-agricultural-light rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};