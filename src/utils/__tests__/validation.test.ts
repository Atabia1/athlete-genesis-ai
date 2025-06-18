
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
        rest: 60,
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
        rest: 60,
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
        rest: 60,
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
        rest: 60,
        notes: 123, // Invalid type
      };
      const result: ValidationResult = validateExerciseFunc(exercise);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateWorkoutDay', () => {
    it('should validate a complete workout day', () => {
      const workoutDay = {
        id: '1',
        day: 'Monday',
        focus: 'Upper body',
        duration: '45 minutes',
        warmup: '5 minutes light cardio',
        exercises: [
          {
            id: '1',
            name: 'Push-ups',
            sets: 3,
            reps: 10,
            rest: 60,
          }
        ],
        cooldown: '5 minutes stretching',
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
        day: 'Monday',
        focus: 'Upper body',
        duration: '45 minutes',
        warmup: '5 minutes light cardio',
        exercises: [
          {
            id: '1',
            name: '', // Invalid exercise
            sets: 3,
            reps: 10,
            rest: 60,
          }
        ],
        cooldown: '5 minutes stretching',
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
        goals: ['strength', 'endurance'],
        equipment: ['bodyweight'],
        weeklyPlan: [
          {
            id: '1',
            day: 'Monday',
            focus: 'Upper body',
            duration: '45 minutes',
            warmup: '5 minutes light cardio',
            exercises: [
              {
                id: '1',
                name: 'Push-ups',
                sets: 3,
                reps: 10,
                rest: 60,
              }
            ],
            cooldown: '5 minutes stretching',
          }
        ],
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
        goals: ['strength'],
        equipment: ['bodyweight'],
        weeklyPlan: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const result = validateData(workoutPlan, 'workout');
      expect(result.valid).toBe(false); // Should fail because weeklyPlan is empty
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle null data', () => {
      const result = validateData(null, 'workout');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Data is null or undefined');
    });
  });
});
