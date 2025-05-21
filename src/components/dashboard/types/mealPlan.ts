
/**
 * Meal Plan Type Definitions
 * 
 * These types define the structure of meal plans in the application.
 */

/**
 * Food item in a meal
 */
interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

/**
 * Single meal data
 */
interface Meal {
  type: string; // e.g., "Breakfast", "Lunch", "Dinner", "Snack"
  time: string; // e.g., "7:30 AM"
  items: MealItem[];
}

/**
 * Macro nutrient breakdown
 */
interface MacroBreakdown {
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
}

/**
 * Complete meal plan
 */
interface MealPlan {
  meals: Meal[];
  dailyCalories: number;
  macroBreakdown: MacroBreakdown;
  hydrationGuidelines: string;
  supplementRecommendations?: string;
}

export type {
  MealPlan,
  Meal,
  MealItem,
  MacroBreakdown
};
