import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Dumbbell, Building, Ruler, Smartphone } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

/**
 * Equipment & Facilities Step for Coaches
 * 
 * This is the fourth step in the custom onboarding flow for coaches.
 * It collects information about available equipment, facilities, and technology.
 */

// Define equipment and facilities types
interface EquipmentFacilities {
  facilityType: string;
  equipmentAccess: string[];
  technologyTools: string[];
  spaceConstraints: string;
  equipmentLimitations: string;
  additionalResources: string;
}

const facilityTypeOptions = [
  { id: 'school', label: 'School/University Facility' },
  { id: 'commercial', label: 'Commercial Gym' },
  { id: 'team', label: 'Team-Specific Training Facility' },
  { id: 'outdoor', label: 'Primarily Outdoor Facilities' },
  { id: 'limited', label: 'Limited/Minimal Facilities' },
  { id: 'home', label: 'Home/Remote Training' },
];

const equipmentOptions = [
  { id: 'weights', label: 'Free Weights (Barbells, Dumbbells)' },
  { id: 'machines', label: 'Weight Machines' },
  { id: 'racks', label: 'Power Racks/Squat Racks' },
  { id: 'platforms', label: 'Olympic Lifting Platforms' },
  { id: 'kettlebells', label: 'Kettlebells/Medicine Balls' },
  { id: 'bands', label: 'Resistance Bands' },
  { id: 'cardio', label: 'Cardio Equipment' },
  { id: 'agility', label: 'Agility/Speed Equipment' },
  { id: 'plyo', label: 'Plyometric Boxes' },
  { id: 'recovery', label: 'Recovery Equipment' },
  { id: 'sport', label: 'Sport-Specific Equipment' },
  { id: 'minimal', label: 'Minimal/Bodyweight Only' },
];

const technologyOptions = [
  { id: 'video', label: 'Video Analysis Tools' },
  { id: 'tracking', label: 'Performance Tracking Software' },
  { id: 'wearables', label: 'Wearable Technology/Fitness Trackers' },
  { id: 'velocity', label: 'Velocity-Based Training Tools' },
  { id: 'force', label: 'Force Plates/Jump Mats' },
  { id: 'gps', label: 'GPS/Movement Tracking' },
  { id: 'heart', label: 'Heart Rate Monitoring' },
  { id: 'apps', label: 'Mobile Training Apps' },
  { id: 'management', label: 'Team Management Software' },
  { id: 'communication', label: 'Team Communication Platform' },
  { id: 'none', label: 'No Technology Tools Currently Used' },
];

const EquipmentFacilities = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();
  
  // Redirect if not a coach
  if (userType !== 'coach') {
    navigate('/onboarding');
    return null;
  }

  // Initialize equipment and facilities state
  const [equipmentFacilities, setEquipmentFacilities] = useState<EquipmentFacilities>({
    facilityType: '',
    equipmentAccess: [],
    technologyTools: [],
    spaceConstraints: '',
    equipmentLimitations: '',
    additionalResources: '',
  });

  // Toggle selection in array
  const toggleSelection = (field: 'equipmentAccess' | 'technologyTools', value: string) => {
    if (equipmentFacilities[field].includes(value)) {
      setEquipmentFacilities({
        ...equipmentFacilities,
        [field]: equipmentFacilities[field].filter(item => item !== value)
      });
    } else {
      setEquipmentFacilities({
        ...equipmentFacilities,
        [field]: [...equipmentFacilities[field], value]
      });
    }
  };

  // Update equipment and facilities
  const updateEquipmentFacilities = (key: keyof EquipmentFacilities, value: any) => {
    setEquipmentFacilities({
      ...equipmentFacilities,
      [key]: value
    });
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/coach/training-approach');
  };

  const handleContinue = () => {
    // Save equipment and facilities to context or local storage
    localStorage.setItem('equipmentFacilities', JSON.stringify(equipmentFacilities));
    
    // Navigate to next step
    navigate('/onboarding/coach/plan-generation');
  };

  // Check if form is complete enough to continue
  const isFormValid = () => {
    return (
      equipmentFacilities.facilityType !== '' &&
      equipmentFacilities.equipmentAccess.length > 0
    );
  };

  return (
    <OnboardingLayout 
      step={4} 
      totalSteps={5} 
      title="Equipment & Facilities"
      subtitle="Tell us about your training environment and available resources"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-start">
            <Dumbbell className="h-5 w-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-orange-700 mb-1">Training Resources</h3>
              <p className="text-sm text-gray-600">
                This information helps us create training programs that work with your available equipment
                and facilities, ensuring practical and implementable plans.
              </p>
            </div>
          </div>
        </div>

        {/* Facility Type */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Building className="h-4 w-4 mr-2 text-orange-600" />
            Primary Training Facility
          </Label>
          
          <RadioGroup
            value={equipmentFacilities.facilityType}
            onValueChange={(value) => updateEquipmentFacilities('facilityType', value)}
          >
            {facilityTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`facility-${option.id}`} />
                <Label htmlFor={`facility-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Equipment Access */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Dumbbell className="h-4 w-4 mr-2 text-orange-600" />
            Available Equipment
          </Label>
          <p className="text-sm text-gray-500">Select all equipment you have regular access to</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {equipmentOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`equipment-${option.id}`} 
                  checked={equipmentFacilities.equipmentAccess.includes(option.id)}
                  onCheckedChange={() => toggleSelection('equipmentAccess', option.id)}
                />
                <Label htmlFor={`equipment-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Tools */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Smartphone className="h-4 w-4 mr-2 text-orange-600" />
            Technology & Tools
          </Label>
          <p className="text-sm text-gray-500">Select all technology tools you use or have access to</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {technologyOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`tech-${option.id}`} 
                  checked={equipmentFacilities.technologyTools.includes(option.id)}
                  onCheckedChange={() => toggleSelection('technologyTools', option.id)}
                />
                <Label htmlFor={`tech-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Space Constraints */}
        <div className="space-y-3">
          <Label htmlFor="space-constraints" className="text-base font-medium flex items-center">
            <Ruler className="h-4 w-4 mr-2 text-orange-600" />
            Space Constraints
          </Label>
          <p className="text-sm text-gray-500">Describe any space limitations you face (Optional)</p>
          
          <Textarea
            id="space-constraints"
            placeholder="e.g., 'Limited indoor space during winter months' or 'Shared facility with limited availability'"
            value={equipmentFacilities.spaceConstraints}
            onChange={(e) => updateEquipmentFacilities('spaceConstraints', e.target.value)}
          />
        </div>

        {/* Equipment Limitations */}
        <div className="space-y-3">
          <Label htmlFor="equipment-limitations" className="text-base font-medium flex items-center">
            <Dumbbell className="h-4 w-4 mr-2 text-orange-600" />
            Equipment Limitations
          </Label>
          <p className="text-sm text-gray-500">Describe any equipment challenges or limitations (Optional)</p>
          
          <Textarea
            id="equipment-limitations"
            placeholder="e.g., 'Limited number of racks for large team' or 'No access to Olympic lifting equipment'"
            value={equipmentFacilities.equipmentLimitations}
            onChange={(e) => updateEquipmentFacilities('equipmentLimitations', e.target.value)}
          />
        </div>

        {/* Additional Resources */}
        <div className="space-y-3">
          <Label htmlFor="additional-resources" className="text-base font-medium flex items-center">
            <Building className="h-4 w-4 mr-2 text-orange-600" />
            Additional Resources
          </Label>
          <p className="text-sm text-gray-500">Describe any other resources or facilities available (Optional)</p>
          
          <Textarea
            id="additional-resources"
            placeholder="e.g., 'Access to swimming pool twice weekly' or 'Occasional use of university testing lab'"
            value={equipmentFacilities.additionalResources}
            onChange={(e) => updateEquipmentFacilities('additionalResources', e.target.value)}
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
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default EquipmentFacilities;
