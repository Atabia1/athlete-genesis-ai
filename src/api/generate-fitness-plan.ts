// src/api/generate-fitness-plan.ts
import { sampleWorkoutPlan, sampleMealPlan } from '../mocks/mockData';

/**
 * Generate a fitness plan based on user profile
 *
 * This is a mock implementation for development and testing purposes.
 * It simulates the behavior of the Supabase Edge Function without requiring
 * an actual API call. This allows development to continue even when the
 * backend API is unavailable or when working offline.
 *
 * The function returns pre-defined workout and meal plan templates that
 * match the structure of AI-generated plans to ensure consistent rendering.
 *
 * @param {any} userProfile - The user's fitness profile containing preferences and goals
 * @returns {Promise<Object>} - Object containing workout and meal plans
 */
export async function generateFitnessPlan(userProfile: any) {
  // Log the user profile for debugging
  console.log('Generating fitness plan for profile:', userProfile);

  /**
   * Simulate API delay to provide realistic user experience
   * This helps test loading states in the UI
   */
  await new Promise(resolve => setTimeout(resolve, 2000));

  /**
   * Return mock data that matches the structure of real API responses
   * This ensures the UI can render the data correctly
   */
  return {
    workoutPlan: sampleWorkoutPlan,
    mealPlan: sampleMealPlan
  };
}
