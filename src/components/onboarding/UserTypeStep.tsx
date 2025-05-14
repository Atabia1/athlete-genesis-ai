
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCircle, Dumbbell, Users } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan, UserType } from '@/context/PlanContext';

/**
 * UserTypeStep: First step in the onboarding process
 *
 * This component allows users to select their user type, which determines
 * the dashboard experience and available features. The selection is saved
 * to the PlanContext and used throughout the application.
 */

/**
 * Available user types with descriptions and icons
 * - Athlete: Sport-specific training with performance focus
 * - Fitness Enthusiast: General fitness and health goals
 * - Coach: Team management and athlete monitoring
 */
const userTypes = [
  {
    id: 'athlete',
    title: 'Athlete',
    description: "I actively participate in a specific sport and want to enhance my performance.",
    icon: Dumbbell,
  },
  {
    id: 'individual',
    title: 'Fitness Enthusiast',
    description: "I'm seeking general fitness, weight management, or improved health.",
    icon: UserCircle,
  },
  {
    id: 'coach',
    title: 'Coach',
    description: "I manage a team or individual athletes and need tools to monitor progress.",
    icon: Users,
  },
];

/**
 * UserTypeStep Component
 * Renders the user type selection interface and handles navigation to the next step
 */
const UserTypeStep = () => {
  const { userType, setUserType } = usePlan();
  const [selectedType, setSelectedType] = useState<UserType>(userType);
  const navigate = useNavigate();

  /**
   * Saves the selected user type to context and navigates to the appropriate next step
   * based on the selected user type:
   * - Athlete: Standard flow starting with fitness goals
   * - Fitness Enthusiast: Custom flow starting with health assessment
   * - Coach: Custom flow starting with coaching philosophy
   */
  const handleContinue = () => {
    if (selectedType) {
      setUserType(selectedType);

      // Route to different onboarding paths based on user type
      switch (selectedType) {
        case 'athlete':
          // Athletes follow the standard onboarding flow
          navigate('/onboarding/fitness-goals');
          break;
        case 'individual':
          // Fitness enthusiasts get a lifestyle-focused flow
          navigate('/onboarding/individual/health-assessment');
          break;
        case 'coach':
          // Coaches get a team-focused flow
          navigate('/onboarding/coach/philosophy');
          break;
        default:
          navigate('/onboarding/fitness-goals');
      }
    }
  };

  return (
    <OnboardingLayout step={0} totalSteps={7} title="Tell us about yourself">
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          Select the option that best describes you. This helps us personalize your experience.
        </p>

        <div className="grid grid-cols-1 gap-4 mt-6">
          {userTypes.map((type) => (
            <div
              key={type.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'border-athleteBlue-600 bg-athleteBlue-50'
                  : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedType(type.id as UserType)}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-4 ${
                  selectedType === type.id
                    ? 'bg-athleteBlue-100 text-athleteBlue-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default UserTypeStep;
