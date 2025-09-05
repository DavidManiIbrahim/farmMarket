import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'farmer' | 'seller';
  allowedRoles?: ('admin' | 'farmer' | 'seller')[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  allowedRoles 
}: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role requirements
  if (requiredRole && userRole?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};