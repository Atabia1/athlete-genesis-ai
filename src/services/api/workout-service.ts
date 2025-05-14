/**
 * Workout Service
 * 
 * This service provides methods for interacting with workout data in the backend.
 * It handles fetching, creating, updating, and deleting workouts.
 */

import { SupabaseService } from './supabase-service';
import { WorkoutPlan } from '@/types/workout';
import { standardizeWorkoutPlan } from '@/utils/workout-normalizer';

/**
 * Workout service class
 */
export class WorkoutService {
  private supabase: SupabaseService;
  private readonly TABLE_NAME = 'workouts';
  
  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService;
  }
  
  /**
   * Get all workouts for a user
   */
  async getWorkouts(userId: string): Promise<WorkoutPlan[]> {
    try {
      const workouts = await this.supabase.getData<WorkoutPlan>(this.TABLE_NAME, {
        filters: { user_id: userId },
        order: { column: 'created_at', ascending: false },
      });
      
      // Standardize workout plans
      return workouts.map(workout => standardizeWorkoutPlan(workout));
    } catch (error) {
      console.error('Error getting workouts:', error);
      throw error;
    }
  }
  
  /**
   * Get a workout by ID
   */
  async getWorkout(id: string): Promise<WorkoutPlan> {
    try {
      const workouts = await this.supabase.getData<WorkoutPlan>(this.TABLE_NAME, {
        filters: { id },
      });
      
      if (workouts.length === 0) {
        throw new Error(`Workout with ID ${id} not found`);
      }
      
      // Standardize workout plan
      return standardizeWorkoutPlan(workouts[0]);
    } catch (error) {
      console.error(`Error getting workout with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Save a new workout
   */
  async saveWorkout(workout: WorkoutPlan): Promise<WorkoutPlan> {
    try {
      // Ensure workout has required fields
      if (!workout.id) {
        throw new Error('Workout ID is required');
      }
      
      // Standardize workout plan before saving
      const standardizedWorkout = standardizeWorkoutPlan(workout);
      
      // Add timestamps if not present
      const now = new Date().toISOString();
      if (!standardizedWorkout.createdAt) {
        standardizedWorkout.createdAt = now;
      }
      standardizedWorkout.updatedAt = now;
      
      // Save to database
      const savedWorkout = await this.supabase.insertData<WorkoutPlan>(
        this.TABLE_NAME,
        standardizedWorkout
      );
      
      return standardizeWorkoutPlan(savedWorkout);
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing workout
   */
  async updateWorkout(workout: WorkoutPlan): Promise<WorkoutPlan> {
    try {
      // Ensure workout has required fields
      if (!workout.id) {
        throw new Error('Workout ID is required');
      }
      
      // Standardize workout plan before updating
      const standardizedWorkout = standardizeWorkoutPlan(workout);
      
      // Update timestamp
      standardizedWorkout.updatedAt = new Date().toISOString();
      
      // Update in database
      const updatedWorkout = await this.supabase.updateData<WorkoutPlan>(
        this.TABLE_NAME,
        workout.id,
        standardizedWorkout
      );
      
      return standardizeWorkoutPlan(updatedWorkout);
    } catch (error) {
      console.error(`Error updating workout with ID ${workout.id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a workout
   */
  async deleteWorkout(id: string): Promise<void> {
    try {
      await this.supabase.deleteData(this.TABLE_NAME, id);
    } catch (error) {
      console.error(`Error deleting workout with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get workout templates
   */
  async getWorkoutTemplates(): Promise<WorkoutPlan[]> {
    try {
      const templates = await this.supabase.getData<WorkoutPlan>('workout_templates', {
        order: { column: 'name', ascending: true },
      });
      
      // Standardize workout plans
      return templates.map(template => standardizeWorkoutPlan(template));
    } catch (error) {
      console.error('Error getting workout templates:', error);
      throw error;
    }
  }
}
