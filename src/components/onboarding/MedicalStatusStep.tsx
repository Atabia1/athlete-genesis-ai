
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Heart, AlertCircle, Shield } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan, MedicalStatus } from '@/context/PlanContext';

const MedicalStatusStep = () => {
  const { medicalStatus, setMedicalStatus } = usePlan();
  const navigate = useNavigate();

  // Local state for form data
  const [selectedConditions, setSelectedConditions] = useState<string[]>(medicalStatus?.conditions || []);
  const [medications, setMedications] = useState<string[]>(medicalStatus?.medications || []);
  const [injuries] = useState<string[]>(medicalStatus?.injuries || []);
  const [medicalClearance, setMedicalClearance] = useState<boolean>(medicalStatus?.medicalClearance || false);
  const [additionalNotes, setAdditionalNotes] = useState<string>(medicalStatus?.notes || '');

  const handleBack = () => {
    navigate('/onboarding/experience-level');
  };

  const handleContinue = () => {
    const status: MedicalStatus = {
      conditions: selectedConditions,
      medications,
      injuries,
      medicalClearance,
      notes: additionalNotes
    };

    setMedicalStatus(status);
    navigate('/onboarding/time-and-equipment');
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const toggleMedication = (medication: string) => {
    setMedications(prev =>
      prev.includes(medication)
        ? prev.filter(m => m !== medication)
        : [...prev, medication]
    );
  };

  return (
    <OnboardingLayout step={4} totalSteps={7} title="Medical & Health Information">
      <div className="space-y-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-700 mb-1">Privacy & Safety</h3>
              <p className="text-sm text-blue-600">
                This information helps us create a safe, personalized plan. All data is encrypted and confidential.
              </p>
            </div>
          </div>
        </div>

        {/* Health Conditions */}
        <div>
          <h3 className="font-medium text-lg mb-3 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Health Conditions
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select any health conditions that might affect your training (optional)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Diabetes',
              'High Blood Pressure',
              'Heart Disease',
              'Asthma',
              'Arthritis',
              'Back Problems',
              'Knee Problems',
              'None'
            ].map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                />
                <label htmlFor={condition} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div>
          <h3 className="font-medium text-lg mb-3">Current Medications</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select any medications you're currently taking (optional)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Blood pressure medication',
              'Diabetes medication',
              'Pain relievers',
              'Anti-inflammatory drugs',
              'Heart medication',
              'Asthma medication',
              'None'
            ].map((medication) => (
              <div key={medication} className="flex items-center space-x-2">
                <Checkbox
                  id={medication}
                  checked={medications.includes(medication)}
                  onCheckedChange={() => toggleMedication(medication)}
                />
                <label htmlFor={medication} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {medication}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Clearance */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-700 mb-2">Medical Clearance</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medical-clearance"
                  checked={medicalClearance}
                  onCheckedChange={(checked) => setMedicalClearance(checked === true)}
                />
                <label htmlFor="medical-clearance" className="text-sm text-amber-700">
                  I have medical clearance to participate in physical activity, or I don't have any medical conditions that would prevent me from exercising
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="font-medium text-lg mb-3">Additional Notes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Any other health information or concerns you'd like us to know about? (optional)
          </p>
          <Textarea
            placeholder="e.g., recent injuries, dietary restrictions, exercise limitations..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={4}
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
          disabled={!medicalClearance}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default MedicalStatusStep;
