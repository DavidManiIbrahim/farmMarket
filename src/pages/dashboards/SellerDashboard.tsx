import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const navigate = useNavigate();
  
  // Redirect to new buyer dashboard
  useEffect(() => {
    navigate('/buyer/dashboard');
  }, [navigate]);

  return null;
};

export default SellerDashboard;