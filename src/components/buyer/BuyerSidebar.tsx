import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  Package, 
  User,
  Settings, 
  LogOut,
  Menu,
  Bell,
  History
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BuyerSidebarProps {
  children: ReactNode;
  cartItemsCount?: number;
  wishlistCount?: number;
}

export const BuyerSidebar = ({ 
  children, 
  cartItemsCount = 0, 
  wishlistCount = 0 
}: BuyerSidebarProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      badge: null
    },
    {
      title: 'Browse Products',
      icon: ShoppingBag,
      href: '/buyer/products',
      badge: null
    },
    {
      title: 'Shopping Cart',
      icon: ShoppingCart,
      href: '/buyer/cart',
      badge: cartItemsCount > 0 ? cartItemsCount.toString() : null
    },
    {
      title: 'Wishlist',
      icon: Heart,
      href: '/buyer/wishlist',
      badge: wishlistCount > 0 ? wishlistCount.toString() : null
    },
    {
      title: 'My Orders',
      icon: Package,
      href: '/buyer/orders',
      badge: null
    },
    {
      title: 'Order History',
      icon: History,
      href: '/buyer/history',
      badge: null
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={cn('flex flex-col h-full bg-card border-r border-border', className)}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">FarmMarket</h2>
            <p className="text-sm text-muted-foreground">
              Buyer Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-left h-12",
              isActive(item.href) && "bg-primary/10 text-primary font-medium"
            )}
            onClick={() => {
              navigate(item.href);
              setSidebarOpen(false);
            }}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border space-y-2">
        {/* User Profile */}
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-muted/50">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || 'Buyer'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <Button
          variant="ghost"
          className="w-full justify-start text-left"
          onClick={() => navigate('/buyer/profile')}
        >
          <Settings className="w-4 h-4 mr-3" />
          Profile Settings
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-left"
          onClick={() => navigate('/buyer/notifications')}
        >
          <Bell className="w-4 h-4 mr-3" />
          Notifications
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-left text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 transform transition-transform lg:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-72">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">FarmMarket</span>
          </div>
          
          <div className="flex items-center gap-2">
            {cartItemsCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/buyer/cart')}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemsCount}
                </Badge>
              </Button>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};