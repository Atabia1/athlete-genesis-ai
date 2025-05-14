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
  defaultValue?: T;
}

/**
 * Create a context with proper TypeScript typing and error handling
 */
export function createContext<T>({
  name,
  defaultValue,
}: CreateContextOptions<T>) {
  // Create the React context
  const Context = createContext<T | undefined>(defaultValue);

  // Set display name for debugging
  Context.displayName = name;

  // Create the provider component
  function Provider({
    children,
    value,
  }: { children: ReactNode; value: T }) {
    // Render the provider with the value
    return React.createElement(Context.Provider, { value }, children);
  }

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

  // Return the context, provider, and hook
  return [Context, Provider, useContextHook] as const;
}

/**
 * Example usage:
 *
 * // Create a context and provider
 * const [CounterContext, CounterProvider, useCounter] = createContext<CounterContextType>({
 *   name: 'Counter',
 *   useValue: (props) => {
 *     const [count, setCount] = useState(props.initialCount || 0);
 *
 *     const increment = () => setCount(count + 1);
 *     const decrement = () => setCount(count - 1);
 *
 *     return { count, increment, decrement };
 *   }
 * });
 *
 * // Use the provider
 * function App() {
 *   return (
 *     <CounterProvider initialCount={10}>
 *       <Counter />
 *     </CounterProvider>
 *   );
 * }
 *
 * // Use the context
 * function Counter() {
 *   const { count, increment, decrement } = useCounter();
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={increment}>Increment</button>
 *       <button onClick={decrement}>Decrement</button>
 *     </div>
 *   );
 * }
 */
