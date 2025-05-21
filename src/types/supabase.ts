
/**
 * Types for Supabase data structures
 */

/**
 * User profile data from Supabase
 */
export interface UserProfile {
  id?: string;
  created_at?: string | null;
  user_type: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  fitness_goals?: string[] | null;
  sport?: string | null;
  experience_level?: string | null;
}

/**
 * Extended profile used in the UI
 */
export interface ExtendedUserProfile extends UserProfile {
  // Add any UI-specific profile properties here
  // These should be derived properties, not stored in the database
}
