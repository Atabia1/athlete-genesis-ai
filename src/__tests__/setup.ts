
/**
 * Test Setup File
 * 
 * This file provides global mock implementations for testing.
 */

// Define jest and expect on globalThis for TypeScript
declare global {
  namespace NodeJS {
    interface Global {
      expect: any;
    }
  }
  const expect: jest.Expect;
}

// Mock implementation for toBeInTheDocument
if (global.expect) {
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
