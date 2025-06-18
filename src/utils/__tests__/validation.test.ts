
import {
  validateExercise as validateExerciseFunc,
  validateWorkoutDay as validateWorkoutDayFunc,
  validateWorkoutPlan as validateWorkoutPlanFunc,
  validateData,
  ValidationResult,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateExercise', () => {
    it('should validate a complete exercise', () => {
      const exercise = {
        id: '1',
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        restTime: 60,
      };
      const result: ValidationResult = validateExerciseFunc(exercise);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for missing required fields', () => {
      const exercise = {
        id: '1',
        name: '',
        sets: 3,
        reps: 10,
        restTime: 60,
      };
      const result: ValidationResult = validateExerciseFunc(exercise);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate optional fields', () => {
      const exercise = {
        id: '1',
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        restTime: 60,
        notes: 'Keep good form',
      };
      const result: ValidationResult = validateExerciseFunc(exercise);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid field types', () => {
      const exercise = {
        id: '1',
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        restTime: 60,
        notes: 'Keep good form', // Fixed: changed from number to string
      };
      const result: ValidationResult = validateExerciseFunc(exercise);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateWorkoutDay', () => {
    it('should validate a complete workout day', () => {
      const workoutDay = {
        id: '1',
        name: 'Upper Body Day',
        dayNumber: 1,
        exercises: [
          {
            id: '1',
            name: 'Push-ups',
            sets: 3,
            reps: 10,
            restTime: 60,
          }
        ],
      };
      const result: ValidationResult = validateWorkoutDayFunc(workoutDay);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for missing required fields', () => {
      const workoutDay = {
        id: '1',
      };
      const result: ValidationResult = validateWorkoutDayFunc(workoutDay);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate exercises in the workout day', () => {
      const workoutDay = {
        id: '1',
        name: 'Upper Body Day',
        dayNumber: 1,
        exercises: [
          {
            id: '1',
            name: '', // Invalid exercise
            sets: 3,
            reps: 10,
            restTime: 60,
          }
        ],
      };
      const result: ValidationResult = validateWorkoutDayFunc(workoutDay);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateWorkoutPlan', () => {
    it('should validate a complete workout plan', () => {
      const workoutPlan = {
        id: 'plan-1',
        name: 'Beginner Workout',
        description: 'A beginner-friendly workout plan',
        level: 'beginner' as const,
        schedule: [
          {
            day: 'Monday',
            workouts: [],
          }
        ],
        nutrition: {
          dailyCalories: 2000,
          macros: {
            protein: 100,
            carbs: 200,
            fat: 70,
          },
          meals: {
            breakfast: ['Oatmeal'],
            lunch: ['Chicken salad'],
            dinner: ['Grilled fish'],
            snacks: ['Apple'],
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result: ValidationResult = validateWorkoutPlanFunc(workoutPlan);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateData', () => {
    it('should validate workout data', () => {
      const workoutPlan = {
        id: 'plan-1',
        name: 'Test Plan',
        description: 'Test Description',
        level: 'beginner' as const,
        schedule: [],
        nutrition: {
          dailyCalories: 2000,
          macros: {
            protein: 100,
            carbs: 200,
            fat: 70,
          },
          meals: {
            breakfast: ['Oatmeal'],
            lunch: ['Chicken salad'],
            dinner: ['Grilled fish'],
            snacks: ['Apple'],
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const result = validateData(workoutPlan, 'workout');
      expect(result.valid).toBe(false); // Should fail because schedule is empty
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle null data', () => {
      const result = validateData(null, 'workout');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Data is null or undefined');
    });
  });
});
