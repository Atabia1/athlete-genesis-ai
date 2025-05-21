/**
 * Context Factory
 *
 * This utility provides functions for creating React contexts with enhanced features.
 */

import React, { createContext, useContext } from 'react';

/**
 * Create a state context
 *
 * This function creates a React context with the following features:
 * - Type-safe context value
 * - Default value for the context
 *
 * @param contextName - Name of the context for debugging
 * @param initialValue - Default value for the context
 * @returns Array with useContext hook and Provider component
 */
export function createStateContext<T, A = Record<string, unknown>>(contextName: string, _initialValue: T & A) {
  // Create the context
  const Context = createContext<T & A | undefined>(undefined);
  Context.displayName = contextName;

  // Create the provider
  const Provider = ({ value, children }: { value: T & A; children: React.ReactNode }) => {
    return React.createElement(
      Context.Provider,
      { value },
      children
    );
  };

  // Create the hook
  function useStateContext(): T & A {
    const context = useContext(Context);

    if (context === undefined) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }

    return context;
  }

  return [useStateContext, Provider] as const;
}
