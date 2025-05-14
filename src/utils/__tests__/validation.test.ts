/**
 * Tests for the validation utility
 */

import { 
  validateExercise, 
  validateWorkoutDay, 
  validateWorkoutPlan,
  validateData
} from '../validation';

describe('Validation Utility', () => {
  describe('validateExercise', () => {
    it('should validate a valid exercise', () => {
      const exercise = {
        name: 'Push-ups',
        sets: '3',
        reps: '10',
        rest: '60s'
      };
      
      const result = validateExercise(exercise);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject an exercise with missing required fields', () => {
      const exercise = {
        name: 'Push-ups',
        // Missing sets, reps, rest
      };
      
      const result = validateExercise(exercise);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Sets is required');
      expect(result.errors).toContain('Reps is required');
      expect(result.errors).toContain('Rest is required');
    });
    
    it('should validate an exercise with optional fields', () => {
      const exercise = {
        name: 'Push-ups',
        sets: '3',
        reps: '10',
        rest: '60s',
        notes: 'Keep elbows tucked',
        weight: '10kg',
        tempo: '2-0-2',
        substitutions: ['Knee push-ups', 'Incline push-ups']
      };
      
      const result = validateExercise(exercise);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject an exercise with incorrect field types', () => {
      const exercise = {
        name: 'Push-ups',
        sets: 3, // Should be string
        reps: '10',
        rest: '60s',
        notes: 123 // Should be string
      };
      
      const result = validateExercise(exercise);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Sets must be a string');
      expect(result.errors).toContain('Notes must be a string');
    });
  });
  
  describe('validateWorkoutDay', () => {
    it('should validate a valid workout day', () => {
      const day = {
        day: 'Day 1',
        focus: 'Upper Body',
        duration: '45 min',
        warmup: 'Light cardio for 5 minutes',
        exercises: [
          {
            name: 'Push-ups',
            sets: '3',
            reps: '10',
            rest: '60s'
          },
          {
            name: 'Pull-ups',
            sets: '3',
            reps: '8',
            rest: '90s'
          }
        ],
        cooldown: 'Stretching for 5 minutes'
      };
      
      const result = validateWorkoutDay(day);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject a workout day with missing required fields', () => {
      const day = {
        day: 'Day 1',
        // Missing focus, duration, warmup, exercises, cooldown
      };
      
      const result = validateWorkoutDay(day);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Focus is required');
      expect(result.errors).toContain('Duration is required');
      expect(result.errors).toContain('Warmup is required');
      expect(result.errors).toContain('Exercises is required');
      expect(result.errors).toContain('Cooldown is required');
    });
    
    it('should reject a workout day with invalid exercises', () => {
      const day = {
        day: 'Day 1',
        focus: 'Upper Body',
        duration: '45 min',
        warmup: 'Light cardio for 5 minutes',
        exercises: [
          {
            name: 'Push-ups',
            // Missing sets, reps, rest
          }
        ],
        cooldown: 'Stretching for 5 minutes'
      };
      
      const result = validateWorkoutDay(day);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Exercise 1:');
    });
  });
  
  describe('validateWorkoutPlan', () => {
    it('should validate a valid workout plan', () => {
      const plan = {
        id: 'plan-123',
        name: 'Beginner Workout Plan',
        description: 'A workout plan for beginners',
        level: 'beginner',
        goals: ['strength', 'endurance'],
        equipment: ['bodyweight'],
        weeklyPlan: [
          {
            day: 'Day 1',
            focus: 'Full Body',
            duration: '30 min',
            warmup: 'Light cardio for 5 minutes',
            exercises: [
              {
                name: 'Push-ups',
                sets: '3',
                reps: '10',
                rest: '60s'
              }
            ],
            cooldown: 'Stretching for 5 minutes'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = validateWorkoutPlan(plan);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject a workout plan with missing required fields', () => {
      const plan = {
        // Missing id, name, description, level, goals, equipment, weeklyPlan
      };
      
      const result = validateWorkoutPlan(plan);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('ID is required');
      expect(result.errors).toContain('Name is required');
      expect(result.errors).toContain('Description is required');
      expect(result.errors).toContain('Level is required');
      expect(result.errors).toContain('Goals is required');
      expect(result.errors).toContain('Equipment is required');
      expect(result.errors).toContain('Weekly plan is required');
    });
    
    it('should reject a workout plan with an invalid level', () => {
      const plan = {
        id: 'plan-123',
        name: 'Beginner Workout Plan',
        description: 'A workout plan for beginners',
        level: 'invalid-level', // Invalid level
        goals: ['strength', 'endurance'],
        equipment: ['bodyweight'],
        weeklyPlan: [
          {
            day: 'Day 1',
            focus: 'Full Body',
            duration: '30 min',
            warmup: 'Light cardio for 5 minutes',
            exercises: [
              {
                name: 'Push-ups',
                sets: '3',
                reps: '10',
                rest: '60s'
              }
            ],
            cooldown: 'Stretching for 5 minutes'
          }
        ]
      };
      
      const result = validateWorkoutPlan(plan);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Level must be one of:');
    });
    
    it('should reject a workout plan with an empty weekly plan', () => {
      const plan = {
        id: 'plan-123',
        name: 'Beginner Workout Plan',
        description: 'A workout plan for beginners',
        level: 'beginner',
        goals: ['strength', 'endurance'],
        equipment: ['bodyweight'],
        weeklyPlan: [] // Empty weekly plan
      };
      
      const result = validateWorkoutPlan(plan);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Weekly plan cannot be empty');
    });
  });
  
  describe('validateData', () => {
    it('should validate workout data', () => {
      const workoutData = {
        id: 'plan-123',
        name: 'Beginner Workout Plan',
        description: 'A workout plan for beginners',
        level: 'beginner',
        goals: ['strength', 'endurance'],
        equipment: ['bodyweight'],
        weeklyPlan: [
          {
            day: 'Day 1',
            focus: 'Full Body',
            duration: '30 min',
            warmup: 'Light cardio for 5 minutes',
            exercises: [
              {
                name: 'Push-ups',
                sets: '3',
                reps: '10',
                rest: '60s'
              }
            ],
            cooldown: 'Stretching for 5 minutes'
          }
        ]
      };
      
      const result = validateData(workoutData, 'workout');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject null data', () => {
      const result = validateData(null, 'workout');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Data is null or undefined');
    });
    
    it('should reject an unknown data type', () => {
      const result = validateData({}, 'unknown' as any);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Unknown data type:');
    });
  });
});
