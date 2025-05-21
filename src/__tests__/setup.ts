
/**
 * Test Setup File
 * 
 * This file provides global mock implementations for testing.
 */

// Import Jest types
import { jest } from '@jest/globals';

// Define types for globalThis extensions
declare global {
  namespace NodeJS {
    interface Global {
      expect: typeof jest.expect;
    }
  }

  // Add expect to the global namespace for TypeScript
  const expect: typeof jest.expect;
}

// Mock implementation for toBeInTheDocument
if (typeof jest.expect !== 'undefined') {
  jest.expect.extend({
    toBeInTheDocument(received: any) {
      const pass = received !== null;
      return {
        message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
        pass
      };
    }
  });
}

// Add any other global mocks needed for testing
