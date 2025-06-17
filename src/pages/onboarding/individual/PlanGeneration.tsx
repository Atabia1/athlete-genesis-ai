import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Dumbbell, Loader2, BrainCircuit, RefreshCw, AlertCircle, WifiOff, Heart, Brain } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const IndividualPlanGeneration = () => {
  const navigate = useNavigate();
  const {
    userType,
    setWorkoutPlan,
    setMealPlan,
  } = usePlan();

  if (userType !== 'individual') {
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

      const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '{}');
      const lifestyleHabits = JSON.parse(localStorage.getItem('lifestyleHabits') || '{}');
      const fitnessHistory = JSON.parse(localStorage.getItem('fitnessHistory') || '{}');
      const wellnessGoals = JSON.parse(localStorage.getItem('wellnessGoals') || '{}');

      console.log('Generating wellness plan with profile:', { userType, healthMetrics, lifestyleHabits, fitnessHistory, wellnessGoals });

      setCurrentlyGenerating('Analyzing your health profile...');
      await simulateProgress(0, 20);

      setCurrentlyGenerating('Creating your personalized fitness plan...');
      await simulateProgress(20, 40);

      setCurrentlyGenerating('Developing nutrition guidance based on your goals...');
      await simulateProgress(40, 60);

      setCurrentlyGenerating('Building mindfulness and stress management practices...');
      await simulateProgress(60, 80);

      setCurrentlyGenerating('Finalizing your holistic wellness plan...');
      await simulateProgress(80, 100);

      const mockWorkoutPlan = generateMockWorkoutPlan();
      const mockMealPlan = generateMockMealPlan();

      setWorkoutPlan(mockWorkoutPlan);
      setMealPlan(mockMealPlan);

      setIsGenerated(true);
      toast({
        title: "Success!",
        description: "Your personalized wellness plan has been generated!",
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      if (!isNetworkError) {
        setError('An error occurred while generating your plan. Please try again.');
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
      name: 'Holistic Wellness Program',
      title: 'Holistic Wellness Program',
      description: 'A balanced approach to fitness, mindfulness, and overall wellbeing',
      level: 'beginner',
      duration: '12 weeks',
      createdAt: new Date().toISOString(),
      schedule: {
        frequency: 'weekly',
        sessions: 3
      },
      nutrition: {
        guidelines: 'Balanced nutrition for wellness',
        calories: 2000
      },
      weeks: [
        {
          weekNumber: 1,
          theme: 'Foundation Building',
          days: [
            {
              dayNumber: 1,
              focus: 'Cardio & Mindfulness',
              exercises: [
                { name: 'Walking', duration: '20 min', intensity: 'Moderate' },
                { name: 'Deep Breathing', duration: '5 min', intensity: 'Light' },
                { name: 'Stretching', duration: '10 min', intensity: 'Light' }
              ]
            }
          ]
        }
      ]
    };
  };

  const generateMockMealPlan = () => {
    return {
      id: 'mp-' + Date.now(),
      title: 'Balanced Nutrition Plan',
      description: 'Nourishing foods to support your wellness journey',
      createdAt: new Date().toISOString(),
      days: [
        {
          dayNumber: 1,
          meals: [
            {
              type: 'Breakfast',
              title: 'Energizing Morning Bowl',
              description: 'Greek yogurt with berries, nuts, and honey',
              nutrients: { calories: 350, protein: '20g', carbs: '30g', fat: '15g' }
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
    navigate('/onboarding/individual/wellness-goals');
  };

  const handleContinue = () => {
    navigate('/onboarding/individual/payment');
  };

  const handleRetry = () => {
    generatePlan();
  };

  return (
    <OnboardingLayout
      step={5}
      totalSteps={5}
      title="Creating Your Wellness Plan"
      subtitle="We're crafting a personalized plan based on your unique profile"
    >
      <div className="space-y-6 mb-8">
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-teal-100 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
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
                    <Dumbbell className="h-4 w-4 mr-2 text-teal-600" />
                    Fitness Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Creating workouts tailored to your fitness level, preferences, and goals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <utensils className="h-4 w-4 mr-2 text-teal-600" />
                    Nutrition Guidance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Developing eating strategies based on your dietary preferences and habits
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-teal-600" />
                    Mindfulness Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Creating stress management and mental wellness techniques
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
            <Alert className="bg-teal-50 border-teal-200">
              <Heart className="h-4 w-4 text-teal-600" />
              <AlertTitle className="text-teal-700">Your Wellness Plan is Ready!</AlertTitle>
              <AlertDescription className="text-gray-600">
                We've created a personalized plan based on your unique profile. Your plan includes fitness routines,
                nutrition guidance, mindfulness practices, and habit-building strategies.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-teal-600" />
                    Holistic Fitness Plan
                  </CardTitle>
                  <CardDescription>
                    Balanced workouts for your body and mind
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="rounded-full bg-teal-100 p-1 mr-2 mt-0.5">
                        <Heart className="h-3 w-3 text-teal-600" />
                      </div>
                      <span>Personalized to your fitness level and preferences</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-teal-100 p-1 mr-2 mt-0.5">
                        <Heart className="h-3 w-3 text-teal-600" />
                      </div>
                      <span>Includes mindfulness and recovery practices</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-teal-100 p-1 mr-2 mt-0.5">
                        <Heart className="h-3 w-3 text-teal-600" />
                      </div>
                      <span>Progressive program that evolves with you</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <utensils className="h-5 w-5 mr-2 text-teal-600" />
                    Nutrition & Lifestyle
                  </CardTitle>
                  <CardDescription>
                    Sustainable habits for long-term wellness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="rounded-full bg-teal-100 p-1 mr-2 mt-0.5">
                        <Heart className="h-3 w-3 text-teal-600" />
                      </div>
                      <span>Nutrition guidance aligned with your preferences</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-teal-100 p-1 mr-2 mt-0.5">
                        <Heart className="h-3 w-3 text-teal-600" />
                      </div>
                      <span>Sleep optimization strategies</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-teal-100 p-1 mr-2 mt-0.5">
                        <Heart className="h-3 w-3 text-teal-600" />
                      </div>
                      <span>Stress management techniques</span>
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
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Continue to Subscription Options
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default IndividualPlanGeneration;
