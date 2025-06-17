
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

interface UserPreferencesContextType {
  theme: string;
  accessibilitySettings: AccessibilitySettings;
  setTheme: (theme: string) => void;
  setAccessibilitySettings: (settings: AccessibilitySettings) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    return { resolvedTheme: 'light' };
  }
  return { resolvedTheme: context.theme };
};

export const useAccessibilitySettings = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    return {
      accessibilitySettings: {
        highContrast: false,
        largeText: false,
        reduceMotion: false
      }
    };
  }
  return { accessibilitySettings: context.accessibilitySettings };
};

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false
  });

  const value = {
    theme,
    accessibilitySettings,
    setTheme,
    setAccessibilitySettings
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
