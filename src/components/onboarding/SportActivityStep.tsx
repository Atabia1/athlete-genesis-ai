
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import SportsSelector from './SportsSelector';

const SportActivityStep = () => {
  const { sportActivity, setSportActivity } = usePlan();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/onboarding/fitness-goals');
  };

  const handleContinue = () => {
    if (sportActivity) {
      navigate('/onboarding/experience-level');
    }
  };

  return (
    <OnboardingLayout step={2} totalSteps={7} title="What sport or activity do you practice?">
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          Select your primary sport or physical activity. This helps us tailor workouts specific to your needs.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
          <div className="flex items-start">
            <Sparkles className="h-5 w-5 text-athleteBlue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-athleteBlue-700 mb-1">AI-Powered Training & Nutrition</h3>
              <p className="text-sm text-gray-600">
                Our AI analyzes your sport, goals, and preferences to create personalized plans.
                As you log workouts, meals, and well-being data, the system adapts your program
                for optimal progress and helps identify potential issues like overtraining.
              </p>
            </div>
          </div>
        </div>

        <SportsSelector
          selectedSport={sportActivity}
          onSelectSport={setSportActivity}
        />
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
          disabled={!sportActivity}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default SportActivityStep;
