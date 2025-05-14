/**
 * LanguagePreferenceContext
 *
 * This context provides language preference functionality throughout the application.
 * It uses the useLanguagePreference hook to load and update the user's language preference.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguagePreference } from '@/shared/hooks/use-language-preference';

// Define the context type
interface LanguagePreferenceContextType {
  updateLanguagePreference: (language: string) => Promise<void>;
}

// Create the context with a default value
const LanguagePreferenceContext = createContext<LanguagePreferenceContextType | undefined>(undefined);

// Provider component
export function LanguagePreferenceProvider({ children }: { children: ReactNode }) {
  // Use the language preference hook
  const { updateLanguagePreference } = useLanguagePreference();

  // Create the context value
  const contextValue: LanguagePreferenceContextType = {
    updateLanguagePreference,
  };

  return (
    <LanguagePreferenceContext.Provider value={contextValue}>
      {children}
    </LanguagePreferenceContext.Provider>
  );
}

// Hook to use the language preference context
export function useLanguagePreferenceContext() {
  const context = useContext(LanguagePreferenceContext);
  if (context === undefined) {
    throw new Error('useLanguagePreferenceContext must be used within a LanguagePreferenceProvider');
  }
  return context;
}
