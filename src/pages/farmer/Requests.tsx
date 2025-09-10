import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';

interface Request {
  id: string;
  products: {
    name: string;
    price: number;
  };
  buyer_id: string;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  notes: string;
  total_amount: number;
  created_at: string;
}

const statusColors = {
  pending: 'bg-yellow-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
  completed: 'bg-blue-500',
};

const RequestCard = ({ request, onStatusChange }: { 
  request: Request; 
  onStatusChange: (requestId: string, newStatus: string) => Promise<void>;
}) => {
  const total = request.total_amount;

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">{request.products.name}</h3>
            <p className="text-sm text-muted-foreground">
              From: Buyer {request.buyer_id.slice(0, 8)}...
            </p>
            <p className="text-sm text-muted-foreground">
              Quantity: {request.quantity} units
            </p>
            <p className="text-sm font-semibold">
              Total: ${total.toFixed(2)}
            </p>
          </div>
          <Badge variant="outline" className={statusColors[request.status]}>
            {request.status.toUpperCase()}
          </Badge>
        </div>

        {request.notes && (
          <p className="text-sm bg-muted p-3 rounded-md mb-4">
            "{request.notes}"
          </p>
        )}

        <div className="text-sm text-muted-foreground mb-4">
          Requested on {format(new Date(request.created_at), 'PPP')}
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onStatusChange(request.id, 'accepted')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onStatusChange(request.id, 'rejected')}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}

        {request.status === 'accepted' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onStatusChange(request.id, 'completed')}
          >
            Mark as Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function Requests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // Subscribe to new requests
    const channel = supabase
      .channel('purchase_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_requests',
          filter: `farmer_id=eq.${user?.id}`,
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_requests')
        .select(`
          id,
          quantity,
          status,
          notes,
          total_amount,
          created_at,
          buyer_id,
          products(name, price)
        `)
        .eq('farmer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as Request[]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const request = requests.find(r => r.id === requestId);
      
      const { error } = await supabase
        .from('purchase_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      // Create notification for buyer when status changes
      if (newStatus !== 'pending' && request) {
        await supabase.functions.invoke('create-notification', {
          body: {
            userId: request.buyer_id,
            title: 'Request Status Updated',
            message: `Your request for ${request.products.name} has been ${newStatus}`,
            type: 'info',
            relatedId: requestId
          }
        });
      }

      toast({
        title: 'Success',
        description: `Request ${newStatus} successfully`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request',
        variant: 'destructive',
      });
    }
  };

  const filteredRequests = requests.filter(
    (request) => activeTab === 'all' || request.status === activeTab
  );

  return (
    <DashboardLayout>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Product Requests</h1>
            <p className="text-muted-foreground">
              Manage your product requests from buyers
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="accepted">
              <CheckCircle className="w-4 h-4 mr-2" />
              Accepted
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="p-6">Loading requests...</CardContent>
              </Card>
            ) : filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No {activeTab} requests found
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
