
/**
 * Type definitions for Jest to avoid TypeScript errors
 */

declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
  
  interface Expect {
    extend(matchers: Record<string, any>): void;
  }
}

export {};
