
/**
 * Integration Test Template
 * 
 * This template demonstrates how to write integration tests that verify
 * multiple components working together.
 * Replace the example components and tests with your actual code.
 */

// This is a template file and not meant to be compiled directly
// Uncomment and modify the following code when implementing actual tests

/*
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import components to test
import { WorkoutList } from '../path-to-workout-list';
import { WorkoutDetail } from '../path-to-workout-detail';
import { ExampleProvider } from '../path-to-context';

// Setup Mock Service Worker for API mocking
const server = setupServer(
  // Mock the API endpoints
  rest.get('/api/workouts', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'Workout 1' },
        { id: '2', name: 'Workout 2' },
      ])
    );
  }),
  
  rest.get('/api/workouts/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        id,
        name: `Workout ${id}`,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 10 },
          { name: 'Squats', sets: 3, reps: 15 },
        ],
      })
    );
  })
);

// Setup React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Setup before and after hooks
beforeAll(() => server.listen());
afterEach(() => {
  queryClient.clear();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('Workout Feature Integration', () => {
  // Test the full workflow
  it('should display workout list and navigate to detail page', async () => {
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <ExampleProvider>
          <MemoryRouter initialEntries={['/workouts']}>
            <Routes>
              <Route path="/workouts" element={<WorkoutList />} />
              <Route path="/workouts/:id" element={<WorkoutDetail />} />
            </Routes>
          </MemoryRouter>
        </ExampleProvider>
      </QueryClientProvider>
    );
    
    // Assert - Check that workout list is displayed
    await waitFor(() => {
      expect(screen.getByText('Workout 1')).toBeInTheDocument();
      expect(screen.getByText('Workout 2')).toBeInTheDocument();
    });
    
    // Act - Click on a workout
    userEvent.click(screen.getByText('Workout 1'));
    
    // Assert - Check that detail page is displayed
    await waitFor(() => {
      expect(screen.getByText('Workout 1 Details')).toBeInTheDocument();
      expect(screen.getByText('Push-ups')).toBeInTheDocument();
      expect(screen.getByText('Squats')).toBeInTheDocument();
    });
  });

  // Test error handling
  it('should handle API errors gracefully', async () => {
    // Override the server response for this test
    server.use(
      rest.get('/api/workouts', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );
    
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <ExampleProvider>
          <MemoryRouter initialEntries={['/workouts']}>
            <Routes>
              <Route path="/workouts" element={<WorkoutList />} />
            </Routes>
          </MemoryRouter>
        </ExampleProvider>
      </QueryClientProvider>
    );
    
    // Assert - Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/error loading workouts/i)).toBeInTheDocument();
    });
  });

  // Test offline functionality
  it('should work offline using cached data', async () => {
    // First load data normally
    render(
      <QueryClientProvider client={queryClient}>
        <ExampleProvider>
          <MemoryRouter initialEntries={['/workouts']}>
            <Routes>
              <Route path="/workouts" element={<WorkoutList />} />
            </Routes>
          </MemoryRouter>
        </ExampleProvider>
      </QueryClientProvider>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Workout 1')).toBeInTheDocument();
    });
    
    // Clean up
    screen.unmount();
    
    // Simulate offline mode
    server.use(
      rest.get('/api/workouts', (req, res, ctx) => {
        return res(ctx.status(503), ctx.json({ message: 'Service unavailable' }));
      })
    );
    
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    // Render again
    render(
      <QueryClientProvider client={queryClient}>
        <ExampleProvider>
          <MemoryRouter initialEntries={['/workouts']}>
            <Routes>
              <Route path="/workouts" element={<WorkoutList offlineMode={true} />} />
            </Routes>
          </MemoryRouter>
        </ExampleProvider>
      </QueryClientProvider>
    );
    
    // Assert - Check that cached data is displayed with offline indicator
    await waitFor(() => {
      expect(screen.getByText('Workout 1')).toBeInTheDocument();
      expect(screen.getByText(/offline mode/i)).toBeInTheDocument();
    });
    
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });
});
*/
