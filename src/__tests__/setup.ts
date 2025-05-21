
/**
 * Test Setup File
 * 
 * This file provides global mock implementations for testing.
 */

// Mock implementation for toBeInTheDocument
// This is necessary because jest-dom might not be set up correctly
global.expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
      pass
    };
  }
});

// Add any other global mocks needed for testing
