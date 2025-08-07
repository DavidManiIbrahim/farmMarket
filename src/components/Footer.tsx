import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="font-bold text-xl">FarmMarket</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              Connecting rural farmers with global markets through secure, 
              trusted agricultural commerce.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#marketplace" className="text-background/80 hover:text-background transition-colors">Marketplace</a></li>
              <li><a href="#farmers" className="text-background/80 hover:text-background transition-colors">For Farmers</a></li>
              <li><a href="#buyers" className="text-background/80 hover:text-background transition-colors">For Buyers</a></li>
              <li><a href="#about" className="text-background/80 hover:text-background transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-background/80 hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-2">
              <li><a href="#help" className="text-background/80 hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#faq" className="text-background/80 hover:text-background transition-colors">FAQ</a></li>
              <li><a href="#shipping" className="text-background/80 hover:text-background transition-colors">Shipping Info</a></li>
              <li><a href="#returns" className="text-background/80 hover:text-background transition-colors">Returns</a></li>
              <li><a href="#terms" className="text-background/80 hover:text-background transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-background/60" />
                <span className="text-background/80">+234 800 FARM MARKET</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-background/60" />
                <span className="text-background/80">hello@farmmarket.ng</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-background/60 mt-1" />
                <span className="text-background/80">
                  Farm House, Agricultural Zone<br />
                  Abuja, Nigeria
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © 2024 FarmMarket. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-background/60 hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-background/60 hover:text-background transition-colors">
                Terms & Conditions
              </a>
              <a href="#cookies" className="text-background/60 hover:text-background transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};