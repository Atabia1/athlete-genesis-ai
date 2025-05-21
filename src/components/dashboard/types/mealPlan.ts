
export interface MealItem {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  serving: string;
}

export interface Meal {
  type: string;
  time: string;
  items: MealItem[];
}

export interface MacroBreakdown {
  protein: string;
  carbs: string;
  fat: string;
}

export interface MealPlan {
  meals: Meal[];
  dailyCalories: string;
  macroBreakdown: MacroBreakdown;
  hydrationGuidelines: string;
  supplementRecommendations?: string;
}
