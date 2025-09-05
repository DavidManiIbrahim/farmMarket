import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import FarmerDashboard from './dashboards/FarmerDashboard';
import SellerDashboard from './dashboards/SellerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userRole) {
    return <Navigate to="/auth" replace />;
  }

  switch (userRole.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'seller':
      return <SellerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

export default Dashboard;