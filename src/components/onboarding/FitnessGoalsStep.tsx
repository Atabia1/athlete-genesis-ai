
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Trophy, TrendingUp, Weight, Heart, Timer, Brain } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan, FitnessGoal } from '@/context/PlanContext';

const fitnessGoals = [
  {
    id: 'performance',
    title: 'Performance Improvement',
    description: 'Enhance specific skills and capabilities for my sport.',
    icon: Trophy
  },
  {
    id: 'strength',
    title: 'Strength & Muscle',
    description: 'Build muscle mass and increase overall strength.',
    icon: TrendingUp
  },
  {
    id: 'weight',
    title: 'Weight Management',
    description: 'Lose weight or maintain a healthy body composition.',
    icon: Weight
  },
  {
    id: 'health',
    title: 'General Health',
    description: 'Improve overall wellness and prevent health issues.',
    icon: Heart
  },
  {
    id: 'endurance',
    title: 'Endurance',
    description: 'Increase stamina and cardiovascular capacity.',
    icon: Timer
  },
  {
    id: 'recovery',
    title: 'Recovery & Mobility',
    description: 'Enhance flexibility, prevent injuries, and improve recovery.',
    icon: Brain
  },
];

const FitnessGoalsStep = () => {
  const { fitnessGoals: savedGoals, setFitnessGoals } = usePlan();
  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>(savedGoals);
  const navigate = useNavigate();

  const toggleGoal = (goalId: FitnessGoal) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      setFitnessGoals(selectedGoals);
      navigate('/onboarding/sport-activity');
    }
  };

  return (
    <OnboardingLayout step={1} totalSteps={7} title="What are your primary fitness goals?">
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          Select one or more goals that align with what you want to achieve. This helps us customize your plan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {fitnessGoals.map((goal) => (
            <div
              key={goal.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedGoals.includes(goal.id as FitnessGoal)
                  ? 'border-athleteBlue-600 bg-athleteBlue-50'
                  : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
              }`}
              onClick={() => toggleGoal(goal.id as FitnessGoal)}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-4 ${
                  selectedGoals.includes(goal.id as FitnessGoal)
                    ? 'bg-athleteBlue-100 text-athleteBlue-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <goal.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
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
          disabled={selectedGoals.length === 0}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default FitnessGoalsStep;
