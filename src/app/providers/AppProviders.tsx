
/**
 * AppProviders
 *
 * This component consolidates all providers into a single component.
 * It reduces the nesting of providers and improves the readability of the code.
 */

import { ReactNode, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { BrowserRouter } from 'react-router-dom';
import { GlobalErrorBoundary } from '@/components/error-boundary/GlobalErrorBoundary';
import { SkipToContent } from '@/shared/components/accessibility';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { OfflineSyncProvider } from '@/context/OfflineSyncContext';
import { PlanProvider } from '@/context/PlanContext';
import { UserProvider } from '@/context/UserContext';
import { FeatureAccessProvider } from '@/context/FeatureAccessContext';
import RetryQueueBanner from '@/components/ui/retry-queue-banner';
import { SyncBanner } from '@/components/ui/sync-banner';
import { OfflineModeIndicator } from '@/components/ui/offline-mode-indicator';

// Loading component for suspense
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-athleteBlue-600"></div>
  </div>
);

// Create a default query client
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      meta: {
        errorHandler: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
    mutations: {
      retry: 1,
      meta: {
        errorHandler: (error: Error) => {
          console.error('Mutation error:', error);
        }
      }
    }
  }
});

interface AppProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
  withRouter?: boolean;
  withSuspense?: boolean;
}

/**
 * AppProviders component
 *
 * @param children - The child components to render
 * @param queryClient - Optional custom query client
 * @param withRouter - Whether to include the router provider
 * @param withSuspense - Whether to wrap children in Suspense
 */
export function AppProviders({
  children,
  queryClient = defaultQueryClient,
  withRouter = true,
  withSuspense = true,
}: AppProvidersProps): JSX.Element {
  // Create the base providers that are always included
  const baseProviders = (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserPreferencesProvider>
            <Toaster />
            <Sonner />
            <SkipToContent />
            <UserProvider>
              <PlanProvider>
                <FeatureAccessProvider>
                  <OfflineSyncProvider>
                    {children}
                    <RetryQueueBanner />
                    <SyncBanner />
                    <OfflineModeIndicator position="bottom" />
                  </OfflineSyncProvider>
                </FeatureAccessProvider>
              </PlanProvider>
            </UserProvider>
          </UserPreferencesProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );

  // Add suspense if requested
  const withSuspenseProviders = withSuspense ? (
    <Suspense fallback={<Loading />}>
      {baseProviders}
    </Suspense>
  ) : baseProviders;

  // Add router if requested
  return withRouter ? (
    <BrowserRouter>
      {withSuspenseProviders}
    </BrowserRouter>
  ) : withSuspenseProviders;
}

/**
 * AppProvidersWithRouter component
 *
 * This is a convenience component that includes the router provider.
 *
 * @param children - The child components to render
 * @param queryClient - Optional custom query client
 */
export function AppProvidersWithRouter({
  children,
  queryClient = defaultQueryClient,
}: Omit<AppProvidersProps, 'withRouter'>): JSX.Element {
  return (
    <AppProviders queryClient={queryClient} withRouter={true}>
      {children}
    </AppProviders>
  );
}

/**
 * AppProvidersWithoutRouter component
 *
 * This is a convenience component that excludes the router provider.
 * Useful for testing or when the router is provided elsewhere.
 *
 * @param children - The child components to render
 * @param queryClient - Optional custom query client
 */
export function AppProvidersWithoutRouter({
  children,
  queryClient = defaultQueryClient,
}: Omit<AppProvidersProps, 'withRouter'>): JSX.Element {
  return (
    <AppProviders queryClient={queryClient} withRouter={false}>
      {children}
    </AppProviders>
  );
}
