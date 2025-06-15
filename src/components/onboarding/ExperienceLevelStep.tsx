
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan, ExperienceLevel } from '@/context/PlanContext';

const experienceLevels = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to fitness or returning after a long break. Looking to build a foundation.',
    features: ['Basic movements', 'Form focus', 'Gradual progression', 'Educational content']
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Regular exerciser with 6+ months experience. Ready for moderate challenges.',
    features: ['Compound exercises', 'Progressive overload', 'Varied training styles', 'Performance tracking']
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Experienced athlete with 2+ years of consistent training. Seeking optimization.',
    features: ['Complex movements', 'Periodization', 'Sport-specific training', 'Advanced techniques']
  },
];

const ExperienceLevelStep = () => {
  const { experienceLevel: savedLevel, setExperienceLevel } = usePlan();
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | undefined>(savedLevel);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/onboarding/fitness-goals');
  };

  const handleContinue = () => {
    if (selectedLevel) {
      setExperienceLevel(selectedLevel);
      navigate('/onboarding/medical-status');
    }
  };

  return (
    <OnboardingLayout step={2} totalSteps={7} title="What's your experience level?">
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          Help us tailor your workouts to your current fitness level and experience.
        </p>

        <div className="grid grid-cols-1 gap-4 mt-6">
          {experienceLevels.map((level) => (
            <div
              key={level.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedLevel === level.id
                  ? 'border-athleteBlue-600 bg-athleteBlue-50'
                  : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedLevel(level.id as ExperienceLevel)}
            >
              <h3 className="font-semibold text-lg mb-2">{level.title}</h3>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                {level.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-athleteBlue-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
          disabled={!selectedLevel}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ExperienceLevelStep;
