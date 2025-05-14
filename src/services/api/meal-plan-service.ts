/**
 * Meal Plan Service
 * 
 * This service provides methods for interacting with meal plan data in the backend.
 * It handles fetching, creating, updating, and deleting meal plans.
 */

import { SupabaseService } from './supabase-service';
import { MealPlan } from '@/types/workout';
import { standardizeMealPlan } from '@/utils/workout-normalizer';

/**
 * Meal Plan service class
 */
export class MealPlanService {
  private supabase: SupabaseService;
  private readonly TABLE_NAME = 'meal_plans';
  
  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService;
  }
  
  /**
   * Get all meal plans for a user
   */
  async getMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const mealPlans = await this.supabase.getData<MealPlan>(this.TABLE_NAME, {
        filters: { user_id: userId },
        order: { column: 'created_at', ascending: false },
      });
      
      // Standardize meal plans
      return mealPlans.map(mealPlan => standardizeMealPlan(mealPlan));
    } catch (error) {
      console.error('Error getting meal plans:', error);
      throw error;
    }
  }
  
  /**
   * Get a meal plan by ID
   */
  async getMealPlan(id: string): Promise<MealPlan> {
    try {
      const mealPlans = await this.supabase.getData<MealPlan>(this.TABLE_NAME, {
        filters: { id },
      });
      
      if (mealPlans.length === 0) {
        throw new Error(`Meal plan with ID ${id} not found`);
      }
      
      // Standardize meal plan
      return standardizeMealPlan(mealPlans[0]);
    } catch (error) {
      console.error(`Error getting meal plan with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Save a new meal plan
   */
  async saveMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
    try {
      // Ensure meal plan has required fields
      if (!mealPlan.id) {
        throw new Error('Meal plan ID is required');
      }
      
      // Standardize meal plan before saving
      const standardizedMealPlan = standardizeMealPlan(mealPlan);
      
      // Add timestamps if not present
      const now = new Date().toISOString();
      if (!standardizedMealPlan.createdAt) {
        standardizedMealPlan.createdAt = now;
      }
      standardizedMealPlan.updatedAt = now;
      
      // Save to database
      const savedMealPlan = await this.supabase.insertData<MealPlan>(
        this.TABLE_NAME,
        standardizedMealPlan
      );
      
      return standardizeMealPlan(savedMealPlan);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing meal plan
   */
  async updateMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
    try {
      // Ensure meal plan has required fields
      if (!mealPlan.id) {
        throw new Error('Meal plan ID is required');
      }
      
      // Standardize meal plan before updating
      const standardizedMealPlan = standardizeMealPlan(mealPlan);
      
      // Update timestamp
      standardizedMealPlan.updatedAt = new Date().toISOString();
      
      // Update in database
      const updatedMealPlan = await this.supabase.updateData<MealPlan>(
        this.TABLE_NAME,
        mealPlan.id,
        standardizedMealPlan
      );
      
      return standardizeMealPlan(updatedMealPlan);
    } catch (error) {
      console.error(`Error updating meal plan with ID ${mealPlan.id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a meal plan
   */
  async deleteMealPlan(id: string): Promise<void> {
    try {
      await this.supabase.deleteData(this.TABLE_NAME, id);
    } catch (error) {
      console.error(`Error deleting meal plan with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get meal plan templates
   */
  async getMealPlanTemplates(): Promise<MealPlan[]> {
    try {
      const templates = await this.supabase.getData<MealPlan>('meal_plan_templates', {
        order: { column: 'name', ascending: true },
      });
      
      // Standardize meal plans
      return templates.map(template => standardizeMealPlan(template));
    } catch (error) {
      console.error('Error getting meal plan templates:', error);
      throw error;
    }
  }
}
