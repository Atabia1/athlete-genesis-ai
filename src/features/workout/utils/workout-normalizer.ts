import { 
  WorkoutPlan, 
  Exercise, 
  MealPlan,
  Meal,
} from '@/shared/types/workout';

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

export function normalizeWorkoutPlan(plan: Partial<WorkoutPlan>): WorkoutPlan {
  const id = plan.id || `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id,
    name: plan.name || 'Unnamed Workout Plan',
    description: plan.description || 'No description provided',
    userId: plan.userId || '',
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString(),
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

export function normalizeMealPlan(plan: Partial<MealPlan>): MealPlan {
  // Generate a unique ID if none exists
  const id = plan.id || `meal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id,
    name: plan.name || 'Unnamed Meal Plan',
    description: plan.description || 'No description provided',
    userId: plan.userId || '',
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString(),
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

export function standardizeWorkoutPlan(data: any): WorkoutPlan | null {
  try {
    if (!data) return null;
    
    const normalizedPlan = normalizeWorkoutPlan(data);
    
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

function isValidWorkoutPlan(plan: Partial<WorkoutPlan>): boolean {
  if (!plan) return false;
  if (!plan.id) return false;
  if (!plan.name) return false;
  if (!Array.isArray(plan.exercises)) return false;
  
  return true;
}
