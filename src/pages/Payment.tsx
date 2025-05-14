import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle,
  Zap,
  Brain,
  Users,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePlan, SubscriptionTier } from '@/context/PlanContext';
import PaystackPaymentForm from '@/components/payment/PaystackPaymentForm';
import { getSubscriptionDetails, SubscriptionPeriod } from '@/utils/paystack';

/**
 * Payment: Page for processing subscription payments
 * 
 * This page allows users to select a subscription tier and payment method,
 * and then process the payment using Paystack.
 */

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subscriptionTier } = usePlan();
  
  // State
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('pro');
  const [selectedPeriod, setSelectedPeriod] = useState<SubscriptionPeriod>('monthly');
  
  // Get tier from URL or localStorage
  useEffect(() => {
    const tier = searchParams.get('tier') || localStorage.getItem('selectedPlan');
    
    if (tier) {
      if (['pro', 'coach', 'elite'].includes(tier)) {
        setSelectedTier(tier as SubscriptionTier);
      } else if (tier === 'pro_athlete') {
        setSelectedTier('pro');
      } else if (tier === 'coach_pro') {
        setSelectedTier('coach');
      } else if (tier === 'elite_ai') {
        setSelectedTier('elite');
      }
    }
  }, [searchParams]);
  
  // Check if user already has this tier
  const hasTier = 
    subscriptionTier === selectedTier || 
    (selectedTier === 'pro' && subscriptionTier === 'coach') || 
    (selectedTier === 'pro' && subscriptionTier === 'elite') || 
    (selectedTier === 'coach' && subscriptionTier === 'elite');
  
  // Get tier-specific colors and icons
  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return 'blue';
      case 'coach':
        return 'orange';
      case 'elite':
        return 'purple';
      default:
        return 'gray';
    }
  };
  
  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return <Zap className="h-5 w-5" />;
      case 'coach':
        return <Users className="h-5 w-5" />;
      case 'elite':
        return <Brain className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };
  
  // Get subscription details
  const subscriptionDetails = getSubscriptionDetails(selectedTier, selectedPeriod);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              className="mr-4"
              onClick={() => navigate('/pricing')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
            <h1 className="text-2xl font-bold">Complete Your Subscription</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <PaystackPaymentForm 
                selectedTier={selectedTier}
                onSuccess={(reference) => {
                  navigate(`/payment/callback?reference=${reference}`);
                }}
                onCancel={() => {
                  navigate('/pricing');
                }}
              />
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-${getTierColor(selectedTier)}-100 text-${getTierColor(selectedTier)}-600`}>
                      {getTierIcon(selectedTier)}
                    </div>
                    <div>
                      <h3 className="font-medium">{subscriptionDetails.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedPeriod === 'yearly' ? 'Annual' : 'Monthly'} subscription
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4 bg-gray-50 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subscription</span>
                      <span>{subscriptionDetails.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Billing Period</span>
                      <span>{selectedPeriod === 'yearly' ? 'Yearly' : 'Monthly'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price</span>
                      <span>${subscriptionDetails.price.toFixed(2)}/{selectedPeriod === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${subscriptionDetails.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Key Features:</h3>
                    <ul className="space-y-1">
                      {selectedTier === 'pro' && (
                        <>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Sport-specific plans for 50+ sports</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Equipment-aware workout customization</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Advanced analytics dashboard</span>
                          </li>
                        </>
                      )}
                      
                      {selectedTier === 'coach' && (
                        <>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Team management for up to 20 athletes</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Team analytics and benchmarks</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>AI-Generated Drill Libraries</span>
                          </li>
                        </>
                      )}
                      
                      {selectedTier === 'elite' && (
                        <>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Instant AI Chat (Athlete GPT)</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>Dynamic plan editing via chat</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>AI-Powered Form Check</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure payment processing by Paystack</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {hasTier && (
                    <div className="w-full p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-sm">
                      <p className="font-medium">You already have access to this tier or higher.</p>
                      <p className="mt-1">
                        Your current tier: {subscriptionTier?.charAt(0).toUpperCase()}{subscriptionTier?.slice(1)}
                      </p>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
