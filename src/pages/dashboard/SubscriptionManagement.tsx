import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Pause,
  X
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

/**
 * Subscription Management Dashboard Component
 */
const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('subscription');

  // Mock data for demonstration
  const currentSubscription = {
    planName: 'Pro Plan',
    status: 'active',
    nextPaymentDate: '2024-02-15'
  };

  const transactions = [
    {
      id: '1',
      createdAt: '2024-01-15',
      reference: 'TXN123456789',
      amount: 2900,
      currency: 'NGN',
      status: 'success'
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Subscription Management</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="space-y-6 mt-6">
              {/* Current Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>
                    Your current subscription plan and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Plan</p>
                        <p className="font-medium">{currentSubscription.planName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          <span className="font-medium">Active</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Next Payment</p>
                        <p className="font-medium">{currentSubscription.nextPaymentDate}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Subscription
                      </Button>
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-6">
              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Your payment history and receipts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.createdAt}</TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">
                              {transaction.reference.substring(0, 12)}...
                            </span>
                          </TableCell>
                          <TableCell>₦{transaction.amount / 100}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Successful
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionManagement;
