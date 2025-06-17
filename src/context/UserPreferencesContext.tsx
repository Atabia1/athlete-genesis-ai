
/**
 * User Preferences Context
 *
 * This context manages user preferences including accessibility settings,
 * theme preferences, and other user-specific configurations.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  language: string;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
  // Additional methods for compatibility
  setHighContrast: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setFontSize: (value: 'small' | 'medium' | 'large') => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  screenReader: false,
  language: 'en',
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
  };

  // Additional helper methods
  const setHighContrast = (value: boolean) => {
    updatePreference('highContrast', value);
  };

  const setReducedMotion = (value: boolean) => {
    updatePreference('reducedMotion', value);
  };

  const setFontSize = (value: 'small' | 'medium' | 'large') => {
    updatePreference('fontSize', value);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
        setHighContrast,
        setReducedMotion,
        setFontSize,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}

// Theme hook for compatibility
export function useTheme() {
  const { preferences, updatePreference } = useUserPreferences();
  return {
    theme: preferences.theme,
    resolvedTheme: preferences.theme === 'system' ? 'light' : preferences.theme,
    setTheme: (theme: 'light' | 'dark' | 'system') => updatePreference('theme', theme),
  };
}

// Accessibility settings hook for compatibility
export function useAccessibilitySettings() {
  const { preferences } = useUserPreferences();
  return {
    accessibilitySettings: {
      highContrast: preferences.highContrast,
      largeText: preferences.fontSize === 'large',
      reduceMotion: preferences.reducedMotion,
    },
  };
}
