import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Package, 
  ShoppingBag,
  DollarSign,
  BarChart,
  Settings, 
  LogOut,
  Menu,
  Bell,
  PlusCircle,
  CircleDollarSign,
  LineChart
} from 'lucide-react';

interface FarmerSidebarProps {
  children: ReactNode;
}

export const FarmerSidebar = ({ children }: FarmerSidebarProps) => {
  const { signOut } = useAuth();
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
      href: '/farmer/dashboard',
    },
    {
      title: 'Products',
      icon: Package,
      href: '/farmer/products',
    },
    {
      title: 'Add Product',
      icon: PlusCircle,
      href: '/farmer/add-product',
    },
    {
      title: 'Orders',
      icon: ShoppingBag,
      href: '/farmer/orders',
    },
    {
      title: 'Earnings',
      icon: CircleDollarSign,
      href: '/farmer/earnings',
    },
    {
      title: 'Analytics',
      icon: LineChart,
      href: '/farmer/analytics',
    },
    {
      title: 'Earnings',
      icon: DollarSign,
      href: '/farmer/earnings',
    },
    {
      title: 'Analytics',
      icon: BarChart,
      href: '/farmer/analytics',
    },
    {
      title: 'Add Product',
      icon: PlusCircle,
      href: '/farmer/products/add',
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-card transition-transform duration-200 ease-in-out md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6">
            <h1 className="text-2xl font-bold">Rural Grow</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => navigate(item.href)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Button>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};
