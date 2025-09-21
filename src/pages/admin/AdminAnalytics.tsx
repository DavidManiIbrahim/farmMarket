import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import DashboardLayout from '@/components/DashboardLayout';

const AdminAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Analytics</h1>
        <p className="text-muted-foreground mb-4">View platform analytics and insights</p>
        <AnalyticsDashboard userRole="admin" />
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
