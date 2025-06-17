
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { subscriptionTier } = usePlan();
  const [isLoading] = useState(false);

  const handleBack = () => {
    navigate('/onboarding/plan-generation');
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <OnboardingLayout 
      step={6} 
      totalSteps={6} 
      title="Payment"
      subtitle="Complete your subscription"
    >
      <div className="space-y-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Secure Payment</h3>
              <p className="text-gray-500 mb-4">
                Your selected plan: {subscriptionTier || 'Free'}
              </p>
              <p className="text-sm text-gray-400">
                Payment processing will be implemented
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isLoading}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default PaymentPage;
