/**
 * Unit Test Template
 * 
 * This template demonstrates how to write unit tests for utility functions.
 * Replace the example function and tests with your actual code.
 */

// Import the function to test
import { exampleFunction } from '../path-to-your-function';

// Optional: Mock dependencies if needed
jest.mock('../path-to-dependency', () => ({
  dependencyFunction: jest.fn().mockReturnValue('mocked-value'),
}));

describe('exampleFunction', () => {
  // Setup - runs before each test
  beforeEach(() => {
    // Reset mocks, prepare test data, etc.
    jest.clearAllMocks();
  });

  // Teardown - runs after each test
  afterEach(() => {
    // Clean up resources, reset state, etc.
  });

  // Test case
  it('should return the expected result for valid input', () => {
    // Arrange
    const input = 'test-input';
    const expectedOutput = 'expected-result';
    
    // Act
    const result = exampleFunction(input);
    
    // Assert
    expect(result).toBe(expectedOutput);
  });

  // Test case for error handling
  it('should throw an error for invalid input', () => {
    // Arrange
    const invalidInput = null;
    
    // Act & Assert
    expect(() => {
      exampleFunction(invalidInput);
    }).toThrow('Invalid input');
  });

  // Test case with mock verification
  it('should call dependencies with correct parameters', () => {
    // Arrange
    const input = 'test-input';
    const mockDependency = require('../path-to-dependency').dependencyFunction;
    
    // Act
    exampleFunction(input);
    
    // Assert
    expect(mockDependency).toHaveBeenCalledWith(input);
    expect(mockDependency).toHaveBeenCalledTimes(1);
  });
});
