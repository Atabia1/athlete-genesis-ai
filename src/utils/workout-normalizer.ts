
import { WorkoutPlan } from '@/types/workout';

/**
 * Standardize workout plan data to ensure consistency
 */
export function standardizeWorkoutPlan(workoutPlan: any): WorkoutPlan {
  if (!workoutPlan) {
    throw new Error('Workout plan is required');
  }

  return {
    id: workoutPlan.id || '',
    name: workoutPlan.name || workoutPlan.title || '',
    description: workoutPlan.description || '',
    schedule: workoutPlan.schedule || [],
    author: workoutPlan.author || 'Unknown',
    level: workoutPlan.level || 'beginner',
    duration: workoutPlan.duration || 4,
    goal: workoutPlan.goal || 'GENERAL_FITNESS',
    equipment: workoutPlan.equipment || [],
    isTemplate: workoutPlan.isTemplate || false,
    createdAt: workoutPlan.createdAt || workoutPlan.created_at || new Date().toISOString(),
    updatedAt: workoutPlan.updatedAt || workoutPlan.updated_at || new Date().toISOString(),
    category: workoutPlan.category || 'general',
    tags: workoutPlan.tags || [],
    nutrition: workoutPlan.nutrition || {
      dailyCalories: 2000,
      macros: { protein: 150, carbs: 200, fat: 70 },
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      }
    }
  };
}
