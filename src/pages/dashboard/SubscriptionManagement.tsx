/**
 * Subscription Management Dashboard
 *
 * This page allows users to:
 * - View their current subscription
 * - Upgrade or downgrade their subscription
 * - Cancel or pause their subscription
 * - View their payment history
 * - Download receipts
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { usePaystack } from '@/hooks/use-paystack';
import { usePlan } from '@/context/PlanContext';
import { useFeatureAccess } from '@/context/FeatureAccessContext';
import {
  PaymentPlan,
  Subscription,
  PaymentTransaction,
  PaymentStatus,
  PaymentType
} from '@/services/api/paystack-service';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import {
  CreditCard,
  Calendar,
  Clock,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
  X,
  CheckCircle,
  AlertCircle,
  Tag,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard';

/**
 * Format currency amount
 */
const formatCurrency = (amount: number, currency: string = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount / 100); // Convert from smallest currency unit
};

/**
 * Format date
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Subscription Management Dashboard Component
 */
const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOwner } = useFeatureAccess();
  const { currentPlan, updatePlan } = usePlan();
  const {
    getSubscriptions,
    getSubscriptionPlans,
    getTransactionHistory,
    generateReceipt,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
    createSubscription,
    validateDiscountCode,
    isLoading
  } = usePaystack();

  // State
  const [activeTab, setActiveTab] = useState('subscription');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountValid, setDiscountValid] = useState<boolean | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load subscriptions
        const userSubscriptions = await getSubscriptions();
        setSubscriptions(userSubscriptions);

        // Load plans
        const availablePlans = await getSubscriptionPlans();
        setPlans(availablePlans);

        // Load transaction history
        const history = await getTransactionHistory();
        setTransactions(history);
      } catch (error) {
        console.error('Error loading subscription data:', error);
        toast({
          title: 'Error loading data',
          description: 'We couldn\'t load your subscription data. Please try again.',
          variant: 'destructive',
        });
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Get current subscription
  const currentSubscription = subscriptions.find(sub => sub.status === 'active');

  // Handle plan change
  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    setDiscountCode('');
    setDiscountValid(null);
    setDiscountAmount(0);
  };

  // Validate discount code
  const handleValidateDiscountCode = async () => {
    if (!discountCode || !selectedPlan) return;

    try {
      setIsValidatingCode(true);

      // Get selected plan details
      const plan = plans.find(p => p.id === selectedPlan);

      if (!plan) {
        throw new Error('Selected plan not found');
      }

      // Validate discount code
      const validation = await validateDiscountCode(discountCode, plan.amount, selectedPlan);

      setDiscountValid(validation.valid);
      setDiscountAmount(validation.discountAmount);

      if (validation.valid) {
        toast({
          title: 'Discount code valid',
          description: `Discount of ${formatCurrency(validation.discountAmount)} will be applied to your subscription.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Invalid discount code',
          description: 'The discount code you entered is invalid or has expired.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      setDiscountValid(false);
      toast({
        title: 'Error validating code',
        description: 'We couldn\'t validate your discount code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsValidatingCode(false);
    }
  };

  // Handle subscription upgrade/downgrade
  const handleSubscriptionChange = async () => {
    if (!selectedPlan) return;

    try {
      setIsUpgrading(true);

      // Create new subscription
      await createSubscription(
        selectedPlan,
        user?.email || '',
        {
          discountCode: discountValid ? discountCode : undefined,
          previousSubscription: currentSubscription?.id
        }
      );

      // Cancel current subscription if exists
      if (currentSubscription) {
        await cancelSubscription(currentSubscription.code);
      }

      // Update plan in context
      const newPlan = plans.find(p => p.id === selectedPlan);
      if (newPlan) {
        updatePlan({
          id: newPlan.id,
          name: newPlan.name,
          tier: newPlan.name.toLowerCase(),
          features: []
        });
      }

      // Reload subscriptions
      const userSubscriptions = await getSubscriptions();
      setSubscriptions(userSubscriptions);

      // Reset state
      setSelectedPlan('');
      setDiscountCode('');
      setDiscountValid(null);
      setDiscountAmount(0);

      // Show success toast
      toast({
        title: 'Subscription updated',
        description: 'Your subscription has been updated successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error changing subscription:', error);
      toast({
        title: 'Subscription change failed',
        description: 'We couldn\'t update your subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;

    try {
      await cancelSubscription(selectedSubscription.code);

      // Reload subscriptions
      const userSubscriptions = await getSubscriptions();
      setSubscriptions(userSubscriptions);

      // Close dialog
      setShowCancelDialog(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  // Handle subscription pause
  const handlePauseSubscription = async () => {
    if (!selectedSubscription) return;

    try {
      await pauseSubscription(selectedSubscription.code);

      // Reload subscriptions
      const userSubscriptions = await getSubscriptions();
      setSubscriptions(userSubscriptions);

      // Close dialog
      setShowPauseDialog(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Error pausing subscription:', error);
    }
  };

  // Handle subscription resume
  const handleResumeSubscription = async () => {
    if (!selectedSubscription) return;

    try {
      await resumeSubscription(selectedSubscription.code);

      // Reload subscriptions
      const userSubscriptions = await getSubscriptions();
      setSubscriptions(userSubscriptions);

      // Close dialog
      setShowResumeDialog(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Error resuming subscription:', error);
    }
  };

  // Download receipt
  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      const receiptUrl = await generateReceipt(transactionId);
      window.open(receiptUrl, '_blank');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: 'Error downloading receipt',
        description: 'We couldn\'t generate your receipt. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            {isOwner && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                Owner Account
              </Badge>
            )}
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
                  {isOwner ? (
                    <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">Owner Account</h3>
                          <div className="mt-2 text-sm text-amber-700">
                            <p>
                              As the owner of the application, you have access to all premium features
                              without requiring a subscription. You can still view payment history and
                              manage test subscriptions if needed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : currentSubscription ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Plan</p>
                          <p className="font-medium">{currentSubscription.planName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Status</p>
                          <div className="flex items-center">
                            {currentSubscription.status === 'active' ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                <span className="font-medium">Active</span>
                              </>
                            ) : currentSubscription.status === 'paused' ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                                <span className="font-medium">Paused</span>
                              </>
                            ) : (
                              <>
                                <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                                <span className="font-medium">Inactive</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Next Payment</p>
                          <p className="font-medium">
                            {currentSubscription.nextPaymentDate ?
                              formatDate(currentSubscription.nextPaymentDate) :
                              'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {currentSubscription.status === 'active' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(currentSubscription);
                                setShowPauseDialog(true);
                              }}
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Subscription
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(currentSubscription);
                                setShowCancelDialog(true);
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel Subscription
                            </Button>
                          </>
                        )}

                        {currentSubscription.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSubscription(currentSubscription);
                              setShowResumeDialog(true);
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume Subscription
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">You don't have an active subscription.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Change Subscription */}
              {!isOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle>Change Subscription</CardTitle>
                    <CardDescription>
                      Upgrade or downgrade your subscription plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">Select Plan</Label>
                      <Select value={selectedPlan} onValueChange={handlePlanChange}>
                        <SelectTrigger id="plan">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - {formatCurrency(plan.amount)} / {plan.interval}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedPlan && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="discount-code">Discount Code (Optional)</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="discount-code"
                              placeholder="Enter discount code"
                              value={discountCode}
                              onChange={e => setDiscountCode(e.target.value)}
                              className={discountValid === true ? 'border-green-500' :
                                discountValid === false ? 'border-red-500' : ''}
                            />
                            <Button
                              variant="outline"
                              onClick={handleValidateDiscountCode}
                              disabled={!discountCode || isValidatingCode}
                            >
                              {isValidatingCode ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Apply'
                              )}
                            </Button>
                          </div>
                          {discountValid === true && (
                            <p className="text-sm text-green-600">
                              Discount of {formatCurrency(discountAmount)} applied!
                            </p>
                          )}
                          {discountValid === false && (
                            <p className="text-sm text-red-600">
                              Invalid or expired discount code.
                            </p>
                          )}
                        </div>

                        <Separator />

                        <div className="pt-2">
                          <Button
                            onClick={handleSubscriptionChange}
                            disabled={!selectedPlan || isUpgrading}
                            className="w-full"
                          >
                            {isUpgrading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : currentSubscription ? (
                              'Update Subscription'
                            ) : (
                              'Subscribe Now'
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
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
                  {transactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {formatDate(transaction.createdAt)}
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-xs">
                                {transaction.reference.substring(0, 12)}...
                              </span>
                            </TableCell>
                            <TableCell>
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </TableCell>
                            <TableCell>
                              {transaction.status === PaymentStatus.SUCCESS ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Successful
                                </Badge>
                              ) : transaction.status === PaymentStatus.FAILED ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Failed
                                </Badge>
                              ) : transaction.status === PaymentStatus.CANCELLED ? (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Cancelled
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {transaction.type === PaymentType.SUBSCRIPTION ? (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  Subscription
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  One-time
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.status === PaymentStatus.SUCCESS && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadReceipt(transaction.id)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No payment history found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Subscription</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription}>
              Yes, Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pause Subscription Dialog */}
      <AlertDialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pause Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to pause your subscription? You will temporarily lose access to premium features until you resume your subscription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Active</AlertDialogCancel>
            <AlertDialogAction onClick={handlePauseSubscription}>
              Yes, Pause Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resume Subscription Dialog */}
      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resume your subscription? You will regain access to premium features and billing will resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Paused</AlertDialogCancel>
            <AlertDialogAction onClick={handleResumeSubscription}>
              Yes, Resume Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default SubscriptionManagement;
