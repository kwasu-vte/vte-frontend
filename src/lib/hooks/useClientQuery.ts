// * Custom hook to prevent hydration mismatches with React Query
// * Uses the standard pattern but with better state management

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useClientQuery<TData, TError = Error>(
  options: UseQueryOptions<TData, TError>
) {
  return useQuery({
    ...options,
    enabled: typeof window !== 'undefined' && (options.enabled !== false),
  });
}