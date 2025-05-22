
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CreditCard, Users, Shield, Sparkles } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';

/**
 * Payment Page for Coaches
 * 
 * This is the final step in the custom onboarding flow for coaches.
 * It presents subscription options tailored to coaching professionals.
 */

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

const CoachPaymentPage = () => {
  const navigate = useNavigate();
  const { userType, setSubscriptionTier } = usePlan();
  
  // Redirect if not a coach
  if (userType !== 'coach') {
    navigate('/onboarding');
    return null;
  }

  // Subscription plans specifically for coaches
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Coach Basic',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: 'gray',
      icon: Users,
      features: [
        'Team management for up to 5 athletes',
        'Basic training templates',
        'Simple performance tracking',
        'Team calendar',
        'Community forum access'
      ]
    },
    {
      id: 'coach',
      name: 'Coach Pro',
      monthlyPrice: 19.99,
      yearlyPrice: 199,
      color: 'orange',
      icon: Sparkles,
      recommended: true,
      features: [
        'Everything in Basic, plus:',
        'Team management for up to 20 athletes',
        'Advanced training program builder',
        'Team analytics and benchmarks',
        'AI-Generated Drill Libraries',
        'Video analysis tools',
        'Live collaboration features',
        'Priority support (24-hour response)'
      ]
    },
    {
      id: 'elite',
      name: 'Coach Elite',
      monthlyPrice: 49.99,
      yearlyPrice: 499,
      color: 'purple',
      icon: Shield,
      features: [
        'Everything in Pro, plus:',
        'Unlimited athlete management',
        'Advanced team analytics',
        'Custom branding options',
        'Athlete GPT AI assistant',
        'API access for custom integrations',
        'Dedicated account manager',
        'White-glove onboarding'
      ]
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState<string>('coach');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/coach/plan-generation');
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

  // Temporarily remove any code that depends on the OfflineSyncProvider
  // No usePaystack usage here, so we're good

  return (
    <OnboardingLayout 
      step={5} 
      totalSteps={5} 
      title="Choose Your Coaching Plan"
      subtitle="Select the plan that best fits your coaching needs"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-start">
            <Users className="h-5 w-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-orange-700 mb-1">Elevate Your Coaching</h3>
              <p className="text-sm text-gray-600">
                Choose the plan that aligns with your coaching needs. All plans include access to your
                personalized coaching system with different levels of features and team management capabilities.
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
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingCycle === 'yearly'
                  ? 'bg-white text-orange-700 shadow-sm'
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
                  <span className="bg-orange-600 text-white text-xs font-medium px-3 py-1 rounded-full">
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

        {/* Team Size Note */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Team Size Flexibility</h3>
              <p className="text-sm text-gray-600">
                Need to manage more athletes? Coach Pro and Elite plans can be customized with additional
                athlete slots for larger teams. Contact our sales team for custom pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Security Notice */}
        <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
          <Shield className="h-4 w-4 mr-2 text-gray-400" />
          <span>Secure payment processing. Cancel anytime.</span>
        </div>
      </div>

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
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Continue to Payment
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default CoachPaymentPage;
