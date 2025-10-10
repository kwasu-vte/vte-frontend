// * Custom hook to prevent hydration mismatches with React Query
// * Uses the standard pattern but with better state management

import { useState, useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useClientQuery<TData, TError = Error>(
  options: UseQueryOptions<TData, TError>
) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return useQuery({
    ...options,
    enabled: isClient && (options.enabled !== false),
  });
}
