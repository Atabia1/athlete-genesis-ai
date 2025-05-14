/**
 * Workout Normalizer: Utilities for normalizing workout data structures
 * 
 * This module provides functions to ensure that all workout data follows a consistent
 * structure, regardless of its source (AI-generated, pre-defined templates, or user-created).
 * It handles missing fields, type conversions, and structure validation.
 */

import { 
  WorkoutPlan, 
  Exercise, 
  MealPlan,
  Meal,
} from '@/shared/types/workout';
import { ExperienceLevel, FitnessGoal, EquipmentOption } from '@/features/workout/context/PlanContext';

/**
 * Default values for workout plan properties
 */
const DEFAULT_VALUES = {
  level: 'intermediate' as ExperienceLevel,
  goals: [] as FitnessGoal[],
  equipment: [] as EquipmentOption[],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Normalize an exercise to ensure it has all required fields
 */
export function normalizeExercise(exercise: Partial<Exercise>): Exercise {
  return {
    id: exercise.id || `exercise-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: exercise.name || 'Unnamed Exercise',
    description: exercise.description || '',
    sets: exercise.sets || 3,
    reps: exercise.reps || 10,
    rest: exercise.rest || 60,
    weight: exercise.weight || 0,
    unit: exercise.unit || 'kg',
    type: exercise.type || 'strength',
    muscleGroup: exercise.muscleGroup || 'full_body',
    difficulty: exercise.difficulty || 'intermediate',
    order: exercise.order || 0,
    notes: exercise.notes || '',
  };
}

/**
 * Normalize a workout plan to ensure it has all required fields
 */
export function normalizeWorkoutPlan(plan: Partial<WorkoutPlan>): WorkoutPlan {
  // Generate a unique ID if none exists
  const id = plan.id || `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id,
    name: plan.name || 'Unnamed Workout Plan',
    description: plan.description || 'No description provided',
    userId: plan.userId || '',
    createdAt: plan.createdAt || DEFAULT_VALUES.createdAt,
    updatedAt: plan.updatedAt || DEFAULT_VALUES.updatedAt,
    type: plan.type || 'custom',
    difficulty: plan.difficulty || 'intermediate',
    duration: plan.duration || 60,
    goal: plan.goal || 'general',
    exercises: Array.isArray(plan.exercises) 
      ? plan.exercises.map(normalizeExercise) 
      : [],
    tags: Array.isArray(plan.tags) ? plan.tags : [],
    status: plan.status || 'active',
    source: plan.source || 'user',
  };
}

/**
 * Normalize a meal to ensure it has all required fields
 */
export function normalizeMeal(meal: Partial<Meal>): Meal {
  return {
    id: meal.id || `meal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: meal.name || 'Unnamed Meal',
    description: meal.description || '',
    type: meal.type || 'breakfast',
    calories: typeof meal.calories === 'number' ? meal.calories : 0,
    protein: typeof meal.protein === 'number' ? meal.protein : 0,
    carbs: typeof meal.carbs === 'number' ? meal.carbs : 0,
    fat: typeof meal.fat === 'number' ? meal.fat : 0,
    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
    instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
    order: meal.order || 0,
    notes: meal.notes || '',
  };
}

/**
 * Normalize a meal plan to ensure it has all required fields
 */
export function normalizeMealPlan(plan: Partial<MealPlan>): MealPlan {
  // Generate a unique ID if none exists
  const id = plan.id || `meal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id,
    name: plan.name || 'Unnamed Meal Plan',
    description: plan.description || 'No description provided',
    userId: plan.userId || '',
    createdAt: plan.createdAt || DEFAULT_VALUES.createdAt,
    updatedAt: plan.updatedAt || DEFAULT_VALUES.updatedAt,
    type: plan.type || 'custom',
    goal: plan.goal || 'general',
    meals: Array.isArray(plan.meals) 
      ? plan.meals.map(normalizeMeal) 
      : [],
    tags: Array.isArray(plan.tags) ? plan.tags : [],
    status: plan.status || 'active',
    source: plan.source || 'user',
  };
}

/**
 * Validate a workout plan to ensure it meets minimum requirements
 * Returns true if valid, false otherwise
 */
export function isValidWorkoutPlan(plan: Partial<WorkoutPlan>): boolean {
  if (!plan) return false;
  
  // Check for required fields
  if (!plan.id) return false;
  if (!plan.name) return false;
  
  // Check for exercises array
  if (!Array.isArray(plan.exercises)) return false;
  
  return true;
}

/**
 * Validate a meal plan to ensure it meets minimum requirements
 * Returns true if valid, false otherwise
 */
export function isValidMealPlan(plan: Partial<MealPlan>): boolean {
  if (!plan) return false;
  
  // Check for required fields
  if (!plan.id) return false;
  if (!plan.name) return false;
  
  // Check for meals array
  if (!Array.isArray(plan.meals)) return false;
  
  return true;
}

/**
 * Convert any workout data to a standardized format
 * This is the main function to use when receiving workout data from any source
 */
export function standardizeWorkoutPlan(data: any): WorkoutPlan | null {
  try {
    // Handle null or undefined
    if (!data) return null;
    
    // Create a normalized plan
    const normalizedPlan = normalizeWorkoutPlan(data);
    
    // Validate the plan
    if (!isValidWorkoutPlan(normalizedPlan)) {
      console.error('Invalid workout plan structure:', data);
      return null;
    }
    
    return normalizedPlan;
  } catch (error) {
    console.error('Error standardizing workout plan:', error);
    return null;
  }
}

/**
 * Convert any meal plan data to a standardized format
 * This is the main function to use when receiving meal plan data from any source
 */
export function standardizeMealPlan(data: any): MealPlan | null {
  try {
    // Handle null or undefined
    if (!data) return null;
    
    // Create a normalized plan
    const normalizedPlan = normalizeMealPlan(data);
    
    // Validate the plan
    if (!isValidMealPlan(normalizedPlan)) {
      console.error('Invalid meal plan structure:', data);
      return null;
    }
    
    return normalizedPlan;
  } catch (error) {
    console.error('Error standardizing meal plan:', error);
    return null;
  }
}
