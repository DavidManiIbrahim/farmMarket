import { Button } from "@/components/ui/button";
import { Search, User, ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="font-bold text-xl text-foreground">FarmMarket</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#marketplace" className="text-foreground hover:text-primary transition-colors">
            Marketplace
          </a>
          <a href="#farmers" className="text-foreground hover:text-primary transition-colors">
            For Farmers
          </a>
          <a href="#buyers" className="text-foreground hover:text-primary transition-colors">
            For Buyers
          </a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors">
            About
          </a>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search fresh produce..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => alert('Cart functionality requires backend integration')}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => alert('Login requires Supabase integration')}
          >
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>
          <Button 
            variant="farm"
            onClick={() => alert('Farmer registration requires Supabase integration')}
          >
            Join as Farmer
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search fresh produce..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            {/* Mobile Navigation */}
            <nav className="space-y-4 mb-4">
              <a href="#marketplace" className="block text-foreground hover:text-primary transition-colors">
                Marketplace
              </a>
              <a href="#farmers" className="block text-foreground hover:text-primary transition-colors">
                For Farmers
              </a>
              <a href="#buyers" className="block text-foreground hover:text-primary transition-colors">
                For Buyers
              </a>
              <a href="#about" className="block text-foreground hover:text-primary transition-colors">
                About
              </a>
            </nav>

            {/* Mobile Actions */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => alert('Login requires Supabase integration')}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                variant="farm" 
                className="w-full"
                onClick={() => alert('Farmer registration requires Supabase integration')}
              >
                Join as Farmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};