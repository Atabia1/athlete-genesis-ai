
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan, ExperienceLevel } from '@/context/PlanContext';

const experienceLevels = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to this sport/activity or have been practicing for less than 6 months.',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Have been practicing for 6 months to 2 years with some skill development.',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Experienced practitioner with 2+ years of consistent training.',
  },
  {
    id: 'elite',
    title: 'Elite/Professional',
    description: 'Competing at a high level or professional in this sport/activity.',
  },
];

const ExperienceLevelStep = () => {
  const { experienceLevel, setExperienceLevel } = usePlan();
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(experienceLevel);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/onboarding/sport-activity');
  };

  const handleContinue = () => {
    if (selectedLevel) {
      setExperienceLevel(selectedLevel);
      navigate('/onboarding/time-and-equipment');
    }
  };

  return (
    <OnboardingLayout step={3} totalSteps={7} title="What's your experience level?">
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          Select your current experience level in your primary sport or activity.
        </p>

        <div className="grid grid-cols-1 gap-4 mt-6">
          {experienceLevels.map((level) => (
            <div
              key={level.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedLevel === level.id
                  ? 'border-athleteBlue-600 bg-athleteBlue-50'
                  : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedLevel(level.id as ExperienceLevel)}
            >
              <div>
                <h3 className="font-medium">{level.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{level.description}</p>
              </div>
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
