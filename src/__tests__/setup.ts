
/**
 * Test Setup File
 * 
 * This file provides global mock implementations for testing.
 */

// Import Jest types
import { jest, expect as jestExpect } from '@jest/globals';

// Define types for globalThis extensions
declare global {
  namespace NodeJS {
    interface Global {
      expect: typeof jestExpect;
    }
  }
}

// Mock implementation for toBeInTheDocument
if (typeof jestExpect !== 'undefined') {
  jestExpect.extend({
    toBeInTheDocument(received: unknown) {
      const pass = received !== null;
      return {
        message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
        pass
      };
    }
  });
}

// Add any other global mocks needed for testing
