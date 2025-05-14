import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePlan, SubscriptionTier } from '@/context/PlanContext';
import { verifyTransaction, getSubscriptionDetails, SubscriptionPeriod } from '@/utils/paystack';
import { sendSubscriptionEmail } from '@/utils/email';

/**
 * PaymentCallback: Page for handling Paystack payment callbacks
 * 
 * This page is displayed after a user is redirected back from Paystack
 * payment page. It verifies the payment and updates the user's subscription.
 */

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSubscriptionTier } = usePlan();
  
  // State
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verifying your payment...');
  const [reference, setReference] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<SubscriptionPeriod | null>(null);
  
  // Get reference from URL or localStorage
  useEffect(() => {
    const ref = searchParams.get('reference') || localStorage.getItem('paymentReference');
    const tier = localStorage.getItem('selectedTier') as SubscriptionTier;
    const period = localStorage.getItem('subscriptionPeriod') as SubscriptionPeriod;
    
    if (ref) {
      setReference(ref);
    }
    
    if (tier) {
      setSelectedTier(tier);
    }
    
    if (period) {
      setSubscriptionPeriod(period);
    }
  }, [searchParams]);
  
  // Verify payment
  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference || !selectedTier || !subscriptionPeriod) {
        setStatus('error');
        setMessage('Missing payment information. Please try again.');
        return;
      }
      
      try {
        const transaction = await verifyTransaction(reference);
        
        if (transaction.status === 'success') {
          // Update subscription tier
          setSubscriptionTier(selectedTier);
          
          // Send confirmation email
          try {
            await sendSubscriptionEmail({
              email: transaction.customer.email,
              name: transaction.customer.name || 'Valued Customer',
              tier: selectedTier,
              period: subscriptionPeriod,
              amount: transaction.amount / 100,
              reference: transaction.reference,
              date: new Date().toISOString()
            });
          } catch (error) {
            console.error('Failed to send confirmation email:', error);
          }
          
          // Clear localStorage
          localStorage.removeItem('paymentReference');
          localStorage.removeItem('selectedTier');
          localStorage.removeItem('subscriptionPeriod');
          
          // Update state
          setStatus('success');
          setMessage('Payment successful! Your subscription has been activated.');
        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };
    
    if (reference && selectedTier && subscriptionPeriod) {
      verifyPayment();
    } else if (!reference) {
      setStatus('error');
      setMessage('No payment reference found. Please try again.');
    }
  }, [reference, selectedTier, subscriptionPeriod, setSubscriptionTier]);
  
  // Get subscription details
  const subscriptionDetails = selectedTier && subscriptionPeriod
    ? getSubscriptionDetails(selectedTier, subscriptionPeriod)
    : null;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            
            {status === 'loading' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'error' && 'Payment Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we verify your payment...'}
            {status === 'success' && 'Your subscription has been activated successfully.'}
            {status === 'error' && 'There was a problem processing your payment.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
              <p className="text-center text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <>
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Payment Successful</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              
              {subscriptionDetails && (
                <div className="rounded-md border p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Subscription Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{subscriptionDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Period:</span>
                      <span className="font-medium">
                        {subscriptionPeriod === 'yearly' ? 'Yearly' : 'Monthly'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        ${subscriptionDetails.price.toFixed(2)}/{subscriptionPeriod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-medium">{reference}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>A confirmation email has been sent to your email address.</span>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <Alert className="bg-red-50 border-red-200 text-red-800">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              
              <div className="rounded-md border p-4 bg-gray-50">
                <h3 className="font-medium mb-2">What went wrong?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  There might have been an issue with your payment. Here are some possible reasons:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Your card was declined by your bank</li>
                  <li>Insufficient funds in your account</li>
                  <li>Network or connection issues</li>
                  <li>The payment verification process failed</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {status === 'loading' && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          )}
          
          {status === 'success' && (
            <>
              <Button 
                className="w-full" 
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/dashboard/subscription')}
              >
                Manage Subscription
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <Button 
                className="w-full" 
                onClick={() => navigate('/pricing')}
              >
                Try Again
                <RefreshCw className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentCallback;
