import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Calendar, 
  User, 
  Mail, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePlan, SubscriptionTier } from '@/context/PlanContext';
import { 
  initializePayment, 
  verifyTransaction, 
  getSubscriptionDetails, 
  calculateYearlySavings,
  SubscriptionPeriod
} from '@/utils/paystack';

/**
 * PaystackPaymentForm: Component for processing payments with Paystack
 * 
 * This component provides a form for collecting payment information and
 * processing payments using the Paystack payment gateway.
 */

interface PaystackPaymentFormProps {
  selectedTier: SubscriptionTier;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
}

export const PaystackPaymentForm = ({
  selectedTier,
  onSuccess,
  onCancel
}: PaystackPaymentFormProps) => {
  const navigate = useNavigate();
  const { setSubscriptionTier } = usePlan();
  
  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [period, setPeriod] = useState<SubscriptionPeriod>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Get subscription details
  const subscriptionDetails = getSubscriptionDetails(selectedTier, period);
  const savings = calculateYearlySavings(selectedTier);
  
  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize payment
      const { authorizationUrl, reference } = await initializePayment(
        email,
        selectedTier,
        period,
        { customer_name: name }
      );
      
      // Store reference in localStorage for verification after redirect
      localStorage.setItem('paymentReference', reference);
      localStorage.setItem('selectedTier', selectedTier);
      localStorage.setItem('subscriptionPeriod', period);
      
      // Redirect to Paystack payment page
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError('Failed to initialize payment. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Handle payment verification
  const handleVerifyPayment = async (reference: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const transaction = await verifyTransaction(reference);
      
      if (transaction.status === 'success') {
        // Update subscription tier
        setSubscriptionTier(selectedTier);
        
        // Show success message
        setSuccess('Payment successful! Your subscription has been activated.');
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess(reference);
        }
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Subscribe to {subscriptionDetails.name} plan
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Payment Successful</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                placeholder="John Doe"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Billing Period</Label>
            <RadioGroup
              value={period}
              onValueChange={(value) => setPeriod(value as SubscriptionPeriod)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="font-normal">
                    Monthly
                  </Label>
                </div>
                <div className="text-right">
                  <p className="font-medium">${subscriptionDetails.price.toFixed(2)}/month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-2 rounded-md border p-3 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly" id="yearly" />
                  <div>
                    <Label htmlFor="yearly" className="font-normal">
                      Yearly
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Save {savings.percentage}% compared to monthly
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${subscriptionDetails.price.toFixed(2)}/year</p>
                  <p className="text-xs text-green-600">Save ${savings.amount.toFixed(2)}</p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="rounded-md border p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Subscription</span>
              <span className="text-sm">{subscriptionDetails.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Billing Period</span>
              <span className="text-sm">{period === 'yearly' ? 'Yearly' : 'Monthly'}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${subscriptionDetails.price.toFixed(2)}/{period === 'yearly' ? 'year' : 'month'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Your payment is secured by Paystack</span>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isLoading || !email || !name}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ${subscriptionDetails.price.toFixed(2)}
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              navigate('/pricing');
            }
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaystackPaymentForm;
