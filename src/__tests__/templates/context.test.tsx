/**
 * Context Provider Test Template
 * 
 * This template demonstrates how to write tests for React context providers.
 * Replace the example context and tests with your actual code.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExampleProvider, useExampleContext } from '../path-to-your-context';

// Create a test component that uses the context
const TestComponent = () => {
  const { data, loading, error, updateData } = useExampleContext();
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Data: {data}</p>}
      <button onClick={() => updateData('new-data')}>Update Data</button>
    </div>
  );
};

describe('ExampleProvider', () => {
  // Setup - runs before each test
  beforeEach(() => {
    // Reset mocks, prepare test data, etc.
    jest.clearAllMocks();
  });

  // Test initial state
  it('should provide the initial state', () => {
    // Arrange & Act
    render(
      <ExampleProvider initialData="initial-data">
        <TestComponent />
      </ExampleProvider>
    );
    
    // Assert
    expect(screen.getByText(/data: initial-data/i)).toBeInTheDocument();
  });

  // Test context updates
  it('should update the context state when updateData is called', async () => {
    // Arrange
    render(
      <ExampleProvider initialData="initial-data">
        <TestComponent />
      </ExampleProvider>
    );
    
    // Act
    const updateButton = screen.getByRole('button', { name: /update data/i });
    userEvent.click(updateButton);
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/data: new-data/i)).toBeInTheDocument();
    });
  });

  // Test loading state
  it('should show loading state when loading is true', () => {
    // Arrange & Act
    render(
      <ExampleProvider initialLoading={true}>
        <TestComponent />
      </ExampleProvider>
    );
    
    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  // Test error state
  it('should show error message when error is provided', () => {
    // Arrange & Act
    render(
      <ExampleProvider initialError="Something went wrong">
        <TestComponent />
      </ExampleProvider>
    );
    
    // Assert
    expect(screen.getByText(/error: something went wrong/i)).toBeInTheDocument();
  });

  // Test context with async operations
  it('should handle async operations', async () => {
    // Mock API call
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: 'async-data' }),
        ok: true,
      } as Response)
    );
    
    // Arrange
    render(
      <ExampleProvider>
        <TestComponent />
      </ExampleProvider>
    );
    
    // Act
    const fetchButton = screen.getByRole('button', { name: /fetch data/i });
    userEvent.click(fetchButton);
    
    // Assert - First loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Assert - Then data
    await waitFor(() => {
      expect(screen.getByText(/data: async-data/i)).toBeInTheDocument();
    });
  });

  // Test error handling in async operations
  it('should handle errors in async operations', async () => {
    // Mock API call with error
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('API Error'))
    );
    
    // Arrange
    render(
      <ExampleProvider>
        <TestComponent />
      </ExampleProvider>
    );
    
    // Act
    const fetchButton = screen.getByRole('button', { name: /fetch data/i });
    userEvent.click(fetchButton);
    
    // Assert - Error state
    await waitFor(() => {
      expect(screen.getByText(/error: api error/i)).toBeInTheDocument();
    });
  });
});
