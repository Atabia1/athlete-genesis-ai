/**
 * Theme Hook
 * 
 * This hook provides access to the theme context and allows for theme switching.
 */

import { useContext } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };
  
  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';
  const isSystem = theme === 'system';
  
  return {
    theme: theme as Theme,
    setTheme,
    systemTheme,
    resolvedTheme,
    toggleTheme,
    isDark,
    isLight,
    isSystem
  };
}

export default useTheme;
