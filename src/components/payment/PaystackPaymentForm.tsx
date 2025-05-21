
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubscriptionTier } from '@/context/PlanContext';
import { SUBSCRIPTION_PRICES } from '@/utils/paystack';
import { useAuth } from '@/hooks/use-auth';
import PaystackButton from '@/components/payment/PaystackWrapper';

interface PaystackPaymentFormProps {
  selectedTier: SubscriptionTier;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

/**
 * PaystackPaymentForm: Component for processing payments via Paystack
 */
const PaystackPaymentForm = ({ selectedTier, onSuccess, onCancel }: PaystackPaymentFormProps) => {
  const { user } = useAuth ? useAuth() : { user: null };
  const [email, setEmail] = useState(user?.email || '');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const navigate = useNavigate();

  // Calculate amount based on tier and period
  const amount = period === 'yearly'
    ? SUBSCRIPTION_PRICES[selectedTier].yearly / 100 // Convert to dollars
    : SUBSCRIPTION_PRICES[selectedTier].monthly / 100; // Convert to dollars

  // Calculate yearly savings
  const yearlySavings = period === 'yearly' ? {
    amount: (SUBSCRIPTION_PRICES[selectedTier].monthly * 12 - SUBSCRIPTION_PRICES[selectedTier].yearly) / 100,
    percentage: Math.round(((SUBSCRIPTION_PRICES[selectedTier].monthly * 12 - SUBSCRIPTION_PRICES[selectedTier].yearly) / (SUBSCRIPTION_PRICES[selectedTier].monthly * 12)) * 100)
  } : null;

  const handleApplyDiscount = () => {
    if (!discountCode) return;

    setLoading(true);
    // Mock discount application
    setTimeout(() => {
      setDiscountApplied(true);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    // Instead of real Paystack processing, we'll simulate it
    setLoading(true);
    setTimeout(() => {
      const reference = `demo_${Date.now()}`;
      onSuccess(reference);
      setLoading(false);
    }, 2000);
  };

  // Since we're using Paystack, we need to create a key for testing
  const paystackPublicKey = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  // In a real app, we'd use:
  // const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>Process your subscription payment securely with Paystack</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">Card Payment</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Billing Period</Label>
                  <RadioGroup 
                    defaultValue={period} 
                    onValueChange={(value) => setPeriod(value as 'monthly' | 'yearly')} 
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className={`flex items-center justify-between rounded-lg border p-4 ${period === 'monthly' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="cursor-pointer font-medium">
                          Monthly
                        </Label>
                      </div>
                      <span className="font-bold">${(SUBSCRIPTION_PRICES[selectedTier].monthly / 100).toFixed(2)}/mo</span>
                    </div>
                    
                    <div className={`relative flex items-center justify-between rounded-lg border p-4 ${period === 'yearly' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                      {period === 'yearly' && yearlySavings && (
                        <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Save {yearlySavings.percentage}%
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly" className="cursor-pointer font-medium">
                          Yearly
                        </Label>
                      </div>
                      <span className="font-bold">${(SUBSCRIPTION_PRICES[selectedTier].yearly / 100).toFixed(2)}/yr</span>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="discountCode">Discount Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="discountCode" 
                      placeholder="Enter code" 
                      value={discountCode} 
                      onChange={(e) => setDiscountCode(e.target.value)} 
                      disabled={discountApplied} 
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant={discountApplied ? "outline" : "secondary"} 
                      onClick={handleApplyDiscount} 
                      disabled={!discountCode || loading || discountApplied}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : discountApplied ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : null}
                      {discountApplied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Summary */}
              <div className="rounded-md border p-4 bg-gray-50 space-y-3">
                <h4 className="font-medium">Order Summary</h4>
                <div className="flex justify-between text-sm">
                  <span>Subscription ({period})</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount (DEMO10)</span>
                    <span>-$10.00</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${discountApplied ? (amount - 10).toFixed(2) : amount.toFixed(2)}</span>
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="bank">
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  To pay via bank transfer, please use the following details and send your proof of payment to support@athletegpt.com
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Bank Name:</span>
                  <span>Demo Bank</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Account Name:</span>
                  <span>AthleteGPT Inc</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Account Number:</span>
                  <span>0123456789</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Reference:</span>
                  <span>{`ATHLETE-${Date.now().toString().slice(-6)}`}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <PaystackButton
          text="Complete Payment"
          email={email || 'demo@example.com'}
          amount={amount * 100} // Convert to kobo
          reference={`ref-${Date.now()}`}
          publicKey={paystackPublicKey}
          className="w-full bg-gradient-to-r from-athleteBlue-600 to-athleteBlue-700 hover:from-athleteBlue-700 hover:to-athleteBlue-800 text-white"
          metadata={{
            subscribedPlan: selectedTier,
            billingPeriod: period
          }}
          disabled={!email}
          onSuccess={(response) => onSuccess(response.reference)}
          onClose={onCancel}
        />
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/onboarding/plan-generation')}
          type="button" 
          className="w-full"
        >
          Back to Plan Generation
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          By proceeding with the payment, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PaystackPaymentForm;
