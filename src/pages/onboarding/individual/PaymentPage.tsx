import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CreditCard, Heart, Shield, Sparkles } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from '@/components/ui/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  recommended?: boolean;
  color: string;
  icon: any;
}

const IndividualPaymentPage = () => {
  const navigate = useNavigate();
  const { userType, setSubscriptionTier } = usePlan();
  
  if (userType !== 'individual') {
    navigate('/onboarding');
    return null;
  }

  // Subscription plans specifically for wellness-focused individuals
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Wellness Basics',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: 'gray',
      icon: Heart,
      features: [
        'Basic wellness plan',
        'Limited workout library',
        'Basic nutrition guidance',
        'Progress tracking',
        'Community forum access'
      ]
    },
    {
      id: 'pro',
      name: 'Wellness Plus',
      monthlyPrice: 9.99,
      yearlyPrice: 99,
      color: 'teal',
      icon: Sparkles,
      recommended: true,
      features: [
        'Everything in Basics, plus:',
        'Personalized wellness dashboard',
        'Advanced habit tracking',
        'Guided meditation library',
        'Sleep quality analysis',
        'Stress management tools',
        'Email support (48-hour response)'
      ]
    },
    {
      id: 'elite',
      name: 'Wellness Premium',
      monthlyPrice: 19.99,
      yearlyPrice: 199,
      color: 'purple',
      icon: Shield,
      features: [
        'Everything in Plus, plus:',
        'Wellness coach chat support',
        'Custom meal planning',
        'Advanced biometric tracking',
        'Personalized mindfulness programs',
        'Weekly wellness check-ins',
        'Priority support (24-hour response)'
      ]
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/individual/plan-generation');
  };

  const handleContinue = () => {
    // Set subscription tier in context
    setSubscriptionTier(selectedPlan as any);
    
    // Show success toast
    toast({
      title: "Subscription Selected",
      description: `You've selected the ${subscriptionPlans.find(p => p.id === selectedPlan)?.name} plan.`,
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <OnboardingLayout 
      step={5} 
      totalSteps={5} 
      title="Choose Your Wellness Journey"
      subtitle="Select the plan that best fits your wellness goals"
    >
      {/* Keep existing code, component content similar to coach payment page */}
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-lg border border-teal-100">
          <div className="flex items-start">
            <Heart className="h-5 w-5 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-teal-700 mb-1">Your Wellness Journey Awaits</h3>
              <p className="text-sm text-gray-600">
                Choose the plan that aligns with your wellness goals. All plans include access to your
                personalized wellness program with different levels of features and support.
              </p>
            </div>
          </div>
        </div>

        {/* Billing Cycle Selection */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingCycle === 'monthly'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingCycle === 'yearly'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly (Save 17%)
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <RadioGroup
          value={selectedPlan}
          onValueChange={setSelectedPlan}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {subscriptionPlans.map((plan) => (
            <div key={plan.id} className="relative">
              {plan.recommended && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="bg-teal-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}
              
              <Card className={`border-2 ${
                selectedPlan === plan.id 
                  ? `border-${plan.color}-600` 
                  : 'border-gray-200'
              } h-full flex flex-col`}>
                <CardHeader className={`pb-2 ${plan.recommended ? 'pt-6' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <plan.icon className={`h-5 w-5 text-${plan.color}-600`} />
                    <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>
                    {billingCycle === 'monthly' ? (
                      <>
                        <span className="text-2xl font-bold">${plan.monthlyPrice}</span>
                        <span className="text-gray-500">/month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-bold">${plan.yearlyPrice}</span>
                        <span className="text-gray-500">/year</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className={`h-4 w-4 text-${plan.color}-600 mr-2 mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    className={`w-full ${
                      selectedPlan === plan.id 
                        ? `bg-${plan.color}-600 hover:bg-${plan.color}-700` 
                        : ''
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </RadioGroup>

        <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
          <Shield className="h-4 w-4 mr-2 text-gray-400" />
          <span>Secure payment processing. Cancel anytime.</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Continue to Payment
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default IndividualPaymentPage;
