
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Simplified API hook without complex offline sync dependencies
export interface UseApiQueryOptions<TData, TError = Error> {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  offlineSupport?: boolean;
  getOfflineData?: () => Promise<TData>;
}

export interface UseApiMutationOptions<TData, TVariables, TError = Error> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  offlineSupport?: boolean;
}

export function useApiQuery<TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: UseApiQueryOptions<TData, TError>
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  });
}

export function useApiMutation<TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseApiMutationOptions<TData, TVariables, TError>
) {
  return useMutation({
    mutationFn,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
