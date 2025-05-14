/**
 * Validation Utilities
 *
 * This module provides functions for validating data structures before
 * saving them to persistent storage. It ensures data integrity and
 * prevents corrupted data from being saved.
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
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a string field
 */
function validateString(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }

  if (typeof value !== 'string') {
    return `${fieldName} must be a string`;
  }

  if (value.trim() === '') {
    return `${fieldName} cannot be empty`;
  }

  return null;
}

/**
 * Validate an array field
 */
function validateArray(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }

  if (!Array.isArray(value)) {
    return `${fieldName} must be an array`;
  }

  return null;
}

/**
 * Validate an exercise
 */
export function validateExercise(exercise: Partial<Exercise>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const nameError = validateString(exercise?.name, 'Exercise name');
  if (nameError) errors.push(nameError);

  const setsError = validateString(exercise?.sets, 'Sets');
  if (setsError) errors.push(setsError);

  const repsError = validateString(exercise?.reps, 'Reps');
  if (repsError) errors.push(repsError);

  const restError = validateString(exercise?.rest, 'Rest');
  if (restError) errors.push(restError);

  // Optional fields with type checking
  if (exercise?.notes !== undefined && typeof exercise.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  if (exercise?.weight !== undefined && typeof exercise.weight !== 'string') {
    errors.push('Weight must be a string');
  }

  if (exercise?.tempo !== undefined && typeof exercise.tempo !== 'string') {
    errors.push('Tempo must be a string');
  }

  if (exercise?.duration !== undefined && typeof exercise.duration !== 'string') {
    errors.push('Duration must be a string');
  }

  if (exercise?.distance !== undefined && typeof exercise.distance !== 'string') {
    errors.push('Distance must be a string');
  }

  if (exercise?.equipment !== undefined && typeof exercise.equipment !== 'string') {
    errors.push('Equipment must be a string');
  }

  if (exercise?.substitutions !== undefined) {
    if (!Array.isArray(exercise.substitutions)) {
      errors.push('Substitutions must be an array');
    } else {
      for (const sub of exercise.substitutions) {
        if (typeof sub !== 'string') {
          errors.push('Each substitution must be a string');
          break;
        }
      }
    }
  }

  if (exercise?.videoUrl !== undefined && typeof exercise.videoUrl !== 'string') {
    errors.push('Video URL must be a string');
  }

  if (exercise?.imageUrl !== undefined && typeof exercise.imageUrl !== 'string') {
    errors.push('Image URL must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a workout day
 */
export function validateWorkoutDay(day: Partial<WorkoutDay>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const dayError = validateString(day?.day, 'Day');
  if (dayError) errors.push(dayError);

  const focusError = validateString(day?.focus, 'Focus');
  if (focusError) errors.push(focusError);

  const durationError = validateString(day?.duration, 'Duration');
  if (durationError) errors.push(durationError);

  const warmupError = validateString(day?.warmup, 'Warmup');
  if (warmupError) errors.push(warmupError);

  const exercisesError = validateArray(day?.exercises, 'Exercises');
  if (exercisesError) {
    errors.push(exercisesError);
  } else if (Array.isArray(day?.exercises)) {
    // Validate each exercise
    day.exercises.forEach((exercise: Partial<Exercise>, index: number) => {
      const exerciseResult = validateExercise(exercise);
      if (!exerciseResult.valid) {
        exerciseResult.errors.forEach(error => {
          errors.push(`Exercise ${index + 1}: ${error}`);
        });
      }
    });
  }

  const cooldownError = validateString(day?.cooldown, 'Cooldown');
  if (cooldownError) errors.push(cooldownError);

  // Optional fields with type checking
  if (day?.notes !== undefined && typeof day.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  if (day?.completed !== undefined && typeof day.completed !== 'boolean') {
    errors.push('Completed must be a boolean');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a workout plan
 */
export function validateWorkoutPlan(plan: Partial<WorkoutPlan>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const idError = validateString(plan?.id, 'ID');
  if (idError) errors.push(idError);

  const nameError = validateString(plan?.name, 'Name');
  if (nameError) errors.push(nameError);

  const descriptionError = validateString(plan?.description, 'Description');
  if (descriptionError) errors.push(descriptionError);

  // Level must be one of the allowed values
  const validLevels = ['beginner', 'intermediate', 'advanced', 'elite'];
  if (!plan?.level) {
    errors.push('Level is required');
  } else if (!validLevels.includes(plan.level)) {
    errors.push(`Level must be one of: ${validLevels.join(', ')}`);
  }

  // Goals must be an array
  const goalsError = validateArray(plan?.goals, 'Goals');
  if (goalsError) {
    errors.push(goalsError);
  }

  // Equipment must be an array
  const equipmentError = validateArray(plan?.equipment, 'Equipment');
  if (equipmentError) {
    errors.push(equipmentError);
  }

  // Weekly plan must be an array
  const weeklyPlanError = validateArray(plan?.weeklyPlan, 'Weekly plan');
  if (weeklyPlanError) {
    errors.push(weeklyPlanError);
  } else if (Array.isArray(plan?.weeklyPlan)) {
    if (plan.weeklyPlan.length === 0) {
      errors.push('Weekly plan cannot be empty');
    } else {
      // Validate each day
      plan.weeklyPlan.forEach((day: Partial<WorkoutDay>, index: number) => {
        const dayResult = validateWorkoutDay(day);
        if (!dayResult.valid) {
          dayResult.errors.forEach(error => {
            errors.push(`Day ${index + 1}: ${error}`);
          });
        }
      });
    }
  }

  // Optional fields with type checking
  if (plan?.createdAt !== undefined && typeof plan.createdAt !== 'string') {
    errors.push('Created at must be a string');
  }

  if (plan?.updatedAt !== undefined && typeof plan.updatedAt !== 'string') {
    errors.push('Updated at must be a string');
  }

  if (plan?.sport !== undefined && typeof plan.sport !== 'string') {
    errors.push('Sport must be a string');
  }

  if (plan?.author !== undefined && typeof plan.author !== 'string') {
    errors.push('Author must be a string');
  }

  if (plan?.tags !== undefined) {
    if (!Array.isArray(plan.tags)) {
      errors.push('Tags must be an array');
    } else {
      for (const tag of plan.tags) {
        if (typeof tag !== 'string') {
          errors.push('Each tag must be a string');
          break;
        }
      }
    }
  }

  if (plan?.estimatedCalories !== undefined && typeof plan.estimatedCalories !== 'number') {
    errors.push('Estimated calories must be a number');
  }

  if (plan?.targetMuscleGroups !== undefined) {
    if (!Array.isArray(plan.targetMuscleGroups)) {
      errors.push('Target muscle groups must be an array');
    } else {
      for (const muscle of plan.targetMuscleGroups) {
        if (typeof muscle !== 'string') {
          errors.push('Each target muscle group must be a string');
          break;
        }
      }
    }
  }

  if (plan?.notes !== undefined && typeof plan.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a food item
 */
export function validateFood(food: Partial<Food>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const nameError = validateString(food?.name, 'Food name');
  if (nameError) errors.push(nameError);

  const servingSizeError = validateString(food?.servingSize, 'Serving size');
  if (servingSizeError) errors.push(servingSizeError);

  if (food?.calories === undefined || food?.calories === null) {
    errors.push('Calories are required');
  } else if (typeof food.calories !== 'number') {
    errors.push('Calories must be a number');
  }

  if (food?.protein === undefined || food?.protein === null) {
    errors.push('Protein is required');
  } else if (typeof food.protein !== 'number') {
    errors.push('Protein must be a number');
  }

  if (food?.carbs === undefined || food?.carbs === null) {
    errors.push('Carbs are required');
  } else if (typeof food.carbs !== 'number') {
    errors.push('Carbs must be a number');
  }

  if (food?.fat === undefined || food?.fat === null) {
    errors.push('Fat is required');
  } else if (typeof food.fat !== 'number') {
    errors.push('Fat must be a number');
  }

  // Optional fields with type checking
  if (food?.notes !== undefined && typeof food.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a meal
 */
export function validateMeal(meal: Partial<Meal>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const nameError = validateString(meal?.name, 'Meal name');
  if (nameError) errors.push(nameError);

  const timeError = validateString(meal?.time, 'Time');
  if (timeError) errors.push(timeError);

  // Foods must be an array
  const foodsError = validateArray(meal?.foods, 'Foods');
  if (foodsError) {
    errors.push(foodsError);
  } else if (Array.isArray(meal?.foods)) {
    // Validate each food
    meal.foods.forEach((food: Partial<Food>, index: number) => {
      const foodResult = validateFood(food);
      if (!foodResult.valid) {
        foodResult.errors.forEach(error => {
          errors.push(`Food ${index + 1}: ${error}`);
        });
      }
    });
  }

  if (meal?.totalCalories === undefined || meal?.totalCalories === null) {
    errors.push('Total calories are required');
  } else if (typeof meal.totalCalories !== 'number') {
    errors.push('Total calories must be a number');
  }

  if (meal?.totalProtein === undefined || meal?.totalProtein === null) {
    errors.push('Total protein is required');
  } else if (typeof meal.totalProtein !== 'number') {
    errors.push('Total protein must be a number');
  }

  if (meal?.totalCarbs === undefined || meal?.totalCarbs === null) {
    errors.push('Total carbs are required');
  } else if (typeof meal.totalCarbs !== 'number') {
    errors.push('Total carbs must be a number');
  }

  if (meal?.totalFat === undefined || meal?.totalFat === null) {
    errors.push('Total fat is required');
  } else if (typeof meal.totalFat !== 'number') {
    errors.push('Total fat must be a number');
  }

  // Optional fields with type checking
  if (meal?.notes !== undefined && typeof meal.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a daily meal plan
 */
export function validateDailyMealPlan(dailyPlan: Partial<DailyMealPlan>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const dayError = validateString(dailyPlan?.day, 'Day');
  if (dayError) errors.push(dayError);

  // Meals must be an array
  const mealsError = validateArray(dailyPlan?.meals, 'Meals');
  if (mealsError) {
    errors.push(mealsError);
  } else if (Array.isArray(dailyPlan?.meals)) {
    // Validate each meal
    dailyPlan.meals.forEach((meal: Partial<Meal>, index: number) => {
      const mealResult = validateMeal(meal);
      if (!mealResult.valid) {
        mealResult.errors.forEach(error => {
          errors.push(`Meal ${index + 1}: ${error}`);
        });
      }
    });
  }

  if (dailyPlan?.totalCalories === undefined || dailyPlan?.totalCalories === null) {
    errors.push('Total calories are required');
  } else if (typeof dailyPlan.totalCalories !== 'number') {
    errors.push('Total calories must be a number');
  }

  if (dailyPlan?.totalProtein === undefined || dailyPlan?.totalProtein === null) {
    errors.push('Total protein is required');
  } else if (typeof dailyPlan.totalProtein !== 'number') {
    errors.push('Total protein must be a number');
  }

  if (dailyPlan?.totalCarbs === undefined || dailyPlan?.totalCarbs === null) {
    errors.push('Total carbs are required');
  } else if (typeof dailyPlan.totalCarbs !== 'number') {
    errors.push('Total carbs must be a number');
  }

  if (dailyPlan?.totalFat === undefined || dailyPlan?.totalFat === null) {
    errors.push('Total fat is required');
  } else if (typeof dailyPlan.totalFat !== 'number') {
    errors.push('Total fat must be a number');
  }

  // Optional fields with type checking
  if (dailyPlan?.notes !== undefined && typeof dailyPlan.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a meal plan
 */
export function validateMealPlan(plan: Partial<MealPlan>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  const idError = validateString(plan?.id, 'ID');
  if (idError) errors.push(idError);

  const nameError = validateString(plan?.name, 'Name');
  if (nameError) errors.push(nameError);

  const descriptionError = validateString(plan?.description, 'Description');
  if (descriptionError) errors.push(descriptionError);

  // Daily plans must be an array
  const dailyPlansError = validateArray(plan?.dailyPlans, 'Daily plans');
  if (dailyPlansError) {
    errors.push(dailyPlansError);
  } else if (Array.isArray(plan?.dailyPlans)) {
    if (plan.dailyPlans.length === 0) {
      errors.push('Daily plans cannot be empty');
    } else {
      // Validate each daily plan
      plan.dailyPlans.forEach((dailyPlan: Partial<DailyMealPlan>, index: number) => {
        const dailyPlanResult = validateDailyMealPlan(dailyPlan);
        if (!dailyPlanResult.valid) {
          dailyPlanResult.errors.forEach(error => {
            errors.push(`Daily plan ${index + 1}: ${error}`);
          });
        }
      });
    }
  }

  if (plan?.calorieTarget === undefined || plan?.calorieTarget === null) {
    errors.push('Calorie target is required');
  } else if (typeof plan.calorieTarget !== 'number') {
    errors.push('Calorie target must be a number');
  }

  if (!plan?.macroSplit) {
    errors.push('Macro split is required');
  } else if (typeof plan.macroSplit !== 'object') {
    errors.push('Macro split must be an object');
  } else {
    if (plan.macroSplit.protein === undefined || typeof plan.macroSplit.protein !== 'number') {
      errors.push('Protein percentage is required and must be a number');
    }

    if (plan.macroSplit.carbs === undefined || typeof plan.macroSplit.carbs !== 'number') {
      errors.push('Carbs percentage is required and must be a number');
    }

    if (plan.macroSplit.fat === undefined || typeof plan.macroSplit.fat !== 'number') {
      errors.push('Fat percentage is required and must be a number');
    }

    // Check that percentages add up to 100
    const total = (plan.macroSplit.protein || 0) + (plan.macroSplit.carbs || 0) + (plan.macroSplit.fat || 0);
    if (Math.abs(total - 100) > 1) { // Allow for small rounding errors
      errors.push(`Macro split percentages must add up to 100, got ${total}`);
    }
  }

  // Optional fields with type checking
  if (plan?.createdAt !== undefined && typeof plan.createdAt !== 'string') {
    errors.push('Created at must be a string');
  }

  if (plan?.updatedAt !== undefined && typeof plan.updatedAt !== 'string') {
    errors.push('Updated at must be a string');
  }

  if (plan?.notes !== undefined && typeof plan.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate data before saving to IndexedDB
 * @param data The data to validate
 * @param type The type of data being validated
 * @returns Validation result with errors if any
 */
export function validateData(
  data: Partial<WorkoutPlan> | Partial<MealPlan> | null | undefined,
  type: 'workout' | 'meal'
): ValidationResult {
  if (!data) {
    return {
      valid: false,
      errors: ['Data is null or undefined']
    };
  }

  if (type === 'workout') {
    return validateWorkoutPlan(data);
  } else if (type === 'meal') {
    return validateMealPlan(data);
  }

  return {
    valid: false,
    errors: [`Unknown data type: ${type}`]
  };
}
