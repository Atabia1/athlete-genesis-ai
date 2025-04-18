
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from 'lucide-react';
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
    <OnboardingLayout step={2} totalSteps={5} title="What sport or activity do you practice?">
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          Select your primary sport or physical activity. This helps us tailor workouts specific to your needs.
        </p>
        
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
