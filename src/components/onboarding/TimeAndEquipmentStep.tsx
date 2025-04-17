
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Clock, Calendar, Sun, Moon, Dumbbell } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan } from '@/context/PlanContext';

type FrequencyOption = '1-2' | '3-4' | '5-6' | '7+';
type DurationOption = '<30' | '30-45' | '45-60' | '60-90' | '90+';
type TimeOfDayOption = 'morning' | 'afternoon' | 'evening' | 'variable';
type EquipmentOption = 'bodyweight' | 'basic-home' | 'full-home' | 'commercial-gym' | 'other';

const frequencyOptions = [
  { id: '1-2', label: '1-2 days per week' },
  { id: '3-4', label: '3-4 days per week' },
  { id: '5-6', label: '5-6 days per week' },
  { id: '7+', label: '7+ days per week' }
];

const durationOptions = [
  { id: '<30', label: 'Less than 30 minutes' },
  { id: '30-45', label: '30-45 minutes' },
  { id: '45-60', label: '45-60 minutes' },
  { id: '60-90', label: '60-90 minutes' },
  { id: '90+', label: '90+ minutes' }
];

const timeOfDayOptions = [
  { id: 'morning', label: 'Morning', icon: Sun },
  { id: 'afternoon', label: 'Afternoon', icon: Sun },
  { id: 'evening', label: 'Evening', icon: Moon },
  { id: 'variable', label: 'Variable/No preference', icon: Clock }
];

const equipmentOptions = [
  { id: 'bodyweight', label: 'None (Bodyweight only)' },
  { id: 'basic-home', label: 'Basic Home (Bands, Dumbbells)' },
  { id: 'full-home', label: 'Full Home Gym' },
  { id: 'commercial-gym', label: 'Commercial Gym Access' },
  { id: 'other', label: 'Other (Please specify)' }
];

const TimeAndEquipmentStep = () => {
  const navigate = useNavigate();
  const { 
    frequency, setFrequency, 
    duration, setDuration, 
    timeOfDay, setTimeOfDay, 
    equipment, setEquipment,
    otherEquipment, setOtherEquipment
  } = usePlan();
  
  const [localFrequency, setLocalFrequency] = useState<FrequencyOption | null>(frequency);
  const [localDuration, setLocalDuration] = useState<DurationOption | null>(duration);
  const [localTimeOfDay, setLocalTimeOfDay] = useState<TimeOfDayOption | null>(timeOfDay);
  const [localEquipment, setLocalEquipment] = useState<EquipmentOption[]>(equipment);
  const [localOtherEquipment, setLocalOtherEquipment] = useState(otherEquipment);
  
  const handleBack = () => {
    navigate('/onboarding/experience-level');
  };

  const handleContinue = () => {
    // Save to context
    setFrequency(localFrequency);
    setDuration(localDuration);
    setTimeOfDay(localTimeOfDay);
    setEquipment(localEquipment);
    setOtherEquipment(localOtherEquipment);
    
    // Navigate to plan generation
    navigate('/onboarding/plan-generation');
  };

  const toggleEquipment = (equipId: EquipmentOption) => {
    if (localEquipment.includes(equipId)) {
      setLocalEquipment(localEquipment.filter(id => id !== equipId));
    } else {
      setLocalEquipment([...localEquipment, equipId]);
    }
  };

  const isOtherSelected = localEquipment.includes('other');

  return (
    <OnboardingLayout step={4} totalSteps={5} title="Time Commitment & Equipment Access">
      <div className="space-y-6 mb-8">
        <section className="space-y-4">
          <h3 className="font-medium text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-athleteBlue-500" />
            Training Frequency
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {frequencyOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  localFrequency === option.id
                    ? 'border-athleteBlue-600 bg-athleteBlue-50'
                    : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
                }`}
                onClick={() => setLocalFrequency(option.id as FrequencyOption)}
              >
                <div className="text-center">
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="space-y-4">
          <h3 className="font-medium text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5 text-athleteBlue-500" />
            Session Duration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {durationOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  localDuration === option.id
                    ? 'border-athleteBlue-600 bg-athleteBlue-50'
                    : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
                }`}
                onClick={() => setLocalDuration(option.id as DurationOption)}
              >
                <div className="text-center">
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="space-y-4">
          <h3 className="font-medium text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5 text-athleteBlue-500" />
            Preferred Time of Day
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timeOfDayOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  localTimeOfDay === option.id
                    ? 'border-athleteBlue-600 bg-athleteBlue-50'
                    : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
                }`}
                onClick={() => setLocalTimeOfDay(option.id as TimeOfDayOption)}
              >
                <div className="flex flex-col items-center">
                  <option.icon className={`h-6 w-6 mb-2 ${
                    localTimeOfDay === option.id 
                      ? 'text-athleteBlue-500' 
                      : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="space-y-4">
          <h3 className="font-medium text-lg flex items-center">
            <Dumbbell className="mr-2 h-5 w-5 text-athleteBlue-500" />
            Equipment Access
          </h3>
          <p className="text-sm text-gray-600">Select all that apply to you.</p>
          <div className="space-y-3">
            {equipmentOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-md p-3 cursor-pointer transition-all ${
                  localEquipment.includes(option.id as EquipmentOption)
                    ? 'border-athleteBlue-600 bg-athleteBlue-50'
                    : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
                }`}
                onClick={() => toggleEquipment(option.id as EquipmentOption)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    localEquipment.includes(option.id as EquipmentOption) 
                      ? 'bg-athleteBlue-600 border-athleteBlue-600' 
                      : 'border-gray-300'
                  }`}>
                    {localEquipment.includes(option.id as EquipmentOption) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
          
          {isOtherSelected && (
            <div className="mt-3">
              <label htmlFor="otherEquipment" className="block text-sm font-medium text-gray-700 mb-1">
                Please specify other equipment:
              </label>
              <textarea
                id="otherEquipment"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-athleteBlue-500 focus:border-athleteBlue-500"
                placeholder="List any other equipment you have access to"
                value={localOtherEquipment}
                onChange={(e) => setLocalOtherEquipment(e.target.value)}
              />
            </div>
          )}
        </section>
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
          disabled={!localFrequency || !localDuration || !localTimeOfDay || localEquipment.length === 0 || (isOtherSelected && !localOtherEquipment)}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default TimeAndEquipmentStep;
