/**
 * Context Factory
 *
 * This utility provides a factory function for creating React contexts with
 * proper TypeScript typing and error handling.
 */

import { createContext as createReactContext, useContext as useReactContext, ReactNode } from 'react';

/**
 * Options for creating a context
 */
interface CreateContextOptions<ContextType> {
  /**
   * The name of the context, used for error messages
   */
  name: string;

  /**
   * The default value of the context
   */
  defaultValue?: ContextType;
}

/**
 * Create a context with proper TypeScript typing and error handling
 */
export function createContext<ContextType>({
  name,
  defaultValue,
}: CreateContextOptions<ContextType>) {
  // Create the React context
  const Context = createReactContext<ContextType | undefined>(defaultValue);

  // Create the provider component
  function Provider({
    children,
    value,
  }: { children: ReactNode; value: ContextType }) {
    // Render the provider with the value
    return Context.Provider({ value, children });
  }

  // Create the hook for using the context
  function useContext() {
    // Get the context value
    const context = useReactContext(Context);

    // Throw an error if the context is used outside of a provider
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }

    // Return the context value
    return context;
  }

  // Return the context, provider, and hook
  return [Context, Provider, useContext] as const;
}

export default createContext;
