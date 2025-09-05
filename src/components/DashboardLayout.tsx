import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  User,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, profile, userRole, signOut } = useAuth();
  const navigate = useNavigate();
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
      roles: ['farmer', 'seller', 'admin']
    },
    {
      title: 'Products',
      icon: Package,
      href: '/products',
      roles: ['farmer']
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      href: '/orders',
      roles: ['farmer', 'seller']
    },
    {
      title: 'Users',
      icon: Users,
      href: '/users',
      roles: ['admin']
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      roles: ['admin']
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    userRole && item.roles.includes(userRole.role)
  );

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={cn('flex flex-col h-full bg-card border-r border-border', className)}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">FM</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">FarmMarket</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {userRole?.role} Dashboard
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => {
              if (item.href === '/dashboard') {
                navigate('/dashboard');
              } else {
                // For future routes
                navigate(item.href);
              }
              setSidebarOpen(false);
            }}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.title}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || user?.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-left"
          onClick={() => navigate('/profile')}
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-left text-destructive hover:text-destructive"
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
        'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform lg:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
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
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">FM</span>
            </div>
            <span className="font-bold text-foreground">FarmMarket</span>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;