import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Buyer Pages
const BuyerDashboard = lazy(() => import("./pages/buyer/BuyerDashboard"));
const CartPage = lazy(() => import("./pages/buyer/Cart"));

// Farmer Pages
const FarmerDashboard = lazy(() => import("./pages/dashboards/FarmerDashboard"));
const FarmerOrders = lazy(() => import("./pages/farmer/Orders"));
const FarmerEarnings = lazy(() => import("./pages/farmer/Earnings"));
const FarmerAnalytics = lazy(() => import("./pages/farmer/Analytics"));
const OrdersPage = lazy(() => import("./pages/buyer/Orders"));
const OrderDetailsPage = lazy(() => import("./pages/buyer/OrderDetails"));
const OrderHistory = lazy(() => import("./pages/buyer/OrderHistory"));
const Wishlist = lazy(() => import("./pages/buyer/Wishlist"));
const BrowseProducts = lazy(() => import("./pages/buyer/BrowseProducts"));
const AddProduct = lazy(() => import("./pages/farmer/AddProduct"));
const FarmerProducts = lazy(() => import("./pages/farmer/FarmerProducts"));
const Requests = lazy(() => import("./pages/farmer/Requests"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationsProvider>
            <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              
              {/* Buyer routes */}
              <Route 
                path="/buyer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } 
              />
            <Route path="/buyer/products" element={<ProtectedRoute allowedRoles={['seller']}><BrowseProducts /></ProtectedRoute>} />
            <Route path="/buyer/cart" element={<ProtectedRoute allowedRoles={['seller']}><CartPage /></ProtectedRoute>} />
            <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={['seller']}><OrdersPage /></ProtectedRoute>} />
            <Route path="/buyer/orders/:id" element={<ProtectedRoute allowedRoles={['seller']}><OrderDetailsPage /></ProtectedRoute>} />
            <Route path="/buyer/order-history" element={<ProtectedRoute allowedRoles={['seller']}><OrderHistory /></ProtectedRoute>} />
            <Route path="/buyer/wishlist" element={<ProtectedRoute allowedRoles={['seller']}><Wishlist /></ProtectedRoute>} />
            {/* Farmer routes */}
            <Route path="/farmer/dashboard" element={<ProtectedRoute requiredRole="farmer"><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/farmer/orders" element={<ProtectedRoute requiredRole="farmer"><FarmerOrders /></ProtectedRoute>} />
            <Route path="/farmer/earnings" element={<ProtectedRoute requiredRole="farmer"><FarmerEarnings /></ProtectedRoute>} />
            <Route path="/farmer/analytics" element={<ProtectedRoute requiredRole="farmer"><FarmerAnalytics /></ProtectedRoute>} />
            <Route path="/farmer/add-product" element={<ProtectedRoute requiredRole="farmer"><AddProduct /></ProtectedRoute>} />
            <Route path="/farmer/products" element={<ProtectedRoute requiredRole="farmer"><FarmerProducts /></ProtectedRoute>} />
            <Route path="/farmer/requests" element={<ProtectedRoute requiredRole="farmer"><Requests /></ProtectedRoute>} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route 
                path="/farmer/*" 
                element={
                  <ProtectedRoute requiredRole="farmer">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/*" 
                element={
                  <ProtectedRoute requiredRole="seller">
                    <BuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Admin routes */}
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
            </TooltipProvider>
          </NotificationsProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;