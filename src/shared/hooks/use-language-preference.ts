
/**
 * useLanguagePreference Hook
 *
 * This hook manages the user's language preference, loading it from their profile
 * when they log in and applying it to the application.
 */

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import i18n from '@/i18n';
import { mockUserService } from '@/services/api/user-service';

/**
 * Hook to manage the user's language preference
 */
export function useLanguagePreference() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only load language preference if the user is authenticated
    if (isAuthenticated && user) {
      loadLanguagePreference(user.id);
    }
  }, [isAuthenticated, user]);

  /**
   * Load the user's language preference from their profile
   */
  const loadLanguagePreference = async (userId: string) => {
    try {
      // Get the user's profile using the available method
      const profile = await mockUserService.getUserProfile(userId);

      // If the user has a preferred language, apply it
      if (profile && profile.preferred_language) {
        i18n.changeLanguage(profile.preferred_language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  /**
   * Update the user's language preference
   */
  const updateLanguagePreference = async (language: string) => {
    try {
      if (isAuthenticated && user) {
        // Update the language in the application
        i18n.changeLanguage(language);

        // Save the preference to the user's profile using the available method
        await mockUserService.updateUserProfile(user.id, { preferred_language: language });
      } else {
        // If the user is not authenticated, just update the language
        i18n.changeLanguage(language);
      }
    } catch (error) {
      console.error('Error updating language preference:', error);
    }
  };

  return {
    updateLanguagePreference,
  };
}
