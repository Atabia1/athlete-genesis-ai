
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { PlanProvider } from '@/context/PlanContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { DashboardCustomizationProvider } from '@/context/DashboardCustomizationContext';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders: Main application provider wrapper
 * 
 * This component wraps the application with all necessary context providers:
 * - BrowserRouter for routing
 * - QueryClientProvider for data fetching
 * - ThemeProvider for light/dark mode
 * - PlanProvider for workout planning
 * - UserPreferencesProvider for user settings
 * - DashboardCustomizationProvider for dashboard customization
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" enableSystem>
          <UserPreferencesProvider>
            <PlanProvider>
              <DashboardCustomizationProvider>
                {children}
              </DashboardCustomizationProvider>
            </PlanProvider>
          </UserPreferencesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
