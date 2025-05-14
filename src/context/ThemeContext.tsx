/**
 * Theme Context
 * 
 * This context provides theme management for the application.
 * It handles theme switching, system theme detection, and persistence.
 */

import { useState, useEffect } from 'react';
import { createContext } from '@/utils/context-factory';

/**
 * Theme options
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme context type
 */
export interface ThemeContextType {
  /** Current theme */
  theme: Theme;
  
  /** Set the theme */
  setTheme: (theme: Theme) => void;
  
  /** Whether the current effective theme is dark */
  isDarkMode: boolean;
  
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  /** Default theme */
  defaultTheme?: Theme;
  
  /** Storage key for persisting theme preference */
  storageKey?: string;
}

/**
 * Create the theme context and provider
 */
const [ThemeContext, ThemeProvider, useTheme] = createContext<ThemeContextType, ThemeProviderProps>({
  name: 'Theme',
  
  useValue: ({ defaultTheme = 'system', storageKey = 'theme' }) => {
    // Get the initial theme from localStorage or use the default
    const [theme, setThemeState] = useState<Theme>(() => {
      const storedTheme = localStorage.getItem(storageKey);
      return (storedTheme as Theme) || defaultTheme;
    });
    
    // Track whether the system prefers dark mode
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    
    // Calculate whether the current effective theme is dark
    const isDarkMode = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';
    
    // Set the theme
    const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(storageKey, newTheme);
    };
    
    // Toggle between light and dark themes
    const toggleTheme = () => {
      setTheme(isDarkMode ? 'light' : 'dark');
    };
    
    // Listen for system theme changes
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }, []);
    
    // Update the document with the current theme
    useEffect(() => {
      const root = window.document.documentElement;
      
      // Remove both classes first
      root.classList.remove('light', 'dark');
      
      // Add the appropriate class
      if (theme === 'system') {
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }, [theme, systemTheme]);
    
    return {
      theme,
      setTheme,
      isDarkMode,
      toggleTheme,
    };
  },
});

export { ThemeProvider, useTheme };
export default ThemeContext;
