/**
 * Workout Types: Comprehensive type definitions for workout-related data structures
 * 
 * This file contains TypeScript interfaces and types for all workout-related data,
 * ensuring type safety throughout the application. These types are used by both
 * the plan generation system and the offline storage functionality.
 */

import { ExperienceLevel, FitnessGoal, EquipmentOption } from '@/context/PlanContext';

/**
 * Exercise: Represents a single exercise within a workout
 */
export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
  weight?: string;
  tempo?: string;
  duration?: string;
  distance?: string;
  equipment?: string;
  substitutions?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

/**
 * Set: Represents a single set of an exercise with tracking data
 */
export interface ExerciseSet {
  weight: string;
  reps: string;
  rpe: number;
  completed?: boolean;
  notes?: string;
}

/**
 * ExerciseLog: Represents logged data for a completed exercise
 */
export interface ExerciseLog {
  name: string;
  sets: ExerciseSet[];
  notes: string;
  skipped: boolean;
}

/**
 * WorkoutDay: Represents a single day in a workout plan
 */
export interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  warmup: string;
  exercises: Exercise[];
  cooldown: string;
  notes?: string;
  completed?: boolean;
}

/**
 * WorkoutPlan: Represents a complete workout plan
 */
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: ExperienceLevel;
  goals: FitnessGoal[];
  equipment: EquipmentOption[];
  weeklyPlan: WorkoutDay[];
  createdAt?: string;
  updatedAt?: string;
  sport?: string;
  author?: string;
  tags?: string[];
  estimatedCalories?: number;
  targetMuscleGroups?: string[];
  notes?: string;
}

/**
 * WorkoutSession: Represents a logged workout session
 */
export interface WorkoutSession {
  id: string;
  date: string;
  workoutPlanId: string;
  duration: number; // in minutes
  exercises: ExerciseLog[];
  notes?: string;
  rating?: number; // 1-5 rating
  energyLevel?: number; // 1-10 rating
  completedExercises: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * MealPlan: Represents a complete meal plan
 */
export interface MealPlan {
  id: string;
  name: string;
  description: string;
  dailyPlans: DailyMealPlan[];
  calorieTarget: number;
  macroSplit: {
    protein: number; // percentage
    carbs: number; // percentage
    fat: number; // percentage
  };
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

/**
 * DailyMealPlan: Represents a single day in a meal plan
 */
export interface DailyMealPlan {
  day: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number; // in grams
  totalCarbs: number; // in grams
  totalFat: number; // in grams
  notes?: string;
}

/**
 * Meal: Represents a single meal in a daily meal plan
 */
export interface Meal {
  name: string;
  time: string;
  foods: Food[];
  totalCalories: number;
  totalProtein: number; // in grams
  totalCarbs: number; // in grams
  totalFat: number; // in grams
  notes?: string;
}

/**
 * Food: Represents a single food item in a meal
 */
export interface Food {
  name: string;
  servingSize: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  notes?: string;
}

/**
 * TrainingPlan: Represents a higher-level training plan that may contain multiple workout plans
 */
export interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  sport?: string;
  level: ExperienceLevel;
  duration: string; // e.g., "6 weeks"
  sessions: number; // sessions per week
  type: 'individual' | 'team';
  created: string;
  updated?: string;
  assignments?: number;
  completion?: number;
  tags?: string[];
  workoutPlans?: WorkoutPlan[];
}
