/**
 * Workout Normalizer: Utilities for normalizing workout data structures
 * 
 * This module provides functions to ensure that all workout data follows a consistent
 * structure, regardless of its source (AI-generated, pre-defined templates, or user-created).
 * It handles missing fields, type conversions, and structure validation.
 */

import { 
  WorkoutPlan, 
  WorkoutDay, 
  Exercise, 
  MealPlan,
  DailyMealPlan,
  Meal,
  Food
} from '@/types/workout';
import { ExperienceLevel, FitnessGoal, EquipmentOption } from '@/context/PlanContext';

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
    name: exercise.name || 'Unnamed Exercise',
    sets: exercise.sets || '3',
    reps: exercise.reps || '10',
    rest: exercise.rest || '60s',
    notes: exercise.notes || undefined,
    weight: exercise.weight || undefined,
    tempo: exercise.tempo || undefined,
    duration: exercise.duration || undefined,
    distance: exercise.distance || undefined,
    equipment: exercise.equipment || undefined,
    substitutions: exercise.substitutions || undefined,
    videoUrl: exercise.videoUrl || undefined,
    imageUrl: exercise.imageUrl || undefined,
  };
}

/**
 * Normalize a workout day to ensure it has all required fields
 */
export function normalizeWorkoutDay(day: Partial<WorkoutDay>): WorkoutDay {
  return {
    day: day.day || 'Day 1',
    focus: day.focus || 'Full Body',
    duration: day.duration || '45-60 min',
    warmup: day.warmup || 'Light cardio for 5-10 minutes',
    exercises: Array.isArray(day.exercises) 
      ? day.exercises.map(normalizeExercise) 
      : [],
    cooldown: day.cooldown || 'Stretching for 5-10 minutes',
    notes: day.notes || undefined,
    completed: day.completed || false,
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
    level: (plan.level as ExperienceLevel) || DEFAULT_VALUES.level,
    goals: Array.isArray(plan.goals) 
      ? plan.goals.filter(goal => typeof goal === 'string') as FitnessGoal[]
      : DEFAULT_VALUES.goals,
    equipment: Array.isArray(plan.equipment) 
      ? plan.equipment.filter(equip => typeof equip === 'string') as EquipmentOption[]
      : DEFAULT_VALUES.equipment,
    weeklyPlan: Array.isArray(plan.weeklyPlan) 
      ? plan.weeklyPlan.map(normalizeWorkoutDay) 
      : [],
    createdAt: plan.createdAt || DEFAULT_VALUES.createdAt,
    updatedAt: plan.updatedAt || DEFAULT_VALUES.updatedAt,
    sport: plan.sport || undefined,
    author: plan.author || undefined,
    tags: Array.isArray(plan.tags) ? plan.tags : undefined,
    estimatedCalories: typeof plan.estimatedCalories === 'number' ? plan.estimatedCalories : undefined,
    targetMuscleGroups: Array.isArray(plan.targetMuscleGroups) ? plan.targetMuscleGroups : undefined,
    notes: plan.notes || undefined,
  };
}

/**
 * Normalize a food item to ensure it has all required fields
 */
export function normalizeFood(food: Partial<Food>): Food {
  return {
    name: food.name || 'Unnamed Food',
    servingSize: food.servingSize || '1 serving',
    calories: typeof food.calories === 'number' ? food.calories : 0,
    protein: typeof food.protein === 'number' ? food.protein : 0,
    carbs: typeof food.carbs === 'number' ? food.carbs : 0,
    fat: typeof food.fat === 'number' ? food.fat : 0,
    notes: food.notes || undefined,
  };
}

/**
 * Normalize a meal to ensure it has all required fields
 */
export function normalizeMeal(meal: Partial<Meal>): Meal {
  const normalizedFoods = Array.isArray(meal.foods) 
    ? meal.foods.map(normalizeFood) 
    : [];
  
  // Calculate totals if not provided
  const totalCalories = typeof meal.totalCalories === 'number' 
    ? meal.totalCalories 
    : normalizedFoods.reduce((sum, food) => sum + food.calories, 0);
  
  const totalProtein = typeof meal.totalProtein === 'number' 
    ? meal.totalProtein 
    : normalizedFoods.reduce((sum, food) => sum + food.protein, 0);
  
  const totalCarbs = typeof meal.totalCarbs === 'number' 
    ? meal.totalCarbs 
    : normalizedFoods.reduce((sum, food) => sum + food.carbs, 0);
  
  const totalFat = typeof meal.totalFat === 'number' 
    ? meal.totalFat 
    : normalizedFoods.reduce((sum, food) => sum + food.fat, 0);
  
  return {
    name: meal.name || 'Unnamed Meal',
    time: meal.time || '',
    foods: normalizedFoods,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    notes: meal.notes || undefined,
  };
}

/**
 * Normalize a daily meal plan to ensure it has all required fields
 */
export function normalizeDailyMealPlan(dailyPlan: Partial<DailyMealPlan>): DailyMealPlan {
  const normalizedMeals = Array.isArray(dailyPlan.meals) 
    ? dailyPlan.meals.map(normalizeMeal) 
    : [];
  
  // Calculate totals if not provided
  const totalCalories = typeof dailyPlan.totalCalories === 'number' 
    ? dailyPlan.totalCalories 
    : normalizedMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  
  const totalProtein = typeof dailyPlan.totalProtein === 'number' 
    ? dailyPlan.totalProtein 
    : normalizedMeals.reduce((sum, meal) => sum + meal.totalProtein, 0);
  
  const totalCarbs = typeof dailyPlan.totalCarbs === 'number' 
    ? dailyPlan.totalCarbs 
    : normalizedMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
  
  const totalFat = typeof dailyPlan.totalFat === 'number' 
    ? dailyPlan.totalFat 
    : normalizedMeals.reduce((sum, meal) => sum + meal.totalFat, 0);
  
  return {
    day: dailyPlan.day || 'Day 1',
    meals: normalizedMeals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    notes: dailyPlan.notes || undefined,
  };
}

/**
 * Normalize a meal plan to ensure it has all required fields
 */
export function normalizeMealPlan(plan: Partial<MealPlan>): MealPlan {
  // Generate a unique ID if none exists
  const id = plan.id || `meal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  const normalizedDailyPlans = Array.isArray(plan.dailyPlans) 
    ? plan.dailyPlans.map(normalizeDailyMealPlan) 
    : [];
  
  return {
    id,
    name: plan.name || 'Unnamed Meal Plan',
    description: plan.description || 'No description provided',
    dailyPlans: normalizedDailyPlans,
    calorieTarget: typeof plan.calorieTarget === 'number' ? plan.calorieTarget : 2000,
    macroSplit: plan.macroSplit || { protein: 30, carbs: 40, fat: 30 },
    createdAt: plan.createdAt || DEFAULT_VALUES.createdAt,
    updatedAt: plan.updatedAt || DEFAULT_VALUES.updatedAt,
    notes: plan.notes || undefined,
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
  
  // Check for weeklyPlan array
  if (!Array.isArray(plan.weeklyPlan) || plan.weeklyPlan.length === 0) return false;
  
  // Check each day has at least one exercise
  for (const day of plan.weeklyPlan) {
    if (!Array.isArray(day.exercises) || day.exercises.length === 0) {
      return false;
    }
  }
  
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
  
  // Check for dailyPlans array
  if (!Array.isArray(plan.dailyPlans) || plan.dailyPlans.length === 0) return false;
  
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
