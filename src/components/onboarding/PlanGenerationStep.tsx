
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Utensils, Loader2, BrainCircuit, RefreshCw, AlertTriangle } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { toast } from '@/components/ui/use-toast';

const PlanGenerationStep = () => {
  const navigate = useNavigate();
  const { 
    userType, 
    fitnessGoals, 
    sport,
    experienceLevel,
    frequency,
    duration,
    timeOfDay,
    equipment,
    otherEquipment,
    setWorkoutPlan,
    setMealPlan
  } = usePlan();

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    // Check if essential data is missing
    if (!userType || fitnessGoals.length === 0 || !sport || !experienceLevel || 
        !frequency || !duration || !timeOfDay || equipment.length === 0) {
      toast({
        title: "Missing information",
        description: "Please complete all onboarding steps first.",
        variant: "destructive"
      });
      navigate('/onboarding/time-and-equipment');
    }
  }, [userType, fitnessGoals, sport, experienceLevel, frequency, duration, timeOfDay, equipment, navigate]);

  const generatePlans = async () => {
    setIsLoading(true);
    
    try {
      const userProfile = {
        userType,
        fitnessGoals,
        sport,
        experienceLevel,
        frequency,
        duration,
        timeOfDay,
        equipment,
        otherEquipment
      };

      const response = await fetch(`${window.location.origin}/api/generate-fitness-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      
      // Set the plans in context
      setWorkoutPlan(data.workoutPlan);
      setMealPlan(data.mealPlan);
      
      setIsGenerated(true);
      toast({
        title: "Success!",
        description: "Your personalized plans have been generated!",
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate your plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/time-and-equipment');
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const getGoalDisplayName = (goal: string) => {
    switch (goal) {
      case 'performance': return 'Performance Improvement';
      case 'strength': return 'Strength & Muscle';
      case 'weight': return 'Weight Management';
      case 'health': return 'General Health';
      case 'endurance': return 'Endurance';
      case 'recovery': return 'Recovery & Mobility';
      default: return goal;
    }
  };

  return (
    <OnboardingLayout step={5} totalSteps={5} title="Generate Your Personalized Plan">
      <div className="space-y-6 mb-8">
        <p className="text-gray-600">
          Our AI will analyze your profile and generate a customized workout and meal plan tailored to your specific needs.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-medium text-lg mb-4">Your Profile Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">User Type</p>
              <p className="text-md">{userType === 'athlete' ? 'Athlete' : userType === 'individual' ? 'Fitness Enthusiast' : 'Coach'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Sport/Activity</p>
              <p className="text-md">{sport}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Goals</p>
              <p className="text-md">{fitnessGoals.map(getGoalDisplayName).join(', ')}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Experience Level</p>
              <p className="text-md capitalize">{experienceLevel}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Training Frequency</p>
              <p className="text-md">{frequency} days per week</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Session Duration</p>
              <p className="text-md">
                {duration === '<30' ? 'Less than 30 minutes' :
                 duration === '30-45' ? '30-45 minutes' :
                 duration === '45-60' ? '45-60 minutes' :
                 duration === '60-90' ? '60-90 minutes' :
                 '90+ minutes'}
              </p>
            </div>
          </div>
        </div>
        
        {!isGenerated ? (
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="space-y-6 w-full max-w-md px-4 py-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-center text-gray-700">How Our AI Creates Your Plan</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-athleteBlue-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <BrainCircuit className="h-4 w-4 text-athleteBlue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Advanced Analysis</p>
                    <p className="text-xs text-gray-500">Our AI analyzes your sport, goals, and constraints to create sport-specific training plans.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-athleteBlue-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <RefreshCw className="h-4 w-4 text-athleteBlue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Continuous Adaptation</p>
                    <p className="text-xs text-gray-500">As you log workouts and meals, the system adapts your program based on your progress.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-athleteBlue-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-athleteBlue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Intelligent Monitoring</p>
                    <p className="text-xs text-gray-500">The AI helps identify potential issues like overtraining or nutrition gaps based on your data.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={generatePlans}
              disabled={isLoading}
              size="lg"
              className="bg-athleteBlue-600 hover:bg-athleteBlue-700 w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>Generate My Personalized Plan</>
              )}
            </Button>
            {isLoading && (
              <p className="text-sm text-gray-500 text-center italic">
                This may take a minute as our AI creates a fully customized plan for you.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Dumbbell className="h-6 w-6 text-athleteBlue-600 mr-2" />
                  <h3 className="font-medium text-lg">Workout Plan</h3>
                </div>
                <p className="text-gray-600 text-sm">Your personalized workout plan has been created based on your goals, experience level, and available equipment.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Utensils className="h-6 w-6 text-athleteGreen-600 mr-2" />
                  <h3 className="font-medium text-lg">Meal Plan</h3>
                </div>
                <p className="text-gray-600 text-sm">Your personalized meal plan has been created to support your fitness goals and training regimen.</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleContinue}
                size="lg"
                className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
              >
                View My Plans
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default PlanGenerationStep;
