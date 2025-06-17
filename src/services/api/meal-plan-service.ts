
/**
 * Meal Plan Service
 *
 * This service provides meal plan management functionality using Supabase.
 */

import { SupabaseService } from './supabase-service';
import { MealPlan } from '@/types/workout';

export interface MealPlanFilter {
  userId?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}

export interface MealPlanServiceOptions {
  supabaseService: SupabaseService;
}

export class MealPlanService {
  private readonly supabaseService: SupabaseService;

  constructor(options: MealPlanServiceOptions) {
    this.supabaseService = options.supabaseService;
  }

  async getAllMealPlans(): Promise<MealPlan[]> {
    try {
      const result = await this.supabaseService.fetchData<MealPlan>('meal_plans');
      
      return result.map((mealPlan: any) => this.normalizeMealPlan(mealPlan));
    } catch (error) {
      console.error('Error getting all meal plans:', error);
      throw new Error(`Failed to get meal plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private normalizeMealPlan(mealPlan: any): MealPlan {
    return {
      id: mealPlan.id,
      title: mealPlan.title || mealPlan.name,
      description: mealPlan.description || '',
      createdAt: mealPlan.created_at || new Date().toISOString(),
      days: mealPlan.days || []
    };
  }

  async getMealPlanById(id: string): Promise<MealPlan> {
    try {
      const result = await this.supabaseService.fetchData<MealPlan>('meal_plans');
      
      const mealPlan = result.find(plan => plan.id === id);
      if (!mealPlan) {
        throw new Error(`Meal plan with id ${id} not found`);
      }
      
      return this.normalizeMealPlan(mealPlan);
    } catch (error) {
      console.error('Error getting meal plan by ID:', error);
      throw new Error(`Failed to get meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createMealPlan(mealPlan: Partial<MealPlan>): Promise<MealPlan> {
    try {
      const standardizedMealPlan = this.normalizeMealPlan(mealPlan);
      
      if (!standardizedMealPlan) {
        throw new Error('Invalid meal plan data');
      }
      
      const result = await this.supabaseService.insertData<MealPlan>('meal_plans', standardizedMealPlan);
      return this.normalizeMealPlan(result);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw new Error(`Failed to create meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
    try {
      const standardizedMealPlan = this.normalizeMealPlan(updates);
      
      if (!standardizedMealPlan) {
        throw new Error('Invalid meal plan data');
      }
      
      const result = await this.supabaseService.updateData<MealPlan>('meal_plans', id, standardizedMealPlan);
      return this.normalizeMealPlan(result);
    } catch (error) {
      console.error('Error updating meal plan:', error);
      throw new Error(`Failed to update meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteMealPlan(id: string): Promise<void> {
    try {
      await this.supabaseService.deleteData('meal_plans', id);
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      throw new Error(`Failed to delete meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMealPlanTemplates(): Promise<MealPlan[]> {
    try {
      const result = await this.supabaseService.fetchData<MealPlan>('meal_plan_templates');
      
      return result.map((template: any) => this.normalizeMealPlan(template));
    } catch (error) {
      console.error('Error getting meal plan templates:', error);
      throw new Error(`Failed to get meal plan templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Create a mock service for development
const mockSupabaseService = new SupabaseService();

export const mealPlanService = new MealPlanService({
  supabaseService: mockSupabaseService
});

export default MealPlanService;
