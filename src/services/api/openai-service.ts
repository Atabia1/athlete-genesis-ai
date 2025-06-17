
import { WorkoutPlan, WorkoutGoal } from '@/types/workout';

// Mock function to generate a workout plan
const generateMockWorkoutPlan = async (userProfile: any): Promise<WorkoutPlan> => {
  // Simulate a delay to mimic an API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data for the workout plan
  const mockWorkoutPlan: WorkoutPlan = {
    id: 'mock-workout-plan',
    name: 'Personalized Workout Plan',
    description: 'A workout plan tailored to your profile',
    schedule: [
      {
        day: 'Monday',
        workouts: [
          {
            id: 'w1',
            name: 'Strength Training',
            date: new Date().toISOString(),
            exercises: [
              { id: 'e1', name: 'Squats', sets: 3, reps: 10 },
              { id: 'e2', name: 'Bench Press', sets: 3, reps: 8 },
            ],
          },
        ],
        nutrition: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 70,
          water: 3000,
          meals: {
            breakfast: 'Oatmeal with berries',
            lunch: 'Chicken salad',
            dinner: 'Salmon with vegetables',
            snacks: ['Apple', 'Nuts'],
          },
        },
      },
      {
        day: 'Tuesday',
        workouts: [
          {
            id: 'w2',
            name: 'Cardio',
            date: new Date().toISOString(),
            exercises: [
              { id: 'e3', name: 'Running', duration: 30 },
            ],
          },
        ],
        nutrition: {
          calories: 1800,
          protein: 120,
          carbs: 180,
          fat: 60,
          water: 3000,
          meals: {
            breakfast: 'Yogurt with granola',
            lunch: 'Turkey sandwich',
            dinner: 'Lentil soup',
            snacks: ['Banana', 'Almonds'],
          },
        },
      },
    ],
    author: 'AI Fitness',
    level: 'intermediate',
    duration: 4,
    goal: WorkoutGoal.STRENGTH,
    equipment: ['dumbbells', 'bench'],
    isTemplate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'strength',
    tags: ['strength', 'full body'],
    nutrition: {
      dailyCalories: 2000,
      macros: {
        protein: 150,
        carbs: 200,
        fat: 70,
      },
      meals: {
        breakfast: ['Oatmeal with berries'],
        lunch: ['Chicken salad'],
        dinner: ['Salmon with vegetables'],
        snacks: ['Apple', 'Nuts'],
      },
    },
  };

  return mockWorkoutPlan;
};

export const generateFitnessPlan = async (userProfile: any): Promise<WorkoutPlan> => {
  try {
    // Simulate a call to the OpenAI API to generate a fitness plan
    // In a real application, you would replace this with an actual API call
    console.log('Generating fitness plan with user profile:', userProfile);

    const plan = await generateMockWorkoutPlan(userProfile);
    
    // Ensure we always return a valid WorkoutPlan
    if (!plan) {
      throw new Error('Failed to generate workout plan');
    }
    
    return plan;
  } catch (error) {
    console.error('Error generating fitness plan:', error);
    throw error;
  }
};
