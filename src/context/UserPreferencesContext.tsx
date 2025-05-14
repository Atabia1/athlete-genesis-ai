/**
 * UserPreferencesContext
 * 
 * This context consolidates user preferences including:
 * - Theme preferences (light, dark, system)
 * - Accessibility settings (high contrast, large text, etc.)
 * 
 * It replaces the separate ThemeContext and AccessibilityContext to reduce
 * context nesting and improve performance.
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { createStateContext } from '@/shared/utils/context-factory';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Accessibility settings
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

// State interface
interface UserPreferencesState {
  theme: Theme;
  systemTheme: Theme;
  resolvedTheme: Theme;
  accessibilitySettings: AccessibilitySettings;
}

// Actions interface
interface UserPreferencesActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  updateAccessibilitySetting: (setting: keyof AccessibilitySettings, value: boolean) => void;
  resetAccessibilitySettings: () => void;
}

// Default accessibility settings
const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  screenReader: false,
};

// Create the context
const {
  Provider,
  useContext: useUserPreferences,
  useContextSelector: useUserPreferencesSelector,
} = createStateContext<UserPreferencesState, UserPreferencesActions>({
  name: 'UserPreferences',
  defaultValue: {
    theme: 'system',
    systemTheme: 'light',
    resolvedTheme: 'light',
    accessibilitySettings: defaultAccessibilitySettings,
    setTheme: () => {},
    toggleTheme: () => {},
    updateAccessibilitySetting: () => {},
    resetAccessibilitySettings: () => {},
  },
});

/**
 * UserPreferencesProvider component
 */
export function UserPreferencesProvider({ children }: { children: ReactNode }): JSX.Element {
  // Theme state
  const [theme, setThemeValue] = useLocalStorage<Theme>('theme', 'system');
  const [systemTheme, setSystemTheme] = useState<Theme>('light');
  
  // Accessibility settings state
  const [accessibilitySettings, setAccessibilitySettings] = useLocalStorage<AccessibilitySettings>(
    'accessibilitySettings',
    defaultAccessibilitySettings
  );

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Update system theme when it changes
    const handler = (e: MediaQueryListEvent): void => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handler);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const resolvedTheme = theme === 'system' ? systemTheme : theme;
    
    // Update document class
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'
      );
    }
  }, [theme, systemTheme]);

  // Apply accessibility settings to document
  useEffect(() => {
    // High contrast
    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Large text
    if (accessibilitySettings.largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    
    // Reduce motion
    if (accessibilitySettings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Screen reader
    if (accessibilitySettings.screenReader) {
      document.documentElement.setAttribute('role', 'application');
    } else {
      document.documentElement.removeAttribute('role');
    }
  }, [accessibilitySettings]);

  // Set theme
  const setTheme = (newTheme: Theme): void => {
    setThemeValue(newTheme);
  };

  // Toggle theme
  const toggleTheme = (): void => {
    setThemeValue(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  // Update accessibility setting
  const updateAccessibilitySetting = (
    setting: keyof AccessibilitySettings,
    value: boolean
  ): void => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Reset accessibility settings
  const resetAccessibilitySettings = (): void => {
    setAccessibilitySettings(defaultAccessibilitySettings);
  };

  // Resolved theme
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // Context value
  const value = {
    theme,
    systemTheme,
    resolvedTheme,
    accessibilitySettings,
    setTheme,
    toggleTheme,
    updateAccessibilitySetting,
    resetAccessibilitySettings,
  };

  return <Provider value={value}>{children}</Provider>;
}

// Export hooks
export { useUserPreferences, useUserPreferencesSelector };

// Selector hooks for specific parts of the context
export function useTheme(): {
  theme: Theme;
  systemTheme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} {
  return useUserPreferencesSelector(state => ({
    theme: state.theme,
    systemTheme: state.systemTheme,
    resolvedTheme: state.resolvedTheme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }));
}

export function useAccessibilitySettings(): {
  accessibilitySettings: AccessibilitySettings;
  updateAccessibilitySetting: (setting: keyof AccessibilitySettings, value: boolean) => void;
  resetAccessibilitySettings: () => void;
} {
  return useUserPreferencesSelector(state => ({
    accessibilitySettings: state.accessibilitySettings,
    updateAccessibilitySetting: state.updateAccessibilitySetting,
    resetAccessibilitySettings: state.resetAccessibilitySettings,
  }));
}
