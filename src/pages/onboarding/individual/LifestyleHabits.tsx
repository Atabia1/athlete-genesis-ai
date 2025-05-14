import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Coffee, Utensils, Clock, Briefcase } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Lifestyle Habits Step for Fitness Enthusiasts
 * 
 * This is the second step in the custom onboarding flow for fitness enthusiasts.
 * It collects information about daily habits, diet preferences, and lifestyle factors.
 */

// Define lifestyle habits types
interface LifestyleHabits {
  dietaryPreferences: string[];
  mealFrequency: string;
  waterIntake: string;
  workSchedule: string;
  commute: string;
  sittingHours: string;
  dietaryRestrictions: string;
}

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'mediterranean', label: 'Mediterranean' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'no-restrictions', label: 'No Specific Diet' },
];

const LifestyleHabits = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();
  
  // Redirect if not a fitness enthusiast
  if (userType !== 'individual') {
    navigate('/onboarding');
    return null;
  }

  // Initialize lifestyle habits state
  const [lifestyleHabits, setLifestyleHabits] = useState<LifestyleHabits>({
    dietaryPreferences: [],
    mealFrequency: '3',
    waterIntake: '1-2',
    workSchedule: 'regular',
    commute: '<30',
    sittingHours: '4-6',
    dietaryRestrictions: '',
  });

  // Toggle dietary preference
  const toggleDietaryPreference = (preference: string) => {
    if (lifestyleHabits.dietaryPreferences.includes(preference)) {
      setLifestyleHabits({
        ...lifestyleHabits,
        dietaryPreferences: lifestyleHabits.dietaryPreferences.filter(p => p !== preference)
      });
    } else {
      setLifestyleHabits({
        ...lifestyleHabits,
        dietaryPreferences: [...lifestyleHabits.dietaryPreferences, preference]
      });
    }
  };

  // Update lifestyle habit
  const updateHabit = (key: keyof LifestyleHabits, value: any) => {
    setLifestyleHabits({
      ...lifestyleHabits,
      [key]: value
    });
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/individual/health-assessment');
  };

  const handleContinue = () => {
    // Save lifestyle habits to context or local storage
    localStorage.setItem('lifestyleHabits', JSON.stringify(lifestyleHabits));
    
    // Navigate to next step
    navigate('/onboarding/individual/fitness-history');
  };

  return (
    <OnboardingLayout 
      step={2} 
      totalSteps={5} 
      title="Your Lifestyle & Habits"
      subtitle="Tell us about your daily routine and preferences"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-start">
            <Coffee className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-700 mb-1">Why This Matters</h3>
              <p className="text-sm text-gray-600">
                Your daily habits and lifestyle significantly impact your wellness journey. 
                Understanding these factors helps us create a plan that fits seamlessly into your life.
              </p>
            </div>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Utensils className="h-4 w-4 mr-2 text-amber-600" />
            Dietary Preferences
          </Label>
          <p className="text-sm text-gray-500">Select all that apply to you</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dietaryOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`diet-${option.id}`} 
                  checked={lifestyleHabits.dietaryPreferences.includes(option.id)}
                  onCheckedChange={() => toggleDietaryPreference(option.id)}
                />
                <Label htmlFor={`diet-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Frequency */}
        <div className="space-y-3">
          <Label htmlFor="meal-frequency" className="text-base font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-amber-600" />
            How many meals do you typically eat per day?
          </Label>
          
          <Select 
            value={lifestyleHabits.mealFrequency}
            onValueChange={(value) => updateHabit('mealFrequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select meal frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 meals</SelectItem>
              <SelectItem value="3">3 meals</SelectItem>
              <SelectItem value="4-5">4-5 meals</SelectItem>
              <SelectItem value="6+">6+ meals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Water Intake */}
        <div className="space-y-3">
          <Label htmlFor="water-intake" className="text-base font-medium flex items-center">
            <Coffee className="h-4 w-4 mr-2 text-amber-600" />
            Daily water intake (liters)
          </Label>
          
          <Select 
            value={lifestyleHabits.waterIntake}
            onValueChange={(value) => updateHabit('waterIntake', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select water intake" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<1">Less than 1 liter</SelectItem>
              <SelectItem value="1-2">1-2 liters</SelectItem>
              <SelectItem value="2-3">2-3 liters</SelectItem>
              <SelectItem value="3+">More than 3 liters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Work Schedule */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-amber-600" />
            Work Schedule
          </Label>
          
          <RadioGroup
            value={lifestyleHabits.workSchedule}
            onValueChange={(value) => updateHabit('workSchedule', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="work-regular" />
              <Label htmlFor="work-regular">Regular hours (9-5)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="work-flexible" />
              <Label htmlFor="work-flexible">Flexible hours</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shift" id="work-shift" />
              <Label htmlFor="work-shift">Shift work</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="remote" id="work-remote" />
              <Label htmlFor="work-remote">Remote/Work from home</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-3">
          <Label htmlFor="dietary-restrictions" className="text-base font-medium flex items-center">
            <Utensils className="h-4 w-4 mr-2 text-amber-600" />
            Any food allergies or restrictions?
          </Label>
          
          <Textarea
            id="dietary-restrictions"
            placeholder="List any food allergies or specific restrictions"
            value={lifestyleHabits.dietaryRestrictions}
            onChange={(e) => updateHabit('dietaryRestrictions', e.target.value)}
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
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default LifestyleHabits;
