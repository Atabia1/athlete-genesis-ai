
/**
 * Test Setup File
 * 
 * This file provides global mock implementations for testing.
 */

// Define types for globalThis extensions
declare global {
  namespace NodeJS {
    interface Global {
      expect: jest.Expect;
    }
  }
}

// Mock implementation for toBeInTheDocument
if (typeof global.expect !== 'undefined') {
  global.expect.extend({
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
