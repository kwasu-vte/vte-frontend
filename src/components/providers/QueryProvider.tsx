// * React Query Provider
// * Provides React Query client for data fetching and state management
// * Follows the Master Plan requirement for useQuery pattern

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // * Create QueryClient with optimal configuration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // * Stale time: 5 minutes (data is fresh for 5 minutes)
            staleTime: 5 * 60 * 1000,
            // * Cache time: 10 minutes (data stays in cache for 10 minutes)
            gcTime: 10 * 60 * 1000,
            // * Retry failed requests 3 times
            retry: 3,
            // * Refetch on window focus
            refetchOnWindowFocus: false,
            // * Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // * Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
