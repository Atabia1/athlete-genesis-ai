
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
} from '@/types/workout';

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
 * Validate a number field
 */
function validateNumber(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }

  if (typeof value !== 'number') {
    return `${fieldName} must be a number`;
  }

  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
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

  const setsError = validateNumber(exercise?.sets, 'Sets');
  if (setsError) errors.push(setsError);

  const repsError = validateNumber(exercise?.reps, 'Reps');
  if (repsError) errors.push(repsError);

  // Optional fields with type checking
  if (exercise?.restTime !== undefined) {
    const restTimeError = validateNumber(exercise.restTime, 'Rest time');
    if (restTimeError) errors.push(restTimeError);
  }

  if (exercise?.notes !== undefined && typeof exercise.notes !== 'string') {
    errors.push('Notes must be a string');
  }

  if (exercise?.duration !== undefined) {
    const durationError = validateNumber(exercise.duration, 'Duration');
    if (durationError) errors.push(durationError);
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
  const nameError = validateString(day?.name, 'Workout day name');
  if (nameError) errors.push(nameError);

  const dayNumberError = validateNumber(day?.dayNumber, 'Day number');
  if (dayNumberError) errors.push(dayNumberError);

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

  // Level must be one of the allowed values
  const validLevels = ['beginner', 'intermediate', 'advanced'];
  if (!plan?.level) {
    errors.push('Level is required');
  } else if (!validLevels.includes(plan.level)) {
    errors.push(`Level must be one of: ${validLevels.join(', ')}`);
  }

  // Schedule must be an array
  const scheduleError = validateArray(plan?.schedule, 'Schedule');
  if (scheduleError) {
    errors.push(scheduleError);
  } else if (Array.isArray(plan?.schedule)) {
    if (plan.schedule.length === 0) {
      errors.push('Schedule cannot be empty');
    }
  }

  // Validate nutrition object
  if (!plan?.nutrition) {
    errors.push('Nutrition plan is required');
  } else {
    const nutrition = plan.nutrition;
    
    const caloriesError = validateNumber(nutrition.dailyCalories, 'Daily calories');
    if (caloriesError) errors.push(caloriesError);

    if (!nutrition.macros) {
      errors.push('Macros are required');
    } else {
      const proteinError = validateNumber(nutrition.macros.protein, 'Protein');
      if (proteinError) errors.push(proteinError);

      const carbsError = validateNumber(nutrition.macros.carbs, 'Carbs');
      if (carbsError) errors.push(carbsError);

      const fatError = validateNumber(nutrition.macros.fat, 'Fat');
      if (fatError) errors.push(fatError);
    }

    if (!nutrition.meals) {
      errors.push('Meals are required');
    }
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
  data: Partial<WorkoutPlan> | null | undefined,
  type: 'workout'
): ValidationResult {
  if (!data) {
    return {
      valid: false,
      errors: ['Data is null or undefined']
    };
  }

  if (type === 'workout') {
    return validateWorkoutPlan(data);
  }

  return {
    valid: false,
    errors: [`Unknown data type: ${type}`]
  };
}
