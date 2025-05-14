/**
 * Workout Types
 * 
 * This file defines the types for workouts, exercises, meal plans, and related entities.
 */

/**
 * Workout plan type
 */
export interface WorkoutPlan {
  /** Unique identifier */
  id: string;
  
  /** Workout name */
  name: string;
  
  /** Workout description */
  description: string;
  
  /** User ID who owns the workout */
  userId: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Workout type (e.g., strength, cardio, hiit) */
  type: WorkoutType;
  
  /** Workout difficulty level */
  difficulty: DifficultyLevel;
  
  /** Workout duration in minutes */
  duration: number;
  
  /** Workout goal (e.g., weight loss, muscle gain) */
  goal: WorkoutGoal;
  
  /** List of exercises in the workout */
  exercises: Exercise[];
  
  /** Tags for categorizing the workout */
  tags: string[];
  
  /** Workout status (e.g., active, archived) */
  status: WorkoutStatus;
  
  /** Source of the workout (e.g., user, ai, template) */
  source: WorkoutSource;
}

/**
 * Exercise type
 */
export interface Exercise {
  /** Unique identifier */
  id: string;
  
  /** Exercise name */
  name: string;
  
  /** Exercise description */
  description: string;
  
  /** Number of sets */
  sets: number;
  
  /** Number of repetitions per set */
  reps: number;
  
  /** Rest period between sets in seconds */
  rest: number;
  
  /** Weight used for the exercise */
  weight: number;
  
  /** Weight unit (e.g., kg, lb) */
  unit: WeightUnit;
  
  /** Exercise type (e.g., strength, cardio) */
  type: ExerciseType;
  
  /** Primary muscle group targeted */
  muscleGroup: MuscleGroup;
  
  /** Exercise difficulty level */
  difficulty: DifficultyLevel;
  
  /** Order in the workout */
  order: number;
  
  /** Additional notes */
  notes: string;
}

/**
 * Meal plan type
 */
export interface MealPlan {
  /** Unique identifier */
  id: string;
  
  /** Meal plan name */
  name: string;
  
  /** Meal plan description */
  description: string;
  
  /** User ID who owns the meal plan */
  userId: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Meal plan type (e.g., keto, vegan) */
  type: MealPlanType;
  
  /** Meal plan goal (e.g., weight loss, muscle gain) */
  goal: MealPlanGoal;
  
  /** List of meals in the plan */
  meals: Meal[];
  
  /** Tags for categorizing the meal plan */
  tags: string[];
  
  /** Meal plan status (e.g., active, archived) */
  status: MealPlanStatus;
  
  /** Source of the meal plan (e.g., user, ai, template) */
  source: MealPlanSource;
}

/**
 * Meal type
 */
export interface Meal {
  /** Unique identifier */
  id: string;
  
  /** Meal name */
  name: string;
  
  /** Meal description */
  description: string;
  
  /** Meal type (e.g., breakfast, lunch) */
  type: MealType;
  
  /** Calories in the meal */
  calories: number;
  
  /** Protein content in grams */
  protein: number;
  
  /** Carbohydrate content in grams */
  carbs: number;
  
  /** Fat content in grams */
  fat: number;
  
  /** List of ingredients */
  ingredients: string[];
  
  /** Preparation instructions */
  instructions: string[];
  
  /** Order in the meal plan */
  order: number;
  
  /** Additional notes */
  notes: string;
}

/**
 * Workout type enum
 */
export type WorkoutType = 
  | 'strength' 
  | 'cardio' 
  | 'hiit' 
  | 'flexibility' 
  | 'balance' 
  | 'circuit' 
  | 'custom';

/**
 * Difficulty level enum
 */
export type DifficultyLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced' 
  | 'expert';

/**
 * Workout goal enum
 */
export type WorkoutGoal = 
  | 'weight_loss' 
  | 'muscle_gain' 
  | 'endurance' 
  | 'strength' 
  | 'flexibility' 
  | 'general';

/**
 * Workout status enum
 */
export type WorkoutStatus = 
  | 'active' 
  | 'archived' 
  | 'draft';

/**
 * Workout source enum
 */
export type WorkoutSource = 
  | 'user' 
  | 'ai' 
  | 'template' 
  | 'coach';

/**
 * Weight unit enum
 */
export type WeightUnit = 
  | 'kg' 
  | 'lb';

/**
 * Exercise type enum
 */
export type ExerciseType = 
  | 'strength' 
  | 'cardio' 
  | 'flexibility' 
  | 'balance' 
  | 'plyometric';

/**
 * Muscle group enum
 */
export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'arms' 
  | 'legs' 
  | 'core' 
  | 'full_body';

/**
 * Meal plan type enum
 */
export type MealPlanType = 
  | 'keto' 
  | 'vegan' 
  | 'vegetarian' 
  | 'paleo' 
  | 'mediterranean' 
  | 'custom';

/**
 * Meal plan goal enum
 */
export type MealPlanGoal = 
  | 'weight_loss' 
  | 'muscle_gain' 
  | 'maintenance' 
  | 'performance' 
  | 'general';

/**
 * Meal plan status enum
 */
export type MealPlanStatus = 
  | 'active' 
  | 'archived' 
  | 'draft';

/**
 * Meal plan source enum
 */
export type MealPlanSource = 
  | 'user' 
  | 'ai' 
  | 'template' 
  | 'coach';

/**
 * Meal type enum
 */
export type MealType = 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner' 
  | 'snack';
