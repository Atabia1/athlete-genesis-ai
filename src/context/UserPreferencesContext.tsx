
import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  autoSync: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: true,
  autoSync: true,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', defaultPreferences);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev: UserPreferences) => ({ ...prev, ...updates }));
  };

  const value: UserPreferencesContextType = {
    preferences: preferences || defaultPreferences,
    updatePreferences,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
