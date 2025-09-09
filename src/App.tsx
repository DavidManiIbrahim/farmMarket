import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BuyerDashboard = lazy(() => import("./pages/buyer/BuyerDashboard"));
const CartPage = lazy(() => import("./pages/buyer/Cart"));
const OrdersPage = lazy(() => import("./pages/buyer/Orders"));
const OrderDetailsPage = lazy(() => import("./pages/buyer/OrderDetails"));
const BrowseProducts = lazy(() => import("./pages/buyer/BrowseProducts"));
const AddProduct = lazy(() => import("./pages/farmer/AddProduct"));
const EditProduct = lazy(() => import("./pages/farmer/EditProduct"));
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
            <Route path="/farmer/add-product" element={<ProtectedRoute requiredRole="farmer"><AddProduct /></ProtectedRoute>} />
            <Route path="/farmer/products" element={<ProtectedRoute requiredRole="farmer"><FarmerProducts /></ProtectedRoute>} />
            <Route path="/farmer/products/edit/:id" element={<ProtectedRoute requiredRole="farmer"><EditProduct /></ProtectedRoute>} />
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
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;