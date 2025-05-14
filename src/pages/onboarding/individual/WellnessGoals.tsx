import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Target, Heart, Brain, Clock } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

/**
 * Wellness Goals Step for Fitness Enthusiasts
 * 
 * This is the fourth step in the custom onboarding flow for fitness enthusiasts.
 * It focuses on holistic wellness goals beyond just fitness, including mental health,
 * sleep quality, stress management, and overall life balance.
 */

// Define wellness goals types
interface WellnessGoals {
  primaryGoals: string[];
  mentalWellbeing: number;
  sleepImprovement: number;
  stressManagement: number;
  lifeBalance: number;
  personalMotivation: string;
  successMetrics: string;
}

const wellnessGoalOptions = [
  { id: 'weight-loss', label: 'Weight Loss' },
  { id: 'muscle-tone', label: 'Muscle Toning' },
  { id: 'strength', label: 'Strength Building' },
  { id: 'endurance', label: 'Endurance & Stamina' },
  { id: 'flexibility', label: 'Flexibility & Mobility' },
  { id: 'posture', label: 'Posture Improvement' },
  { id: 'energy', label: 'Energy Levels' },
  { id: 'sleep', label: 'Better Sleep' },
  { id: 'stress', label: 'Stress Reduction' },
  { id: 'mood', label: 'Mood Enhancement' },
  { id: 'confidence', label: 'Self-Confidence' },
  { id: 'health', label: 'General Health' },
  { id: 'habits', label: 'Building Healthy Habits' },
  { id: 'balance', label: 'Work-Life Balance' },
];

const WellnessGoals = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();
  
  // Redirect if not a fitness enthusiast
  if (userType !== 'individual') {
    navigate('/onboarding');
    return null;
  }

  // Initialize wellness goals state
  const [wellnessGoals, setWellnessGoals] = useState<WellnessGoals>({
    primaryGoals: [],
    mentalWellbeing: 5,
    sleepImprovement: 5,
    stressManagement: 5,
    lifeBalance: 5,
    personalMotivation: '',
    successMetrics: '',
  });

  // Toggle goal in list
  const toggleGoal = (goal: string) => {
    if (wellnessGoals.primaryGoals.includes(goal)) {
      setWellnessGoals({
        ...wellnessGoals,
        primaryGoals: wellnessGoals.primaryGoals.filter(g => g !== goal)
      });
    } else {
      setWellnessGoals({
        ...wellnessGoals,
        primaryGoals: [...wellnessGoals.primaryGoals, goal]
      });
    }
  };

  // Update wellness goal
  const updateGoal = (key: keyof WellnessGoals, value: any) => {
    setWellnessGoals({
      ...wellnessGoals,
      [key]: value
    });
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/individual/fitness-history');
  };

  const handleContinue = () => {
    // Save wellness goals to context or local storage
    localStorage.setItem('wellnessGoals', JSON.stringify(wellnessGoals));
    
    // Navigate to next step
    navigate('/onboarding/individual/plan-generation');
  };

  // Check if form is complete enough to continue
  const isFormValid = () => {
    return wellnessGoals.primaryGoals.length > 0;
  };

  return (
    <OnboardingLayout 
      step={4} 
      totalSteps={5} 
      title="Your Wellness Goals"
      subtitle="Let's focus on your whole-person wellness journey"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-100">
          <div className="flex items-start">
            <Target className="h-5 w-5 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-teal-700 mb-1">Holistic Wellness</h3>
              <p className="text-sm text-gray-600">
                True wellness goes beyond physical fitness. We'll create a plan that addresses your mental,
                emotional, and physical well-being for sustainable, long-term results.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Wellness Goals */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Target className="h-4 w-4 mr-2 text-teal-600" />
            Primary Wellness Goals
          </Label>
          <p className="text-sm text-gray-500">Select your top priorities (up to 5)</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {wellnessGoalOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`goal-${option.id}`} 
                  checked={wellnessGoals.primaryGoals.includes(option.id)}
                  onCheckedChange={() => toggleGoal(option.id)}
                  disabled={wellnessGoals.primaryGoals.length >= 5 && !wellnessGoals.primaryGoals.includes(option.id)}
                />
                <Label htmlFor={`goal-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Mental Wellbeing Importance */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center">
            <Brain className="h-4 w-4 mr-2 text-teal-600" />
            Mental Wellbeing Importance
          </Label>
          <p className="text-sm text-gray-500">How important is improving your mental wellbeing?</p>
          
          <div className="space-y-2">
            <Slider
              value={[wellnessGoals.mentalWellbeing]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => updateGoal('mentalWellbeing', value[0])}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not a priority (1)</span>
              <span>Top priority (10)</span>
            </div>
          </div>
        </div>

        {/* Sleep Improvement */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-teal-600" />
            Sleep Quality Improvement
          </Label>
          <p className="text-sm text-gray-500">How important is improving your sleep quality?</p>
          
          <div className="space-y-2">
            <Slider
              value={[wellnessGoals.sleepImprovement]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => updateGoal('sleepImprovement', value[0])}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not a priority (1)</span>
              <span>Top priority (10)</span>
            </div>
          </div>
        </div>

        {/* Stress Management */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center">
            <Heart className="h-4 w-4 mr-2 text-teal-600" />
            Stress Management
          </Label>
          <p className="text-sm text-gray-500">How important is improving your stress management?</p>
          
          <div className="space-y-2">
            <Slider
              value={[wellnessGoals.stressManagement]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => updateGoal('stressManagement', value[0])}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not a priority (1)</span>
              <span>Top priority (10)</span>
            </div>
          </div>
        </div>

        {/* Personal Motivation */}
        <div className="space-y-3">
          <Label htmlFor="motivation" className="text-base font-medium flex items-center">
            <Heart className="h-4 w-4 mr-2 text-teal-600" />
            Your Personal "Why"
          </Label>
          <p className="text-sm text-gray-500">What's motivating you to improve your wellness? (Optional)</p>
          
          <Textarea
            id="motivation"
            placeholder="e.g., 'I want to have more energy to play with my kids' or 'I want to feel confident in my own skin'"
            value={wellnessGoals.personalMotivation}
            onChange={(e) => updateGoal('personalMotivation', e.target.value)}
          />
        </div>

        {/* Success Metrics */}
        <div className="space-y-3">
          <Label htmlFor="success" className="text-base font-medium flex items-center">
            <Target className="h-4 w-4 mr-2 text-teal-600" />
            How Will You Measure Success?
          </Label>
          <p className="text-sm text-gray-500">Beyond the scale, what will tell you you're succeeding? (Optional)</p>
          
          <Textarea
            id="success"
            placeholder="e.g., 'Being able to climb stairs without getting winded' or 'Reducing my anxiety medication'"
            value={wellnessGoals.successMetrics}
            onChange={(e) => updateGoal('successMetrics', e.target.value)}
          />
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
          disabled={!isFormValid()}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default WellnessGoals;
