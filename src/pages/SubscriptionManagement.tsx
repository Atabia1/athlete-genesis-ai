import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowUpCircle,
  Clock,
  Shield,
  Zap,
  Brain,
  Users,
  Activity,
  Edit,
  Trash,
  Plus,
  ChevronRight
} from 'lucide-react';
import {
  trackSubscription,
  EventAction,
  trackPageView
} from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePlan, SubscriptionTier } from '@/context/PlanContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SubscriptionComparison from '@/components/pricing/SubscriptionComparison';

/**
 * SubscriptionManagement: Page for managing subscription details
 *
 * This page allows users to:
 * - View their current subscription status
 * - Manage billing information
 * - Upgrade or downgrade their subscription
 * - View usage statistics
 * - Manage payment methods
 */

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { subscriptionTier, setSubscriptionTier } = usePlan();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Track page view
  useEffect(() => {
    trackPageView('Subscription Management', undefined, {
      subscription_tier: subscriptionTier
    });
  }, [subscriptionTier]);

  // Mock data for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      expiryDate: '04/2025',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'paypal',
      last4: 'user@example.com',
      isDefault: false
    }
  ]);

  // Mock data for billing history
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([
    {
      id: 'inv_1',
      date: '2023-05-01',
      amount: subscriptionTier === 'elite' ? 49.99 : subscriptionTier === 'coach' ? 19.99 : 9.99,
      status: 'paid',
      description: `${subscriptionTier?.charAt(0).toUpperCase()}${subscriptionTier?.slice(1)} Subscription - May 2023`
    },
    {
      id: 'inv_2',
      date: '2023-04-01',
      amount: subscriptionTier === 'elite' ? 49.99 : subscriptionTier === 'coach' ? 19.99 : 9.99,
      status: 'paid',
      description: `${subscriptionTier?.charAt(0).toUpperCase()}${subscriptionTier?.slice(1)} Subscription - April 2023`
    }
  ]);

  // Get subscription details based on tier
  const getSubscriptionDetails = () => {
    switch (subscriptionTier) {
      case 'elite':
        return {
          name: 'Elite AI',
          price: 49.99,
          billingCycle: 'monthly',
          nextBillingDate: '2023-06-01',
          status: 'active',
          features: [
            'All Pro features',
            'AI Coach Chat',
            'Ultra-specific plan personalization',
            'Dynamic plan editing',
            'AI-Powered Form Check',
            '24/7 Recovery Optimization'
          ],
          color: 'purple',
          icon: <Brain className="h-5 w-5" />
        };
      case 'coach':
        return {
          name: 'Coach Pro',
          price: 19.99,
          billingCycle: 'monthly',
          nextBillingDate: '2023-06-01',
          status: 'active',
          features: [
            'All Pro features',
            'Team management (up to 20 athletes)',
            'Team analytics and benchmarks',
            'AI-Generated Drill Libraries',
            'Live collaboration tools',
            'Priority support'
          ],
          color: 'orange',
          icon: <Users className="h-5 w-5" />
        };
      case 'pro':
        return {
          name: 'Pro Athlete',
          price: 9.99,
          billingCycle: 'monthly',
          nextBillingDate: '2023-06-01',
          status: 'active',
          features: [
            'Sport-specific plans',
            'Equipment-aware customization',
            'Wearable device sync',
            'Advanced analytics dashboard',
            'Track 10+ well-being metrics',
            'Basic AI Chat'
          ],
          color: 'blue',
          icon: <Zap className="h-5 w-5" />
        };
      default:
        return {
          name: 'Free',
          price: 0,
          billingCycle: 'free',
          nextBillingDate: 'N/A',
          status: 'active',
          features: [
            'Basic AI-generated workout plans',
            'Access to 10 core sports',
            'Manual workout logging',
            'Basic progress charts',
            'Limited well-being tracking'
          ],
          color: 'gray',
          icon: <Activity className="h-5 w-5" />
        };
    }
  };

  const subscriptionDetails = getSubscriptionDetails();

  // Handle subscription upgrade
  const handleUpgrade = (newTier: SubscriptionTier) => {
    setIsLoading(true);

    // Track subscription upgrade
    trackSubscription(
      newTier,
      EventAction.SUBSCRIPTION_STARTED,
      {
        previous_tier: subscriptionTier,
        upgrade_method: 'subscription_management'
      }
    );

    // Navigate to payment page
    navigate(`/payment?tier=${newTier}`);
  };

  // Handle subscription cancellation
  const handleCancel = () => {
    setIsLoading(true);

    // Track subscription cancellation
    trackSubscription(
      subscriptionTier,
      EventAction.SUBSCRIPTION_CANCELED,
      {
        cancellation_reason: 'user_initiated'
      }
    );

    // Simulate API call
    setTimeout(() => {
      setSubscriptionTier('free');
      setShowCancelDialog(false);
      setIsLoading(false);
    }, 1500);
  };

  // Format date string
  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <DashboardLayout title="Subscription Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
            <p className="text-muted-foreground">
              Manage your subscription, billing information, and payment methods
            </p>
          </div>
          {subscriptionTier !== 'elite' && (
            <Button
              className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowUpgradeDialog(true)}
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Elite
            </Button>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Your current subscription plan and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full bg-${subscriptionDetails.color}-100 text-${subscriptionDetails.color}-600 mr-4`}>
                      {subscriptionDetails.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{subscriptionDetails.name}</h3>
                      <p className="text-muted-foreground">
                        {subscriptionDetails.price > 0
                          ? `$${subscriptionDetails.price}/${subscriptionDetails.billingCycle}`
                          : 'Free Plan'}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`mt-2 md:mt-0 ${
                      subscriptionDetails.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {subscriptionDetails.status === 'active'
                      ? <CheckCircle className="mr-1 h-3 w-3" />
                      : <Clock className="mr-1 h-3 w-3" />}
                    {subscriptionDetails.status.charAt(0).toUpperCase() + subscriptionDetails.status.slice(1)}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Billing Cycle</h4>
                    <p className="font-medium">{subscriptionDetails.billingCycle.charAt(0).toUpperCase() + subscriptionDetails.billingCycle.slice(1)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Next Billing Date</h4>
                    <p className="font-medium">{formatDate(subscriptionDetails.nextBillingDate)}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Included Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subscriptionDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
                {subscriptionTier !== 'free' ? (
                  <>
                    <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
                      Cancel Subscription
                    </Button>
                    {subscriptionTier !== 'elite' && (
                      <Button onClick={() => setShowUpgradeDialog(true)}>
                        Upgrade Plan
                      </Button>
                    )}
                  </>
                ) : (
                  <Button onClick={() => setShowUpgradeDialog(true)}>
                    Upgrade to Paid Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.length > 0 ? (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 p-4 font-medium border-b">
                        <div>Date</div>
                        <div className="col-span-2">Description</div>
                        <div>Amount</div>
                        <div>Status</div>
                      </div>
                      {billingHistory.map((invoice) => (
                        <div key={invoice.id} className="grid grid-cols-5 p-4 hover:bg-muted/50">
                          <div>{formatDate(invoice.date)}</div>
                          <div className="col-span-2">{invoice.description}</div>
                          <div>${invoice.amount.toFixed(2)}</div>
                          <div>
                            <Badge
                              className={
                                invoice.status === 'paid'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : invoice.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No billing history available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                    >
                      <div className="flex items-center">
                        {method.type === 'card' ? (
                          <CreditCard className="h-5 w-5 mr-4 text-muted-foreground" />
                        ) : (
                          <Shield className="h-5 w-5 mr-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">
                            {method.type === 'card'
                              ? `Card ending in ${method.last4}`
                              : `PayPal (${method.last4})`}
                          </p>
                          {method.expiryDate && (
                            <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge className="mr-2">Default</Badge>
                        )}
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Track your feature usage and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Workout Plans Generated</span>
                      <span className="text-sm font-medium">12 / {subscriptionTier === 'free' ? '15' : 'Unlimited'}</span>
                    </div>
                    <Progress value={subscriptionTier === 'free' ? 80 : 40} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">AI Chat Messages</span>
                      <span className="text-sm font-medium">
                        {subscriptionTier === 'free'
                          ? 'Not Available'
                          : subscriptionTier === 'pro'
                            ? '25 / 50'
                            : '125 / Unlimited'}
                      </span>
                    </div>
                    {subscriptionTier === 'free' ? (
                      <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Feature not available</AlertTitle>
                        <AlertDescription>
                          Upgrade to Pro or higher to access AI Chat
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Progress
                        value={subscriptionTier === 'pro' ? 50 : 25}
                        className="h-2"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Team Members</span>
                      <span className="text-sm font-medium">
                        {subscriptionTier === 'coach' || subscriptionTier === 'elite'
                          ? '8 / 20'
                          : 'Not Available'}
                      </span>
                    </div>
                    {subscriptionTier === 'coach' || subscriptionTier === 'elite' ? (
                      <Progress value={40} className="h-2" />
                    ) : (
                      <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Feature not available</AlertTitle>
                        <AlertDescription>
                          Upgrade to Coach Pro or Elite AI to access team management
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upgrade Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Upgrade Your Subscription</DialogTitle>
              <DialogDescription>
                Choose a plan that best fits your needs
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <SubscriptionComparison />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your subscription? You'll lose access to premium features.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>You'll lose access to:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {subscriptionDetails.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionManagement;
