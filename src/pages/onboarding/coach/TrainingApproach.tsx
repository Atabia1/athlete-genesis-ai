import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Dumbbell, Calendar, Clock, BarChart, Zap } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Training Approach Step for Coaches
 * 
 * This is the third step in the custom onboarding flow for coaches.
 * It collects information about training methodology, periodization, and priorities.
 */

// Define training approach types
interface TrainingApproach {
  trainingFrequency: string;
  sessionDuration: string;
  periodizationModel: string;
  strengthTrainingPriority: number;
  conditioningPriority: number;
  skillDevelopmentPriority: number;
  recoveryPriority: number;
  trainingMethods: string[];
  dataTracking: string[];
  trainingPhilosophy: string;
}

const frequencyOptions = [
  { id: '1-2', label: '1-2 sessions per week' },
  { id: '3-4', label: '3-4 sessions per week' },
  { id: '5-6', label: '5-6 sessions per week' },
  { id: '7+', label: '7+ sessions per week' },
  { id: 'variable', label: 'Variable (changes throughout season)' },
];

const durationOptions = [
  { id: '<60', label: 'Less than 60 minutes' },
  { id: '60-90', label: '60-90 minutes' },
  { id: '90-120', label: '90-120 minutes' },
  { id: '120+', label: 'More than 120 minutes' },
  { id: 'variable', label: 'Variable (depends on session type)' },
];

const periodizationOptions = [
  { id: 'linear', label: 'Linear Periodization' },
  { id: 'undulating', label: 'Undulating/Non-Linear Periodization' },
  { id: 'block', label: 'Block Periodization' },
  { id: 'conjugate', label: 'Conjugate Method' },
  { id: 'none', label: 'No Formal Periodization Model' },
];

const trainingMethodOptions = [
  { id: 'strength', label: 'Strength Training' },
  { id: 'power', label: 'Power Development' },
  { id: 'endurance', label: 'Endurance Training' },
  { id: 'speed', label: 'Speed & Agility' },
  { id: 'plyometrics', label: 'Plyometrics' },
  { id: 'mobility', label: 'Mobility & Flexibility' },
  { id: 'skill', label: 'Technical Skill Drills' },
  { id: 'tactical', label: 'Tactical/Game Situations' },
  { id: 'hiit', label: 'HIIT/Circuit Training' },
  { id: 'recovery', label: 'Active Recovery Sessions' },
  { id: 'mental', label: 'Mental Performance Training' },
];

const dataTrackingOptions = [
  { id: 'performance', label: 'Performance Metrics' },
  { id: 'strength', label: 'Strength Numbers' },
  { id: 'speed', label: 'Speed & Agility Tests' },
  { id: 'body', label: 'Body Composition' },
  { id: 'wellness', label: 'Wellness/Recovery Metrics' },
  { id: 'rpe', label: 'RPE/Session Load' },
  { id: 'heart', label: 'Heart Rate/HRV' },
  { id: 'gps', label: 'GPS/Movement Data' },
  { id: 'video', label: 'Video Analysis' },
  { id: 'subjective', label: 'Subjective Athlete Feedback' },
];

const TrainingApproach = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();
  
  // Redirect if not a coach
  if (userType !== 'coach') {
    navigate('/onboarding');
    return null;
  }

  // Initialize training approach state
  const [trainingApproach, setTrainingApproach] = useState<TrainingApproach>({
    trainingFrequency: '',
    sessionDuration: '',
    periodizationModel: '',
    strengthTrainingPriority: 5,
    conditioningPriority: 5,
    skillDevelopmentPriority: 5,
    recoveryPriority: 5,
    trainingMethods: [],
    dataTracking: [],
    trainingPhilosophy: '',
  });

  // Toggle selection in array
  const toggleSelection = (field: 'trainingMethods' | 'dataTracking', value: string) => {
    if (trainingApproach[field].includes(value)) {
      setTrainingApproach({
        ...trainingApproach,
        [field]: trainingApproach[field].filter(item => item !== value)
      });
    } else {
      setTrainingApproach({
        ...trainingApproach,
        [field]: [...trainingApproach[field], value]
      });
    }
  };

  // Update training approach
  const updateTrainingApproach = (key: keyof TrainingApproach, value: any) => {
    setTrainingApproach({
      ...trainingApproach,
      [key]: value
    });
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/coach/team-setup');
  };

  const handleContinue = () => {
    // Save training approach to context or local storage
    localStorage.setItem('trainingApproach', JSON.stringify(trainingApproach));
    
    // Navigate to next step
    navigate('/onboarding/coach/equipment-facilities');
  };

  // Check if form is complete enough to continue
  const isFormValid = () => {
    return (
      trainingApproach.trainingFrequency !== '' &&
      trainingApproach.sessionDuration !== '' &&
      trainingApproach.trainingMethods.length > 0
    );
  };

  return (
    <OnboardingLayout 
      step={3} 
      totalSteps={5} 
      title="Training Methodology"
      subtitle="Tell us about your training approach and priorities"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-start">
            <Dumbbell className="h-5 w-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-orange-700 mb-1">Training Methodology</h3>
              <p className="text-sm text-gray-600">
                This information helps us create training templates and resources that align with your
                coaching approach and the specific needs of your athletes.
              </p>
            </div>
          </div>
        </div>

        {/* Training Frequency */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-orange-600" />
            Typical Training Frequency
          </Label>
          
          <RadioGroup
            value={trainingApproach.trainingFrequency}
            onValueChange={(value) => updateTrainingApproach('trainingFrequency', value)}
          >
            {frequencyOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`freq-${option.id}`} />
                <Label htmlFor={`freq-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Session Duration */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-orange-600" />
            Typical Session Duration
          </Label>
          
          <RadioGroup
            value={trainingApproach.sessionDuration}
            onValueChange={(value) => updateTrainingApproach('sessionDuration', value)}
          >
            {durationOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`dur-${option.id}`} />
                <Label htmlFor={`dur-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Periodization Model */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-orange-600" />
            Periodization Approach
          </Label>
          
          <Select
            value={trainingApproach.periodizationModel}
            onValueChange={(value) => updateTrainingApproach('periodizationModel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select periodization model" />
            </SelectTrigger>
            <SelectContent>
              {periodizationOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Training Priorities */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-orange-600" />
            Training Priorities
          </Label>
          <p className="text-sm text-gray-500">Adjust the sliders to indicate your training priorities</p>
          
          <div className="space-y-6">
            {/* Strength Training Priority */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Strength & Power</Label>
                <span className="text-sm text-gray-500">Priority: {trainingApproach.strengthTrainingPriority}/10</span>
              </div>
              <Slider
                value={[trainingApproach.strengthTrainingPriority]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => updateTrainingApproach('strengthTrainingPriority', value[0])}
              />
            </div>
            
            {/* Conditioning Priority */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Conditioning & Endurance</Label>
                <span className="text-sm text-gray-500">Priority: {trainingApproach.conditioningPriority}/10</span>
              </div>
              <Slider
                value={[trainingApproach.conditioningPriority]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => updateTrainingApproach('conditioningPriority', value[0])}
              />
            </div>
            
            {/* Skill Development Priority */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Technical Skill Development</Label>
                <span className="text-sm text-gray-500">Priority: {trainingApproach.skillDevelopmentPriority}/10</span>
              </div>
              <Slider
                value={[trainingApproach.skillDevelopmentPriority]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => updateTrainingApproach('skillDevelopmentPriority', value[0])}
              />
            </div>
            
            {/* Recovery Priority */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Recovery & Injury Prevention</Label>
                <span className="text-sm text-gray-500">Priority: {trainingApproach.recoveryPriority}/10</span>
              </div>
              <Slider
                value={[trainingApproach.recoveryPriority]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => updateTrainingApproach('recoveryPriority', value[0])}
              />
            </div>
          </div>
        </div>

        {/* Training Methods */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Dumbbell className="h-4 w-4 mr-2 text-orange-600" />
            Training Methods Used
          </Label>
          <p className="text-sm text-gray-500">Select all methods you regularly incorporate</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {trainingMethodOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`method-${option.id}`} 
                  checked={trainingApproach.trainingMethods.includes(option.id)}
                  onCheckedChange={() => toggleSelection('trainingMethods', option.id)}
                />
                <Label htmlFor={`method-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Data Tracking */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-orange-600" />
            Data & Metrics Tracked
          </Label>
          <p className="text-sm text-gray-500">Select all data points you track or would like to track</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dataTrackingOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`data-${option.id}`} 
                  checked={trainingApproach.dataTracking.includes(option.id)}
                  onCheckedChange={() => toggleSelection('dataTracking', option.id)}
                />
                <Label htmlFor={`data-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
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
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default TrainingApproach;
