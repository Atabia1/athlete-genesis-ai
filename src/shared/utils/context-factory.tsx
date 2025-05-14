/**
 * Context Factory
 *
 * This utility provides a factory function for creating React contexts with
 * proper TypeScript typing and error handling.
 */

import React, { createContext, useContext, ReactNode } from 'react';

/**
 * Options for creating a context
 */
interface CreateContextOptions<T> {
  /**
   * The name of the context, used for error messages
   */
  name: string;

  /**
   * The default value of the context
   */
  defaultValue: T;
}

/**
 * Create a context with proper TypeScript typing and error handling
 */
export function createContextFactory<T>({
  name,
  defaultValue,
}: CreateContextOptions<T>) {
  // Create the React context
  const Context = createContext<T>(defaultValue);

  // Set display name for debugging
  Context.displayName = name;

  // Create the hook for using the context
  function useContextHook() {
    // Get the context value
    const context = useContext(Context);

    // Throw an error if the context is used outside of a provider
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }

    // Return the context value
    return context;
  }

  // Create a selector hook
  function useContextSelector<R>(selector: (state: T) => R): R {
    const context = useContextHook();
    return selector(context);
  }

  // Create the provider component
  const Provider: React.FC<{ children: ReactNode; value: T }> = ({
    children,
    value,
  }) => {
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  };

  // Return the context, provider, and hooks
  return {
    Context,
    useContext: useContextHook,
    useContextSelector,
    Provider,
  };
}

/**
 * Create a context with state and actions
 */
export function createStateContext<State, Actions>(
  options: CreateContextOptions<State & Actions>
) {
  return createContextFactory<State & Actions>(options);
}

/**
 * Combine multiple providers into a single provider
 */
export function combineProviders(
  providers: Array<React.FC<{ children: ReactNode }>>
): React.FC<{ children: ReactNode }> {
  return ({ children }) => {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children as React.ReactElement
    );
  };
}
