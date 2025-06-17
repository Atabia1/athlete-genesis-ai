
/**
 * Workout Types
 * 
 * This file defines the types for workout data used throughout the application.
 */

// Basic exercise type
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  videoUrl?: string;
  imageUrl?: string;
  notes?: string;
}

// Workout day type
export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  dayNumber: number;
  isRestDay?: boolean;
}

// Workout schedule type
export interface WorkoutSchedule {
  day: string;
  workouts: Workout[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    };
  };
}

// Workout plan type
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  days?: WorkoutDay[];
  schedule: WorkoutSchedule[];
  author?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  goal?: WorkoutGoal;
  equipment?: string[];
  isTemplate?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  category?: string;
  tags?: string[];
  nutrition: {
    dailyCalories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    meals: {
      breakfast: string[];
      lunch: string[];
      dinner: string[];
      snacks: string[];
    };
  };
}

// Meal plan types
export interface Meal {
  type: string;
  title: string;
  description: string;
  nutrients: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface MealPlanDay {
  dayNumber: number;
  meals: Meal[];
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  days: MealPlanDay[];
}

// Workout goal enum
export enum WorkoutGoal {
  STRENGTH = 'strength',
  HYPERTROPHY = 'hypertrophy',
  ENDURANCE = 'endurance',
  WEIGHT_LOSS = 'weight_loss',
  GENERAL_FITNESS = 'general_fitness',
  SPORT_SPECIFIC = 'sport_specific'
}

// Workout progress type
export interface WorkoutProgress {
  id: string;
  workoutPlanId: string;
  userId: string;
  currentDay: number;
  completedExercises: string[];
  completedDays: string[];
  startDate: string | Date;
  lastActive: string | Date;
  completed: boolean;
  completionDate?: string | Date;
}

// Workout type (individual workout session)
export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  duration?: number;
  caloriesBurned?: number;
  date: string | Date;
  userId?: string;
  notes?: string;
  rating?: number; // User's rating of the workout (1-5)
  fromPlanId?: string; // Reference to workout plan if part of one
  title?: string; // Alternative name field used in some components
  type?: string; // Workout type (e.g., 'strength', 'cardio', etc.)
  goals?: WorkoutGoal[]; // Goals associated with this workout
}

// Exercise log for tracking individual exercise performance
export interface ExerciseLog {
  id: string;
  exerciseId: string;
  workoutId: string;
  userId: string;
  sets: {
    weight?: number;
    reps?: number;
    duration?: number;
    distance?: number;
    completed: boolean;
  }[];
  date: string | Date;
  notes?: string;
  difficulty?: number; // Perceived difficulty (1-10)
}

// Workout record for historical tracking
export interface WorkoutRecord {
  id: string;
  userId: string;
  date: string | Date;
  totalWorkouts: number;
  totalDuration: number;
  totalCaloriesBurned: number;
  longestStreak: number;
  currentStreak: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
}
