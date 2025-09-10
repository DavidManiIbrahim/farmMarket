import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { EarningsSummary, PayoutRequest } from '@/types/farmer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function FarmerEarnings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState<EarningsSummary>({
    total_earnings: 0,
    available_balance: 0,
    pending_balance: 0,
  });
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
  });

  useEffect(() => {
    if (user) {
      fetchEarningsSummary();
      fetchPayoutRequests();
    }
  }, [user]);

  const fetchEarningsSummary = async () => {
    try {
      const { data, error } = await supabase.rpc('get_farmer_earnings', {
        farmer_id: user?.id,
      });

      if (error) throw error;
      setSummary(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch earnings summary',
        variant: 'destructive',
      });
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select(\`
          *,
          processed_by_user:processed_by(
            id,
            full_name,
            email
          )
        \`)
        .eq('farmer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests(data as PayoutRequest[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch payout requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    try {
      setRequestingPayout(true);
      const amount = parseFloat(payoutForm.amount);

      if (amount > summary.available_balance) {
        throw new Error('Requested amount exceeds available balance');
      }

      const { error } = await supabase.from('payout_requests').insert({
        farmer_id: user?.id,
        amount,
        status: 'pending',
        payment_method: {
          type: 'bank_transfer',
          account_name: payoutForm.accountName,
          account_number: payoutForm.accountNumber,
          bank_name: payoutForm.bankName,
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payout request submitted successfully',
      });

      // Reset form and refresh data
      setPayoutForm({
        amount: '',
        accountName: '',
        accountNumber: '',
        bankName: '',
      });
      setDialogOpen(false);
      await Promise.all([fetchEarningsSummary(), fetchPayoutRequests()]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit payout request',
        variant: 'destructive',
      });
    } finally {
      setRequestingPayout(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatPrice(summary.total_earnings)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatPrice(summary.available_balance)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatPrice(summary.pending_balance)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Request Payout Button and Dialog */}
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={summary.available_balance === 0}
                className="w-[200px]"
              >
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  Enter your bank details and the amount you want to withdraw.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={payoutForm.amount}
                    onChange={(e) =>
                      setPayoutForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="Enter amount"
                    max={summary.available_balance}
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={payoutForm.accountName}
                    onChange={(e) =>
                      setPayoutForm((prev) => ({
                        ...prev,
                        accountName: e.target.value,
                      }))
                    }
                    placeholder="Enter account name"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={payoutForm.accountNumber}
                    onChange={(e) =>
                      setPayoutForm((prev) => ({
                        ...prev,
                        accountNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={payoutForm.bankName}
                    onChange={(e) =>
                      setPayoutForm((prev) => ({
                        ...prev,
                        bankName: e.target.value,
                      }))
                    }
                    placeholder="Enter bank name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={requestingPayout}
                >
                  Cancel
                </Button>
                <Button onClick={handleRequestPayout} disabled={requestingPayout}>
                  {requestingPayout ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payout Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Processed By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No payout requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    payoutRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{formatDate(request.created_at)}</TableCell>
                        <TableCell>{formatPrice(request.amount)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              request.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'denied'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>Bank: {request.payment_method.bank_name}</p>
                            <p>
                              Account: {request.payment_method.account_number}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.processed_by_user?.full_name || '-'}
                        </TableCell>
                        <TableCell>{request.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
