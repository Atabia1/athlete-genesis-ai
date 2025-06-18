
/**
 * Language Preference Context
 *
 * This context manages user language preferences for the application.
 * It handles saving and loading language settings from localStorage.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguagePreference {
  language: string;
}

interface LanguagePreferenceContextType {
  updateLanguagePreference: (language: string) => Promise<void>;
}

const LanguagePreferenceContext = createContext<LanguagePreferenceContextType | undefined>(undefined);

export function LanguagePreferenceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<LanguagePreference>({ language: 'en' });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setPreference({ language: savedLanguage });
    }
  }, []);

  const updateLanguagePreference = async (language: string) => {
    setPreference({ language });
    localStorage.setItem('language', language);
  };

  return (
    <LanguagePreferenceContext.Provider
      value={{
        updateLanguagePreference,
      }}
    >
      {children}
    </LanguagePreferenceContext.Provider>
  );
}

export function useLanguagePreference() {
  const context = useContext(LanguagePreferenceContext);
  if (context === undefined) {
    throw new Error('useLanguagePreference must be used within a LanguagePreferenceProvider');
  }
  return context;
}
