
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Search } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan } from '@/context/PlanContext';

const popularSports = [
  'Running', 'Weightlifting', 'CrossFit', 'Basketball', 
  'Soccer', 'Swimming', 'Cycling', 'Tennis', 
  'Yoga', 'HIIT', 'Triathlon', 'Volleyball',
  'Golf', 'Baseball', 'Football', 'Boxing',
  'Martial Arts', 'Rock Climbing', 'Rowing', 'Hockey'
];

const SportActivityStep = () => {
  const { sportActivity, setSportActivity } = usePlan();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(sportActivity);
  const navigate = useNavigate();

  const filteredSports = searchTerm 
    ? popularSports.filter(sport => 
        sport.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : popularSports;
    
  const handleBack = () => {
    navigate('/onboarding/fitness-goals');
  };

  const handleContinue = () => {
    if (selectedSport) {
      setSportActivity(selectedSport);
      navigate('/onboarding/experience-level');
    }
  };

  return (
    <OnboardingLayout step={2} totalSteps={5} title="What sport or activity do you practice?">
      <div className="space-y-4 mb-8">
        <p className="text-gray-600">
          Select your primary sport or physical activity. This helps us tailor workouts specific to your needs.
        </p>
        
        <div className="relative mt-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-athleteBlue-500 focus:border-athleteBlue-500 sm:text-sm"
            placeholder="Search for a sport or activity"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredSports.map((sport) => (
            <div
              key={sport}
              className={`px-3 py-2 rounded-md cursor-pointer text-center transition-colors ${
                selectedSport === sport
                  ? 'bg-athleteBlue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedSport(sport)}
            >
              {sport}
            </div>
          ))}
        </div>
        
        {filteredSports.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No sports found matching "{searchTerm}". Try another search term or select a different activity.
          </div>
        )}
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
          disabled={!selectedSport}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default SportActivityStep;
