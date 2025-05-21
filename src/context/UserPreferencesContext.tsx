
/**
 * UserPreferencesContext
 * 
 * This context manages user preferences across the application,
 * including theme, accessibility settings, and UI preferences.
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

// User preferences interface
interface UserPreferences {
  // Theme preferences
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  reducedMotion: boolean;
  
  // Accessibility preferences
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  
  // Layout preferences
  compactMode: boolean;
  hideSidebar: boolean;
  
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // Feature preferences
  betaFeatures: boolean;
  
  // Dashboard preferences
  dashboardLayout: string[];
  
  // Offline preferences
  offlineFirst: boolean;
  automaticSync: boolean;
  
  // Language settings
  language: string;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
  compactMode: false,
  hideSidebar: false,
  emailNotifications: true,
  pushNotifications: true,
  betaFeatures: false,
  dashboardLayout: ['workouts', 'nutrition', 'goals', 'progress'],
  offlineFirst: true,
  automaticSync: true,
  language: 'en'
};

// Create context
interface UserPreferencesContextType {
  preferences: UserPreferences;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  isLoading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Provider component
export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  // We load preferences from localStorage
  const [storedPreferences, setStoredPreferences] = useLocalStorage<UserPreferences>(
    'user-preferences',
    defaultPreferences
  );
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences once from storage
  useEffect(() => {
    if (storedPreferences) {
      // Merge with defaults to ensure all properties exist
      setPreferences({ ...defaultPreferences, ...storedPreferences });
    }
    setIsLoading(false);
  }, [storedPreferences]);

  // Set a specific preference
  const setPreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    setStoredPreferences(updatedPreferences);
  };

  // Reset all preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setStoredPreferences(defaultPreferences);
  };

  // Apply preferences to document - helps with initial render of correct theme
  useEffect(() => {
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (preferences.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    document.documentElement.classList.add(`font-${preferences.fontSize}`);

    return () => {
      document.documentElement.classList.remove('high-contrast', 'reduced-motion');
      document.documentElement.classList.remove(`font-${preferences.fontSize}`);
    };
  }, [preferences.highContrast, preferences.reducedMotion, preferences.fontSize]);

  const value = {
    preferences,
    setPreference,
    resetPreferences,
    isLoading
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Hook for using the context
export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
