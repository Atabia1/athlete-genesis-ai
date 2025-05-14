import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, History, Dumbbell, AlertCircle, ThumbsUp } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

/**
 * Fitness History Step for Fitness Enthusiasts
 * 
 * This is the third step in the custom onboarding flow for fitness enthusiasts.
 * It collects information about past fitness experiences, injuries, and preferences.
 */

// Define fitness history types
interface FitnessHistory {
  activityLevel: string;
  exerciseHistory: string;
  enjoyedActivities: string[];
  dislikedActivities: string[];
  injuries: string;
  successfulApproaches: string;
  unsuccessfulApproaches: string;
}

const activityOptions = [
  { id: 'sedentary', label: 'Sedentary (little to no exercise)' },
  { id: 'light', label: 'Lightly active (light exercise 1-3 days/week)' },
  { id: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)' },
  { id: 'very', label: 'Very active (hard exercise 6-7 days/week)' },
  { id: 'extra', label: 'Extra active (very hard exercise & physical job)' },
];

const exerciseOptions = [
  { id: 'none', label: 'Never exercised regularly' },
  { id: 'beginner', label: 'Beginner (less than 6 months)' },
  { id: 'intermediate', label: 'Intermediate (6 months to 2 years)' },
  { id: 'advanced', label: 'Advanced (2+ years consistent training)' },
  { id: 'athlete', label: 'Former competitive athlete' },
];

const activityTypeOptions = [
  { id: 'walking', label: 'Walking' },
  { id: 'running', label: 'Running/Jogging' },
  { id: 'cycling', label: 'Cycling' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'hiit', label: 'HIIT Workouts' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'pilates', label: 'Pilates' },
  { id: 'weightlifting', label: 'Weightlifting' },
  { id: 'crossfit', label: 'CrossFit' },
  { id: 'boxing', label: 'Boxing/Martial Arts' },
  { id: 'dance', label: 'Dance' },
  { id: 'team-sports', label: 'Team Sports' },
  { id: 'outdoor', label: 'Outdoor Activities' },
];

const FitnessHistory = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();
  
  // Redirect if not a fitness enthusiast
  if (userType !== 'individual') {
    navigate('/onboarding');
    return null;
  }

  // Initialize fitness history state
  const [fitnessHistory, setFitnessHistory] = useState<FitnessHistory>({
    activityLevel: '',
    exerciseHistory: '',
    enjoyedActivities: [],
    dislikedActivities: [],
    injuries: '',
    successfulApproaches: '',
    unsuccessfulApproaches: '',
  });

  // Toggle activity in list
  const toggleActivity = (list: 'enjoyedActivities' | 'dislikedActivities', activity: string) => {
    if (fitnessHistory[list].includes(activity)) {
      setFitnessHistory({
        ...fitnessHistory,
        [list]: fitnessHistory[list].filter(a => a !== activity)
      });
    } else {
      setFitnessHistory({
        ...fitnessHistory,
        [list]: [...fitnessHistory[list], activity]
      });
    }
  };

  // Update fitness history
  const updateHistory = (key: keyof FitnessHistory, value: any) => {
    setFitnessHistory({
      ...fitnessHistory,
      [key]: value
    });
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/individual/lifestyle-habits');
  };

  const handleContinue = () => {
    // Save fitness history to context or local storage
    localStorage.setItem('fitnessHistory', JSON.stringify(fitnessHistory));
    
    // Navigate to next step
    navigate('/onboarding/individual/wellness-goals');
  };

  // Check if form is complete enough to continue
  const isFormValid = () => {
    return (
      fitnessHistory.activityLevel !== '' &&
      fitnessHistory.exerciseHistory !== ''
    );
  };

  return (
    <OnboardingLayout 
      step={3} 
      totalSteps={5} 
      title="Your Fitness Journey"
      subtitle="Tell us about your exercise history and experiences"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-start">
            <History className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-purple-700 mb-1">Your Fitness Background</h3>
              <p className="text-sm text-gray-600">
                Understanding your fitness history helps us create a plan that builds on your experiences
                and avoids past challenges. Be honest - there are no wrong answers!
              </p>
            </div>
          </div>
        </div>

        {/* Current Activity Level */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Dumbbell className="h-4 w-4 mr-2 text-purple-600" />
            Current Activity Level
          </Label>
          
          <RadioGroup
            value={fitnessHistory.activityLevel}
            onValueChange={(value) => updateHistory('activityLevel', value)}
          >
            {activityOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`activity-${option.id}`} />
                <Label htmlFor={`activity-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Exercise History */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <History className="h-4 w-4 mr-2 text-purple-600" />
            Exercise Experience
          </Label>
          
          <RadioGroup
            value={fitnessHistory.exerciseHistory}
            onValueChange={(value) => updateHistory('exerciseHistory', value)}
          >
            {exerciseOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`exercise-${option.id}`} />
                <Label htmlFor={`exercise-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Activities You Enjoy */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <ThumbsUp className="h-4 w-4 mr-2 text-purple-600" />
            Activities You Enjoy
          </Label>
          <p className="text-sm text-gray-500">Select all that you find enjoyable</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activityTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`enjoy-${option.id}`} 
                  checked={fitnessHistory.enjoyedActivities.includes(option.id)}
                  onCheckedChange={() => toggleActivity('enjoyedActivities', option.id)}
                />
                <Label htmlFor={`enjoy-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Activities You Dislike */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <ThumbsUp className="h-4 w-4 mr-2 text-purple-600 rotate-180" />
            Activities You Dislike
          </Label>
          <p className="text-sm text-gray-500">Select activities you prefer to avoid</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activityTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`dislike-${option.id}`} 
                  checked={fitnessHistory.dislikedActivities.includes(option.id)}
                  onCheckedChange={() => toggleActivity('dislikedActivities', option.id)}
                />
                <Label htmlFor={`dislike-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Injuries or Limitations */}
        <div className="space-y-3">
          <Label htmlFor="injuries" className="text-base font-medium flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-purple-600" />
            Injuries or Physical Limitations
          </Label>
          
          <Textarea
            id="injuries"
            placeholder="Describe any injuries, chronic conditions, or physical limitations we should know about"
            value={fitnessHistory.injuries}
            onChange={(e) => updateHistory('injuries', e.target.value)}
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
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default FitnessHistory;
