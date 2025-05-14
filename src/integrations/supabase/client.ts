
/**
 * Supabase Client
 *
 * This file provides a configured Supabase client using environment variables.
 * It should not be edited directly as it may be regenerated.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseConfig } from '@/utils/env-config';

// Get Supabase configuration from environment variables
const { url, anonKey } = getSupabaseConfig();

// Create and export the Supabase client
// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper functions for type-safe data access
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Helper functions for the sports table
export const getSports = async () => {
  const { data, error } = await supabase
    .from('sports')
    .select('*');

  if (error) throw error;
  return data;
};

// Helper functions for the exercises table
export const getExercises = async () => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*');

  if (error) throw error;
  return data;
};

// Helper function for workout plans
export const getWorkoutPlans = async (userId: string) => {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

// Helper function for workout sessions
export const getWorkoutSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

// Helper function for nutrition logs
export const getNutritionLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};
