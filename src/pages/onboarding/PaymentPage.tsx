import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, CreditCard, Wallet, Gift, Shield, Sparkles, Zap, Star, Check, Loader2, Lock } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { usePaystack } from '@/hooks/use-paystack';
import { PaymentCurrency, PaymentStatus } from '@/services/api/paystack-service';

/**
 * PaymentPage: Final step after plan generation
 *
 * This component allows users to select a subscription plan and enter payment details
 * to unlock premium features. It includes:
 * - Plan selection
 * - Payment method options
 * - Promo code functionality
 * - Animated elements for visual appeal
 * - Secure payment processing UI
 */

const PaymentPage = () => {
  const navigate = useNavigate();
  const { userType, workoutPlan, setWorkoutPlan } = usePlan();

  // Initialize Paystack hook
  const { initializePayment, isLoading: isPaystackLoading } = usePaystack({
    onSuccess: (transaction) => {
      // Show success message
      toast({
        title: "Payment successful!",
        description: `You now have access to ${plans[selectedPlan as keyof typeof plans].name} features.`,
        variant: "default",
      });

      // Navigate to dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Payment failed",
        description: error.message || "An error occurred during payment processing.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
    onCancel: () => {
      toast({
        title: "Payment cancelled",
        description: "You cancelled the payment process.",
        variant: "default",
      });
      setIsProcessing(false);
    }
  });

  // State for payment form
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [email, setEmail] = useState('');

  // Credit card form state (for UI only, Paystack handles actual payment)
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Animated elements state
  const [showConfetti, setShowConfetti] = useState(false);

  // Pricing data
  const plans = {
    free: {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Basic AI-generated workout plans",
        "Access to 10 core sports",
        "Manual workout logging",
        "Basic progress charts"
      ]
    },
    pro: {
      name: "Pro Athlete",
      monthlyPrice: 9.99,
      yearlyPrice: 99,
      features: [
        "Everything in Free, plus:",
        "Sport-specific plans for 50+ sports",
        "Equipment-aware workout customization",
        "Sync with 1 wearable device",
        "Track 10+ well-being metrics",
        "Basic AI Chat (pre-set queries)"
      ]
    },
    coach: {
      name: "Coach Pro",
      monthlyPrice: 19.99,
      yearlyPrice: 199,
      features: [
        "Everything in Pro Athlete, plus:",
        "Monitor up to 20 athletes",
        "Team analytics and benchmarks",
        "AI-Generated Drill Libraries",
        "Live collaboration tools",
        "Priority support (24-hour response)"
      ]
    },
    elite: {
      name: "Elite AI",
      monthlyPrice: 49.99,
      yearlyPrice: 499,
      features: [
        "Everything in Coach Pro, plus:",
        "Instant AI Chat (Athlete GPT)",
        "Ultra-specific plan personalization",
        "Dynamic plan editing via chat",
        "AI-Powered Form Check",
        "24/7 Recovery Optimization",
        "Live Q&A sessions with pros"
      ]
    }
  };

  // Redirect if no workout plan exists
  useEffect(() => {
    if (!workoutPlan) {
      navigate('/onboarding/plan-generation');
    }

    // Set default plan based on user type
    if (userType === 'coach') {
      setSelectedPlan('coach');
    }
  }, [workoutPlan, navigate, userType]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle promo code application
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'athlete50') {
      setPromoApplied(true);
      setDiscount(50);
      toast({
        title: "Promo code applied!",
        description: "You've received 50% off your first payment.",
        variant: "default",
      });

      // Trigger confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setPromoApplied(true);
      setDiscount(20);
      toast({
        title: "Promo code applied!",
        description: "You've received 20% off your first payment.",
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please try a different code or proceed without a discount.",
        variant: "destructive",
      });
    }
  };

  // Calculate final price
  const calculatePrice = () => {
    const basePrice = isYearly
      ? plans[selectedPlan as keyof typeof plans].yearlyPrice
      : plans[selectedPlan as keyof typeof plans].monthlyPrice;

    if (promoApplied) {
      return (basePrice * (1 - discount / 100)).toFixed(2);
    }

    return basePrice.toFixed(2);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlan === 'free') {
      navigate('/dashboard');
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Calculate the final amount
    const amount = parseFloat(calculatePrice());

    try {
      // Initialize Paystack payment
      await initializePayment(
        amount,
        email,
        PaymentCurrency.NGN,
        undefined, // No plan ID for now
        {
          plan_type: selectedPlan,
          billing_cycle: isYearly ? 'yearly' : 'monthly',
          discount_applied: promoApplied ? discount : 0,
          user_type: userType
        }
      );
    } catch (error) {
      console.error('Payment initialization error:', error);
      setIsProcessing(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate('/onboarding/plan-generation');
  };

  return (
    <OnboardingLayout step={6} totalSteps={6} title="Unlock Your Full Potential">
      <div className="space-y-6 mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-1 mb-4 bg-green-100 rounded-full">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Plan Is Ready!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose your subscription to access your personalized workout and nutrition plans.
          </p>
        </div>

        {/* Confetti animation */}
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
                }}
              />
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Plan Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Select Your Plan</h3>
              <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm ${!isYearly ? 'bg-white shadow' : ''}`}
                  onClick={() => setIsYearly(false)}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm ${isYearly ? 'bg-white shadow' : ''}`}
                  onClick={() => setIsYearly(true)}
                >
                  Yearly (Save 20%)
                </button>
              </div>
            </div>

            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div key={key} className="relative">
                  <RadioGroupItem value={key} id={`plan-${key}`} className="sr-only" />
                  <Label
                    htmlFor={`plan-${key}`}
                    className={`flex flex-col h-full p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === key
                        ? 'border-athleteBlue-600 bg-athleteBlue-50'
                        : 'border-gray-200 hover:border-athleteBlue-300'
                    }`}
                  >
                    {key === 'elite' && (
                      <Badge className="absolute -top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                        BEST VALUE
                      </Badge>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        {key === 'free' ? (
                          <p className="text-sm text-gray-500">Always free</p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {isYearly
                              ? `$${plan.yearlyPrice}/year`
                              : `$${plan.monthlyPrice}/month`}
                          </p>
                        )}
                      </div>
                      {key === selectedPlan && (
                        <div className="bg-athleteBlue-100 p-1 rounded-full">
                          <Check className="h-4 w-4 text-athleteBlue-600" />
                        </div>
                      )}
                    </div>
                    <ul className="text-xs space-y-1 mt-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedPlan !== 'free' && (
            <>
              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="paystack" className="flex items-center">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.3 0H2.7C1.2 0 0 1.2 0 2.7v18.6C0 22.8 1.2 24 2.7 24h18.6c1.5 0 2.7-1.2 2.7-2.7V2.7C24 1.2 22.8 0 21.3 0z" fill="#00C3F7" />
                        <path d="M16.4 8.6c0-1.4-1.1-2.5-2.5-2.5h-5c-1.4 0-2.5 1.1-2.5 2.5v6.8c0 1.4 1.1 2.5 2.5 2.5h5c1.4 0 2.5-1.1 2.5-2.5V8.6z" fill="#FFFFFF" />
                      </svg>
                      Paystack
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      PayPal
                    </TabsTrigger>
                    <TabsTrigger value="apple" className="flex items-center">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.6 12.9c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.7-.2-3.2 1-4 1s-2.1-1-3.4-1c-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6.7-1 1.2-2 1.2-2.1-.1-.1-2.5-1-2.5-3.8z" />
                        <path d="M14.5 6.7c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.2 1.1.1 2.3-.6 3-1.4z" />
                      </svg>
                      Apple Pay
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="mt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <div className="relative">
                              <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength={19}
                                required
                              />
                              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="card-name">Cardholder Name</Label>
                            <Input
                              id="card-name"
                              placeholder="John Doe"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                maxLength={5}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength={3}
                                required
                              />
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Your payment information is securely processed and encrypted.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="paystack" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-6">
                          <p className="mb-4">Secure payment processing with Paystack, Africa's leading payment platform.</p>
                          <div className="space-y-4">
                            <div className="inline-block bg-[#00C3F7] text-white font-bold py-2 px-4 rounded">
                              Paystack
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="paystack-email">Email Address</Label>
                              <Input
                                id="paystack-email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              You'll be redirected to Paystack's secure payment page to complete your transaction.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-6">
                          <p className="mb-4">Pay securely with your PayPal account or credit card via PayPal.</p>
                          <div className="space-y-4">
                            <div className="inline-block bg-[#0070ba] text-white font-bold py-2 px-4 rounded">
                              PayPal
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="paypal-email">Email Address</Label>
                              <Input
                                id="paypal-email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              You'll be redirected to PayPal's secure payment page to complete your transaction.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="apple" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-6">
                          <p className="mb-4">Quick and secure checkout with Apple Pay on compatible devices.</p>
                          <div className="space-y-4">
                            <div className="inline-block bg-black text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.6 12.9c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.7-.2-3.2 1-4 1s-2.1-1-3.4-1c-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6.7-1 1.2-2 1.2-2.1-.1-.1-2.5-1-2.5-3.8z" />
                                <path d="M14.5 6.7c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.2 1.1.1 2.3-.6 3-1.4z" />
                              </svg>
                              Apple Pay
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="apple-email">Email Address</Label>
                              <Input
                                id="apple-email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              You'll be prompted to authorize payment using your Apple device.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Promo Code</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                  />
                  <Button
                    type="button"
                    variant={promoApplied ? "outline" : "default"}
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                  >
                    {promoApplied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Applied
                      </>
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    {discount}% discount applied!
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {plans[selectedPlan as keyof typeof plans].name} ({isYearly ? 'Yearly' : 'Monthly'})
                        </span>
                        <span>
                          ${isYearly
                            ? plans[selectedPlan as keyof typeof plans].yearlyPrice.toFixed(2)
                            : plans[selectedPlan as keyof typeof plans].monthlyPrice.toFixed(2)}
                        </span>
                      </div>

                      {promoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo Discount ({discount}%)</span>
                          <span>
                            -${(
                              (isYearly
                                ? plans[selectedPlan as keyof typeof plans].yearlyPrice
                                : plans[selectedPlan as keyof typeof plans].monthlyPrice) *
                              (discount / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${calculatePrice()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {isYearly ? 'Billed annually' : 'Billed monthly'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-8 flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <a href="#" className="text-athleteBlue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-athleteBlue-600 hover:underline">Privacy Policy</a>
                </Label>
              </div>
            </>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center mb-8 text-gray-500 text-sm">
            <Shield className="h-4 w-4 mr-2" />
            <span>Secure payment processing by Paystack</span>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isProcessing || isPaystackLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              type="submit"
              disabled={isProcessing || isPaystackLoading || (selectedPlan !== 'free' && !agreeTerms)}
              className={`${
                selectedPlan === 'free'
                  ? 'bg-gray-800 hover:bg-gray-900'
                  : 'bg-athleteBlue-600 hover:bg-athleteBlue-700'
              }`}
            >
              {isProcessing || isPaystackLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedPlan === 'free' ? 'Continue with Free Plan' : 'Complete Payment'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default PaymentPage;
