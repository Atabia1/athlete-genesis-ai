/**
 * API Hook
 * 
 * This hook provides a standardized way to make API requests with React Query integration.
 * It includes error handling, loading states, and automatic retries.
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '@/shared/utils/error-handling';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { RetryOperationType, RetryPriority } from '@/context/OfflineSyncContext';

/**
 * Options for useApiQuery
 */
export interface UseApiQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> {
  /**
   * Whether to enable offline support
   * @default false
   */
  offlineSupport?: boolean;
  
  /**
   * Function to get data from offline storage
   */
  getOfflineData?: () => Promise<TData | null>;
  
  /**
   * Whether to show error toast
   * @default true
   */
  showErrorToast?: boolean;
}

/**
 * Options for useApiMutation
 */
export interface UseApiMutationOptions<TData, TVariables, TError> extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  /**
   * Whether to enable offline support
   * @default false
   */
  offlineSupport?: boolean;
  
  /**
   * Function to save data to offline storage
   */
  saveOfflineData?: (data: TData) => Promise<void>;
  
  /**
   * Retry operation type for offline queue
   */
  retryOperationType?: RetryOperationType;
  
  /**
   * Retry priority for offline queue
   * @default 'medium'
   */
  retryPriority?: RetryPriority;
  
  /**
   * Whether to show error toast
   * @default true
   */
  showErrorToast?: boolean;
  
  /**
   * Whether to show success toast
   * @default false
   */
  showSuccessToast?: boolean;
  
  /**
   * Success toast message
   */
  successToastMessage?: string;
}

/**
 * Hook for making API queries with React Query
 */
export function useApiQuery<TData, TError = ApiError>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options: UseApiQueryOptions<TData, TError> = {}
) {
  const { isOnline } = useOfflineSync();
  const {
    offlineSupport = false,
    getOfflineData,
    showErrorToast = true,
    ...queryOptions
  } = options;
  
  return useQuery<TData, TError, TData>({
    queryKey,
    queryFn: async () => {
      // If offline and offline support is enabled
      if (!isOnline && offlineSupport) {
        // Try to get data from offline storage
        if (getOfflineData) {
          const offlineData = await getOfflineData();
          
          if (offlineData) {
            return offlineData;
          }
        }
        
        throw new ApiError(
          'You are offline and this data is not available offline',
          0,
          'OFFLINE_DATA_UNAVAILABLE',
          { queryKey }
        );
      }
      
      // Otherwise, make the API request
      return queryFn();
    },
    ...queryOptions,
    onError: (error) => {
      // Handle error
      if (showErrorToast && error instanceof ApiError) {
        // Show error toast
      }
      
      // Call the original onError handler
      if (queryOptions.onError) {
        queryOptions.onError(error as TError);
      }
    },
  });
}

/**
 * Hook for making API mutations with React Query
 */
export function useApiMutation<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiMutationOptions<TData, TVariables, TError> = {}
) {
  const queryClient = useQueryClient();
  const { isOnline, addToQueue } = useOfflineSync();
  const {
    offlineSupport = false,
    saveOfflineData,
    retryOperationType,
    retryPriority = 'medium',
    showErrorToast = true,
    showSuccessToast = false,
    successToastMessage,
    ...mutationOptions
  } = options;
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      // If offline and offline support is enabled
      if (!isOnline && offlineSupport) {
        // If retry operation type is provided, add to queue
        if (retryOperationType) {
          addToQueue({
            type: retryOperationType,
            payload: variables,
            priority: retryPriority,
            maxRetries: 5,
          });
          
          // Return a mock response
          return {} as TData;
        }
        
        throw new ApiError(
          'You are offline and this operation cannot be performed offline',
          0,
          'OFFLINE_OPERATION_UNAVAILABLE',
          { variables }
        );
      }
      
      // Otherwise, make the API request
      const result = await mutationFn(variables);
      
      // If offline support is enabled, save data to offline storage
      if (offlineSupport && saveOfflineData) {
        await saveOfflineData(result);
      }
      
      return result;
    },
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      // Show success toast if enabled
      if (showSuccessToast) {
        // Show success toast with successToastMessage
      }
      
      // Call the original onSuccess handler
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Handle error
      if (showErrorToast && error instanceof ApiError) {
        // Show error toast
      }
      
      // Call the original onError handler
      if (mutationOptions.onError) {
        mutationOptions.onError(error as TError, variables, context);
      }
    },
  });
}

/**
 * Hook for invalidating queries
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    /**
     * Invalidate queries by key
     */
    invalidateQueries: (queryKey: unknown[]) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    
    /**
     * Invalidate all queries
     */
    invalidateAllQueries: () => {
      return queryClient.invalidateQueries();
    },
    
    /**
     * Reset queries by key
     */
    resetQueries: (queryKey: unknown[]) => {
      return queryClient.resetQueries({ queryKey });
    },
    
    /**
     * Reset all queries
     */
    resetAllQueries: () => {
      return queryClient.resetQueries();
    },
    
    /**
     * Clear cache
     */
    clearCache: () => {
      return queryClient.clear();
    },
  };
}
