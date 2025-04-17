
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Clock, Dumbbell } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Equipment options
const equipmentOptions = [
  { id: 'none', label: 'None (Bodyweight only)' },
  { id: 'basic_home', label: 'Basic Home (Bands, Dumbbells)' },
  { id: 'full_home', label: 'Full Home Gym' },
  { id: 'commercial_gym', label: 'Commercial Gym Access' },
  { id: 'barbell', label: 'Barbells' },
  { id: 'kettlebell', label: 'Kettlebells' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'track', label: 'Running Track' },
  { id: 'court', label: 'Court (Basketball, Tennis, etc.)' },
  { id: 'field', label: 'Sports Field' },
  { id: 'bike', label: 'Bicycle' },
  { id: 'rower', label: 'Rowing Machine' },
];

const TimeAndEquipmentStep = () => {
  const [daysPerWeek, setDaysPerWeek] = useState<string>('3');
  const [timePerSession, setTimePerSession] = useState<string>('60');
  const [preferredTime, setPreferredTime] = useState<string>('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [otherEquipment, setOtherEquipment] = useState<string>('');
  const navigate = useNavigate();
  
  const toggleEquipment = (value: string) => {
    setEquipment(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleBack = () => {
    navigate('/onboarding/experience-level');
  };

  const handleContinue = () => {
    // In a real app, you would save this data to state or context
    // and then navigate to the next page in the onboarding flow
    // For now, we'll just navigate to the dashboard
    navigate('/dashboard');
  };

  return (
    <OnboardingLayout step={5} totalSteps={7} title="Time Commitment & Equipment">
      <div className="space-y-8 mb-8">
        {/* Time Commitment Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="mr-2 h-5 w-5 text-athleteBlue-600" />
            Time Commitment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daysPerWeek">Days per week</Label>
              <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
                <SelectTrigger id="daysPerWeek">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day} {day === 1 ? 'day' : 'days'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timePerSession">Minutes per session</Label>
              <Select value={timePerSession} onValueChange={setTimePerSession}>
                <SelectTrigger id="timePerSession">
                  <SelectValue placeholder="Select minutes" />
                </SelectTrigger>
                <SelectContent>
                  {[15, 30, 45, 60, 90, 120].map((min) => (
                    <SelectItem key={min} value={min.toString()}>
                      {min} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred time of day</Label>
            <Select value={preferredTime} onValueChange={setPreferredTime}>
              <SelectTrigger id="preferredTime">
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (5am-11am)</SelectItem>
                <SelectItem value="midday">Midday (11am-2pm)</SelectItem>
                <SelectItem value="afternoon">Afternoon (2pm-5pm)</SelectItem>
                <SelectItem value="evening">Evening (5pm-9pm)</SelectItem>
                <SelectItem value="night">Night (9pm-5am)</SelectItem>
                <SelectItem value="varies">Varies/No preference</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Equipment Access Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Dumbbell className="mr-2 h-5 w-5 text-athleteBlue-600" />
            Equipment Access
          </h2>
          <p className="text-gray-600 text-sm">
            Select all equipment you have regular access to. This helps us customize your workout plan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {equipmentOptions.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.id} 
                  checked={equipment.includes(item.id)}
                  onCheckedChange={() => toggleEquipment(item.id)}
                />
                <Label 
                  htmlFor={item.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otherEquipment">Other equipment (optional)</Label>
            <Input
              id="otherEquipment"
              placeholder="Specify any other equipment you have access to"
              value={otherEquipment}
              onChange={(e) => setOtherEquipment(e.target.value)}
            />
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
