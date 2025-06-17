
import { useQuery, useMutation } from '@tanstack/react-query';

export interface UseApiQueryOptions<TData> {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  offlineSupport?: boolean;
  getOfflineData?: () => Promise<TData>;
}

export interface UseApiMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  offlineSupport?: boolean;
}

export function useApiQuery<TData>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: UseApiQueryOptions<TData>
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  });
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseApiMutationOptions<TData, TVariables>
) {
  return useMutation({
    mutationFn,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
