/**
 * useReducedMotion: Hook for respecting user's motion preferences
 * 
 * This hook detects whether the user has requested reduced motion
 * through their operating system settings. It allows components to
 * adapt their animations and transitions accordingly.
 * 
 * The hook returns a boolean indicating whether reduced motion is preferred.
 */

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * @returns {boolean} True if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  // Default to false if the media query isn't supported
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    // Create a media query that detects the prefers-reduced-motion setting
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set the initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create a handler for changes to the media query
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up the event listener
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Example usage:
 * 
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *   
 *   const animationStyle = prefersReducedMotion
 *     ? { transition: 'none' }
 *     : { transition: 'transform 0.3s ease-in-out' };
 *   
 *   return (
 *     <div style={animationStyle}>
 *       Animated content
 *     </div>
 *   );
 * }
 */
