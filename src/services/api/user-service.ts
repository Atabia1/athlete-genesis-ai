/**
 * User Service
 *
 * This service provides methods for interacting with user data in the backend.
 * It handles user profiles, preferences, and settings.
 */

import { SupabaseService } from './supabase-service';
import { supabaseClient } from '@/lib/supabase';

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar_url?: string;
  user_type: 'athlete' | 'coach' | 'fitness_enthusiast';
  fitness_goals?: string[];
  experience_level?: string;
  preferred_sports?: string[];
  preferred_language?: string;
  created_at: string;
  updated_at: string;
}

/**
 * User service class
 */
export class UserService {
  private supabase: SupabaseService;
  private readonly PROFILES_TABLE = 'profiles';
  private readonly PREFERENCES_TABLE = 'user_preferences';

  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService;
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const profiles = await this.supabase.getData<UserProfile>(this.PROFILES_TABLE, {
        filters: { user_id: userId },
      });

      if (profiles.length === 0) {
        throw new Error(`Profile for user ${userId} not found`);
      }

      return profiles[0];
    } catch (error) {
      console.error(`Error getting profile for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create or update user profile
   */
  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Ensure profile has user_id
      if (!profile.user_id) {
        throw new Error('User ID is required');
      }

      // Check if profile exists
      const existingProfiles = await this.supabase.getData<UserProfile>(this.PROFILES_TABLE, {
        filters: { user_id: profile.user_id },
      });

      // Add timestamps
      const now = new Date().toISOString();
      profile.updated_at = now;

      let updatedProfile: UserProfile;

      if (existingProfiles.length === 0) {
        // Create new profile
        profile.created_at = now;
        updatedProfile = await this.supabase.insertData<UserProfile>(
          this.PROFILES_TABLE,
          profile
        );
      } else {
        // Update existing profile
        updatedProfile = await this.supabase.updateData<UserProfile>(
          this.PROFILES_TABLE,
          existingProfiles[0].id,
          profile
        );
      }

      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId: string): Promise<Record<string, any>> {
    try {
      const preferences = await this.supabase.getData(this.PREFERENCES_TABLE, {
        filters: { user_id: userId },
      });

      if (preferences.length === 0) {
        return {}; // No preferences found
      }

      return preferences[0].preferences || {};
    } catch (error) {
      console.error(`Error getting preferences for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: Record<string, any>): Promise<void> {
    try {
      // Check if preferences exist
      const existingPreferences = await this.supabase.getData(this.PREFERENCES_TABLE, {
        filters: { user_id: userId },
      });

      if (existingPreferences.length === 0) {
        // Create new preferences
        await this.supabase.insertData(this.PREFERENCES_TABLE, {
          user_id: userId,
          preferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        // Update existing preferences
        await this.supabase.updateData(
          this.PREFERENCES_TABLE,
          existingPreferences[0].id,
          {
            preferences,
            updated_at: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error(`Error updating preferences for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user's preferred language
   */
  async updatePreferredLanguage(userId: string, language: string): Promise<void> {
    try {
      // Get the user profile
      const profiles = await this.supabase.getData(this.PROFILES_TABLE, {
        filters: { user_id: userId },
      });

      if (profiles.length === 0) {
        throw new Error(`Profile for user ${userId} not found`);
      }

      // Update the preferred language
      await this.supabase.updateData(
        this.PROFILES_TABLE,
        profiles[0].id,
        {
          preferred_language: language,
          updated_at: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error(`Error updating preferred language for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.getClient().auth.admin.getUserById(userId);

      if (error) {
        throw error;
      }

      return data.user;
    } catch (error) {
      console.error(`Error getting user with ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user email
   */
  async updateEmail(userId: string, email: string): Promise<void> {
    try {
      const { error } = await this.supabase.getClient().auth.admin.updateUserById(
        userId,
        { email }
      );

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error updating email for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, password: string): Promise<void> {
    try {
      const { error } = await this.supabase.getClient().auth.admin.updateUserById(
        userId,
        { password }
      );

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error updating password for user ${userId}:`, error);
      throw error;
    }
  }
}

// Create a mock SupabaseService
class MockSupabaseService implements SupabaseService {
  getData<T>(table: string, options?: any): Promise<T[]> {
    return Promise.resolve([]) as Promise<T[]>;
  }

  insertData<T>(table: string, data: any): Promise<T> {
    return Promise.resolve({} as T);
  }

  updateData<T>(table: string, id: string, data: any): Promise<T> {
    return Promise.resolve({} as T);
  }

  deleteData(table: string, id: string): Promise<void> {
    return Promise.resolve();
  }

  getClient() {
    return supabaseClient;
  }
}

// Export a singleton instance of the UserService
export const userService = new UserService(new MockSupabaseService());
