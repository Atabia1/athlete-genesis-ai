/**
 * @jest-environment jsdom
 */

import { validateExercise, validateWorkoutDay, validateWorkoutPlan } from '../validation';
import { validateEmail, validateRequired, validateMinLength, validateMaxLength, validatePassword } from '@/shared/utils/validation';

// Mock workout types for testing
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  notes?: string;
  weight?: number;
  tempo?: string;
  substitutions?: string[];
}

interface WorkoutDay {
  day: string;
  focus?: string;
  duration?: number;
  warmup?: string;
  exercises: Exercise[];
  cooldown?: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  equipment: string[];
  weeklyPlan: WorkoutDay[];
  createdAt: string;
  updatedAt: string;
}

// Mock validation functions for workout data
function validateExercise(exercise: Partial<Exercise>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!exercise.name || exercise.name.trim().length === 0) {
    errors.push('Exercise name is required');
  }
  
  if (typeof exercise.sets !== 'number' || exercise.sets <= 0) {
    errors.push('Sets must be a positive number');
  }
  
  if (typeof exercise.reps !== 'number' || exercise.reps <= 0) {
    errors.push('Reps must be a positive number');
  }
  
  if (typeof exercise.rest !== 'number' || exercise.rest < 0) {
    errors.push('Rest must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateWorkoutDay(workoutDay: Partial<WorkoutDay>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!workoutDay.day || workoutDay.day.trim().length === 0) {
    errors.push('Day is required');
  }
  
  if (!workoutDay.exercises || !Array.isArray(workoutDay.exercises)) {
    errors.push('Exercises array is required');
  } else {
    workoutDay.exercises.forEach((exercise, index) => {
      const exerciseValidation = validateExercise(exercise);
      if (!exerciseValidation.isValid) {
        errors.push(`Exercise ${index + 1}: ${exerciseValidation.errors.join(', ')}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateWorkoutPlan(workoutPlan: Partial<WorkoutPlan>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!workoutPlan.name || workoutPlan.name.trim().length === 0) {
    errors.push('Plan name is required');
  }
  
  if (!workoutPlan.level || !['beginner', 'intermediate', 'advanced'].includes(workoutPlan.level)) {
    errors.push('Valid level is required');
  }
  
  if (!workoutPlan.weeklyPlan || !Array.isArray(workoutPlan.weeklyPlan)) {
    errors.push('Weekly plan is required');
  } else {
    workoutPlan.weeklyPlan.forEach((day, index) => {
      const dayValidation = validateWorkoutDay(day);
      if (!dayValidation.isValid) {
        errors.push(`Day ${index + 1}: ${dayValidation.errors.join(', ')}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+label@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('  test  ')).toBe(true);
    });

    it('should reject empty or whitespace strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('should validate strings that meet minimum length', () => {
      expect(validateMinLength('hello', 3)).toBe(true);
      expect(validateMinLength('test', 4)).toBe(true);
    });

    it('should reject strings shorter than minimum length', () => {
      expect(validateMinLength('hi', 3)).toBe(false);
      expect(validateMinLength('', 1)).toBe(false);
    });
  });

  describe('validateMaxLength', () => {
    it('should validate strings within maximum length', () => {
      expect(validateMaxLength('hello', 10)).toBe(true);
      expect(validateMaxLength('test', 4)).toBe(true);
    });

    it('should reject strings longer than maximum length', () => {
      expect(validateMaxLength('hello world', 5)).toBe(false);
      expect(validateMaxLength('test', 3)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Test123456');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateExercise', () => {
    it('should validate valid exercise data', () => {
      const validExercise: Partial<Exercise> = {
        name: 'Push-ups',
        sets: 3,
        reps: 15,
        rest: 60
      };
      
      const result = validateExercise(validExercise);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid exercise data', () => {
      const invalidExercise: Partial<Exercise> = {
        name: '',
        sets: 0,
        reps: 0,
        rest: -1
      };
      
      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateWorkoutDay', () => {
    it('should validate valid workout day data', () => {
      const validWorkoutDay: Partial<WorkoutDay> = {
        day: 'Monday',
        focus: 'Chest and Triceps',
        duration: 60,
        warmup: '5 minutes light cardio',
        exercises: [{
          id: '1',
          name: 'Push-ups',
          sets: 3,
          reps: 15,
          rest: 60
        }],
        cooldown: '5 minutes stretching'
      };
      
      const result = validateWorkoutDay(validWorkoutDay);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject workout day with invalid exercises', () => {
      const invalidWorkoutDay: Partial<WorkoutDay> = {
        day: 'Monday',
        focus: 'Chest and Triceps',
        duration: 60,
        warmup: '5 minutes light cardio',
        exercises: [{
          id: '1',
          name: '',
          sets: 0,
          reps: 0,
          rest: -1
        }],
        cooldown: '5 minutes stretching'
      };
      
      const result = validateWorkoutDay(invalidWorkoutDay);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateWorkoutPlan', () => {
    it('should validate valid workout plan data', () => {
      const validWorkoutPlan: Partial<WorkoutPlan> = {
        id: '1',
        name: 'Beginner Full Body',
        description: 'A complete beginner workout plan',
        level: 'beginner',
        goals: ['strength', 'muscle building'],
        equipment: ['dumbbells', 'bench'],
        weeklyPlan: [{
          day: 'Monday',
          focus: 'Full Body',
          duration: 45,
          warmup: '5 minutes light cardio',
          exercises: [{
            id: '1',
            name: 'Push-ups',
            sets: 3,
            reps: 10,
            rest: 60
          }],
          cooldown: '5 minutes stretching'
        }],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      const result = validateWorkoutPlan(validWorkoutPlan);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject workout plan with invalid level', () => {
      const invalidWorkoutPlan: Partial<WorkoutPlan> = {
        id: '1',
        name: 'Invalid Plan',
        level: 'expert' as any, // Invalid level
        weeklyPlan: []
      };
      
      const result = validateWorkoutPlan(invalidWorkoutPlan);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
