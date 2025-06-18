
/**
 * Accessibility Context
 * 
 * This context provides accessibility settings and features for the application.
 * It manages:
 * - High contrast mode
 * - Reduced motion preferences
 * - Font size adjustments
 * - Screen reader announcements
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useAnnounce } from '@/shared/hooks/use-announce';

// Define the context type
export interface AccessibilityContextType {
  /** Whether high contrast mode is enabled */
  highContrast: boolean;
  /** Toggle high contrast mode */
  toggleHighContrast: () => void;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** Current font size adjustment (1 = normal, > 1 = larger) */
  fontSizeAdjustment: number;
  /** Increase font size */
  increaseFontSize: () => void;
  /** Decrease font size */
  decreaseFontSize: () => void;
  /** Reset font size to normal */
  resetFontSize: () => void;
  /** Announce a message to screen readers */
  announce: (message: string, options?: { politeness?: 'polite' | 'assertive', clearDelay?: number }) => void;
}

// Create the context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Define the provider props
export interface AccessibilityProviderProps {
  children: ReactNode;
}

// Define the provider component
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  // State for high contrast mode
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('highContrast');
      return stored === 'true';
    }
    return false;
  });

  // State for font size adjustment
  const [fontSizeAdjustment, setFontSizeAdjustment] = useState<number>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fontSizeAdjustment');
      return stored ? parseFloat(stored) : 1;
    }
    return 1;
  });

  // Use the reduced motion hook
  const prefersReducedMotion = useReducedMotion();

  // Use the announce hook
  const { announce } = useAnnounce();

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  // Increase font size
  const increaseFontSize = () => {
    setFontSizeAdjustment(prev => Math.min(prev + 0.1, 1.5));
  };

  // Decrease font size
  const decreaseFontSize = () => {
    setFontSizeAdjustment(prev => Math.max(prev - 0.1, 0.8));
  };

  // Reset font size
  const resetFontSize = () => {
    setFontSizeAdjustment(1);
  };

  // Update the document with the current settings
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update high contrast mode
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('highContrast', String(highContrast));

    // Update font size
    document.documentElement.style.fontSize = `${fontSizeAdjustment * 100}%`;
    localStorage.setItem('fontSizeAdjustment', String(fontSizeAdjustment));
  }, [highContrast, fontSizeAdjustment]);

  // Create the context value
  const value: AccessibilityContextType = {
    highContrast,
    toggleHighContrast,
    prefersReducedMotion,
    fontSizeAdjustment,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Create a hook for using the context
export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
