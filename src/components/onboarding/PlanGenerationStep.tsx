
/**
 * Plan Generation Step Component
 *
 * This component handles the final step of the onboarding process where the user
 * can generate personalized workout and meal plans based on their profile information.
 *
 * Key features:
 * - Displays information about how the AI creates personalized plans
 * - Handles the API call to generate plans (with fallback to mock data)
 * - Provides detailed error handling and network status detection
 * - Shows loading states and success/error messages
 * - Stores generated plans in the PlanContext for use throughout the app
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Utensils, Loader2, BrainCircuit, RefreshCw, AlertTriangle, WifiOff } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateFitnessPlan } from '@/api/generate-fitness-plan';
import { useServices } from '@/services/service-registry';

/**
 * PlanGenerationStep: Final step in the onboarding process
 *
 * This component is responsible for generating personalized workout and meal plans
 * based on the user's preferences collected during the onboarding process. It displays
 * a summary of the user's profile, explains the AI generation process, and provides
 * controls to generate the plans and navigate to the dashboard.
 *
 * Key features:
 * - Profile summary display
 * - AI plan generation explanation
 * - Network status detection to handle offline scenarios
 * - Detailed error handling with specific error messages
 * - Loading states with appropriate UI feedback
 * - Success handling to store generated plans in context
 * - Troubleshooting tips for users when errors occur
 * - Fallback to mock data when the API is unavailable
 * - API integration with Supabase Edge Functions
 * - Navigation to dashboard after plan generation
 */

const PlanGenerationStep = () => {
  const navigate = useNavigate();
  const services = useServices();
  const {
    userType,
    fitnessGoals,
    sportActivity,
    experienceLevel,
    frequency,
    duration,
    timeOfDay,
    equipment,
    otherEquipment,
    medicalStatus,
    generatingPlan,
    setGeneratingPlan,
    setWorkoutPlan,
    setMealPlan
  } = usePlan();

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  /**
   * Validate that all required data is present
   * Redirects back to previous step if any information is missing
   */
  useEffect(() => {
    // Check if essential data is missing
    if (!userType || fitnessGoals.length === 0 || !sportActivity || !experienceLevel ||
        !frequency || !duration || !timeOfDay || equipment.length === 0 || !medicalStatus) {
      toast({
        title: "Missing information",
        description: "Please complete all onboarding steps first.",
        variant: "destructive"
      });
      navigate('/onboarding/medical-status');
    }
  }, [userType, fitnessGoals, sportActivity, experienceLevel, frequency, duration, timeOfDay, equipment, medicalStatus, navigate]);

  /**
   * Generate personalized workout and meal plans
   *
   * This function handles the plan generation process by:
   * 1. Checking network connectivity
   * 2. Attempting to call the Supabase Edge Function
   * 3. Falling back to mock data if the API call fails
   * 4. Validating the response data
   * 5. Storing the plans in context
   * 6. Handling errors with appropriate messages
   *
   * @returns {Promise<void>}
   */
  const generatePlans = async () => {
    // Reset state before starting
    setIsLoading(true);
    setGeneratingPlan(true);
    setError(null);
    setIsNetworkError(false);

    try {
      // Check for network connectivity first
      if (!navigator.onLine) {
        setIsNetworkError(true);
        setError("You appear to be offline. Please check your internet connection and try again.");
        throw new Error('Network offline');
      }

      const userProfile = {
        userType,
        fitnessGoals,
        sportActivity,
        experienceLevel,
        frequency,
        duration,
        timeOfDay,
        equipment,
        otherEquipment,
        medicalStatus
      };

      console.log('Sending user profile to API:', userProfile);

      // Get data from either the Edge Function or the mock API
      let data;

      // Try to use the OpenAI service first, fall back to mock if it fails
      try {
        // Check if OpenAI service is available
        if (services.openAI.isAvailable()) {
          console.log('Using OpenAI service to generate fitness plan');

          // Generate fitness plan using OpenAI service
          data = await services.openAI.generateFitnessPlan(userProfile);
          console.log('Successfully generated fitness plan using OpenAI service');
        } else {
          // If OpenAI API key is not set, try Supabase Edge Function
          console.log('OpenAI API key not set, trying Supabase Edge Function');

          const supabaseUrl = 'https://ykgceurbedpusquqepdq.supabase.co';
          const response = await fetch(`${supabaseUrl}/functions/v1/generate-fitness-plan`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userProfile),
          });

          if (!response.ok) {
            // Try to get more detailed error information
            let errorMessage = 'Edge Function failed';
            try {
              const errorData = await response.json();
              if (errorData && errorData.error) {
                errorMessage = errorData.error;
                if (errorData.details) {
                  errorMessage += `: ${errorData.details}`;
                }
              }
            } catch (e) {
              // If we can't parse the error response, use the status text
              errorMessage = `Edge Function error: ${response.status} ${response.statusText}`;
            }

            console.warn('Supabase Edge Function failed, falling back to mock API:', errorMessage);
            throw new Error(errorMessage);
          }

          data = await response.json();
          console.log('Successfully received data from Supabase Edge Function');
        }
      } catch (apiError) {
        console.warn('Using mock API as fallback:', apiError);
        // Use our mock API function as fallback
        data = await generateFitnessPlan(userProfile);
        console.log('Plan generation successful, received data from mock API');
      }

      // Validate the response data
      if (!data || !data.workoutPlan || !data.mealPlan) {
        setError('The generated plan data is incomplete. Please try again.');
        throw new Error('Incomplete plan data');
      }

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

      // Only show toast if we haven't set a specific error already
      if (!isNetworkError && !error) {
        setError("An unexpected error occurred. Please try again.");
        toast({
          title: "Error",
          description: "Failed to generate your plan. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
      setGeneratingPlan(false);
    }
  };

  /**
   * Navigate back to the previous step (Medical Status)
   */
  const handleBack = () => {
    navigate('/onboarding/medical-status');
  };

  /**
   * Navigate to the payment page after plan generation
   */
  const handleContinue = () => {
    navigate('/onboarding/payment');
  };

  return (
    <OnboardingLayout step={6} totalSteps={7} title="Generate Your Personalized Plan">
      <div className="space-y-6 mb-8">
        <p className="text-gray-600">
          Our AI will analyze your profile and generate a customized workout and meal plan tailored to your specific needs.
        </p>

        {/* Profile Summary Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-medium text-lg mb-4">Your Profile Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">User Type</p>
              <p className="text-md">{userType === 'athlete' ? 'Athlete' : userType === 'individual' ? 'Fitness Enthusiast' : 'Coach'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Sport/Activity</p>
              <p className="text-md">{sportActivity}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Goals</p>
              <p className="text-md">{fitnessGoals.map(goal =>
                goal === 'performance' ? 'Performance Improvement' :
                goal === 'strength' ? 'Strength & Muscle' :
                goal === 'weight' ? 'Weight Management' :
                goal === 'health' ? 'General Health' :
                goal === 'endurance' ? 'Endurance' :
                'Recovery & Mobility'
              ).join(', ')}</p>
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

            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Medical Considerations</p>
              <p className="text-md">
                {medicalStatus && (
                  <>
                    {medicalStatus.healthConditions.length > 0 && (
                      <span className="inline-block mr-2 mb-1 px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                        {medicalStatus.healthConditions.length} Health Condition(s)
                      </span>
                    )}
                    {medicalStatus.injuries.length > 0 && (
                      <span className="inline-block mr-2 mb-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                        {medicalStatus.injuries.length} Injury/Injuries
                      </span>
                    )}
                    {medicalStatus.allergies.length > 0 && (
                      <span className="inline-block mr-2 mb-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                        {medicalStatus.allergies.length} Allergy/Allergies
                      </span>
                    )}
                    {medicalStatus.medicalClearance && (
                      <span className="inline-block mr-2 mb-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                        {medicalStatus.medicalClearance === 'yes' ? 'Medical Clearance: Yes' :
                         medicalStatus.medicalClearance === 'no' ? 'Medical Clearance: No' :
                         'Medical Clearance: Not Needed'}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Conditional rendering based on plan generation state */}
        {!isGenerated ? (
          // AI Plan Generation UI
          <div className="flex flex-col items-center space-y-6 py-8">
            {/* Error display */}
            {error && (
              <Alert variant="destructive" className="mb-4 w-full max-w-md">
                {isNetworkError ? (
                  <WifiOff className="h-4 w-4 mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                <AlertTitle>{isNetworkError ? "Network Error" : "Error Generating Plan"}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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

            {/* Troubleshooting tips when there's an error */}
            {error && !isLoading && (
              <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium mb-2">Troubleshooting Tips:</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Check your internet connection and try again</li>
                  <li>Refresh the page and attempt to generate the plan again</li>
                  <li>Try using a different browser or device</li>
                  <li>If the problem persists, please contact support</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          // Generated Plans Success UI
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
                Choose My Plan
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
