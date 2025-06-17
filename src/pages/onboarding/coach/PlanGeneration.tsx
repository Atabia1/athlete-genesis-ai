
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Dumbbell, Loader2, BrainCircuit, RefreshCw, AlertCircle, WifiOff, Users, ClipboardList, Calendar } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CoachPlanGeneration = () => {
  const navigate = useNavigate();
  const {
    userType,
    setWorkoutPlan,
    setMealPlan,
  } = usePlan();

  if (userType !== 'coach') {
    navigate('/onboarding');
    return null;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentlyGenerating, setCurrentlyGenerating] = useState<string>('');

  const generatePlan = async () => {
    setIsLoading(true);
    setError(null);
    setIsNetworkError(false);
    setGenerationProgress(0);

    try {
      if (!navigator.onLine) {
        setIsNetworkError(true);
        setError("You appear to be offline. Please check your internet connection and try again.");
        throw new Error('Network offline');
      }

      const coachingPhilosophy = JSON.parse(localStorage.getItem('coachingPhilosophy') || '{}');
      const teamSetup = JSON.parse(localStorage.getItem('teamSetup') || '{}');
      const trainingApproach = JSON.parse(localStorage.getItem('trainingApproach') || '{}');
      const equipmentFacilities = JSON.parse(localStorage.getItem('equipmentFacilities') || '{}');

      console.log('Generating coaching system with profile:', { userType, coachingPhilosophy, teamSetup, trainingApproach, equipmentFacilities });

      setCurrentlyGenerating('Analyzing your coaching profile...');
      await simulateProgress(0, 15);

      setCurrentlyGenerating('Creating your team management system...');
      await simulateProgress(15, 35);

      setCurrentlyGenerating('Developing training program templates...');
      await simulateProgress(35, 55);

      setCurrentlyGenerating('Building assessment and monitoring protocols...');
      await simulateProgress(55, 75);

      setCurrentlyGenerating('Finalizing your coaching system...');
      await simulateProgress(75, 100);

      const mockWorkoutPlan = generateMockWorkoutPlan();
      const mockMealPlan = generateMockMealPlan();

      setWorkoutPlan(mockWorkoutPlan);
      setMealPlan(mockMealPlan);

      setIsGenerated(true);
      toast({
        title: "Success!",
        description: "Your coaching system has been generated!",
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      if (!isNetworkError) {
        setError('An error occurred while generating your coaching system. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const simulateProgress = async (from: number, to: number) => {
    const steps = 10;
    const increment = (to - from) / steps;
    const delay = 300;

    for (let i = 0; i <= steps; i++) {
      const progress = Math.min(from + (increment * i), to);
      setGenerationProgress(progress);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const generateMockWorkoutPlan = () => {
    return {
      id: 'wp-' + Date.now(),
      name: 'Team Training Program',
      description: 'Comprehensive training system based on your coaching philosophy',
      duration: 12,
      schedule: [
        {
          day: 'Monday',
          workouts: [
            {
              id: 'w1',
              name: 'Strength Training',
              type: 'strength',
              exercises: [
                {
                  id: 'e1',
                  name: 'Squats',
                  sets: 3,
                  reps: 10,
                  restPeriod: 90,
                  description: 'Focus on proper form and depth'
                }
              ],
              duration: 60,
              caloriesBurned: 300
            }
          ],
          nutrition: {
            calories: 2500,
            protein: 150,
            carbs: 300,
            fat: 80,
            water: 3000,
            meals: {
              breakfast: 'High protein breakfast',
              lunch: 'Balanced training meal',
              dinner: 'Recovery meal',
              snacks: ['Protein shake', 'Fruit']
            }
          }
        }
      ],
      nutrition: {
        dailyCalories: 2500,
        macros: {
          protein: 150,
          carbs: 300,
          fat: 80
        },
        meals: {
          breakfast: ['Oatmeal with protein'],
          lunch: ['Chicken and rice'],
          dinner: ['Salmon and vegetables'],
          snacks: ['Protein shake']
        }
      }
    };
  };

  const generateMockMealPlan = () => {
    return {
      id: 'mp-' + Date.now(),
      title: 'Team Nutrition Guidelines',
      description: 'Nutrition recommendations for optimal performance',
      createdAt: new Date().toISOString(),
      days: [
        {
          dayNumber: 1,
          meals: [
            {
              type: 'Pre-Training',
              title: 'Performance Fuel',
              description: 'Balanced meal with complex carbs, lean protein, and healthy fats',
              nutrients: { calories: 450, protein: '25g', carbs: '50g', fat: '15g' }
            }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    generatePlan();
  }, []);

  const handleBack = () => {
    navigate('/onboarding/coach/equipment-facilities');
  };

  const handleContinue = () => {
    navigate('/onboarding/coach/payment');
  };

  const handleRetry = () => {
    generatePlan();
  };

  return (
    <OnboardingLayout
      step={5}
      totalSteps={5}
      title="Creating Your Coaching System"
      subtitle="We're building your personalized coaching tools and resources"
    >
      <div className="space-y-6 mb-8">
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-orange-100 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  <BrainCircuit className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-1">{currentlyGenerating}</h3>
              <p className="text-sm text-gray-500">This may take a minute...</p>
            </div>

            <Progress value={generationProgress} className="h-2 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-orange-600" />
                    Team Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Creating roster management, athlete profiles, and communication tools
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <ClipboardList className="h-4 w-4 mr-2 text-orange-600" />
                    Training Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Developing customized training templates based on your methodology
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                    Periodization System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Creating season planning tools and periodization frameworks
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              {isNetworkError && (
                <div className="mt-2 flex items-center">
                  <WifiOff className="h-4 w-4 mr-2" />
                  <span>Please check your internet connection and try again.</span>
                </div>
              )}
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={handleRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </Alert>
        )}

        {isGenerated && !isLoading && !error && (
          <div className="space-y-6">
            <Alert className="bg-orange-50 border-orange-200">
              <Users className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-700">Your Coaching System is Ready!</AlertTitle>
              <AlertDescription className="text-gray-600">
                We've created a comprehensive coaching system based on your philosophy, team setup, and training approach.
                Your system includes team management tools, training templates, and athlete monitoring resources.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-orange-600" />
                    Team Management Suite
                  </CardTitle>
                  <CardDescription>
                    Comprehensive tools to manage your athletes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="rounded-full bg-orange-100 p-1 mr-2 mt-0.5">
                        <Users className="h-3 w-3 text-orange-600" />
                      </div>
                      <span>Athlete roster with detailed profiles</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-orange-100 p-1 mr-2 mt-0.5">
                        <Users className="h-3 w-3 text-orange-600" />
                      </div>
                      <span>Performance tracking and analytics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-orange-100 p-1 mr-2 mt-0.5">
                        <Users className="h-3 w-3 text-orange-600" />
                      </div>
                      <span>Team communication and scheduling tools</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-orange-600" />
                    Training Program Library
                  </CardTitle>
                  <CardDescription>
                    Customized training templates and resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="rounded-full bg-orange-100 p-1 mr-2 mt-0.5">
                        <Dumbbell className="h-3 w-3 text-orange-600" />
                      </div>
                      <span>Periodized training templates</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-orange-100 p-1 mr-2 mt-0.5">
                        <Dumbbell className="h-3 w-3 text-orange-600" />
                      </div>
                      <span>Exercise library with coaching cues</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-orange-100 p-1 mr-2 mt-0.5">
                        <Dumbbell className="h-3 w-3 text-orange-600" />
                      </div>
                      <span>Assessment protocols and benchmarks</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
        <Button
          onClick={handleContinue}
          disabled={isLoading || !isGenerated || !!error}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Continue to Subscription Options
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default CoachPlanGeneration;
