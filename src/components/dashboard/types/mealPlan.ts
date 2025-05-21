
/**
 * MealPlan Types
 * 
 * Type definitions for the meal plan functionality
 */

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

export interface Meal {
  type: string;
  time: string;
  items: MealItem[];
  notes?: string;
}

export interface MealPlan {
  id: string;
  title: string;
  description?: string;
  dailyCalories: number;
  macroBreakdown: MacroBreakdown;
  meals: Meal[];
  hydrationGuidelines: string;
  supplementRecommendations?: string[];
}
