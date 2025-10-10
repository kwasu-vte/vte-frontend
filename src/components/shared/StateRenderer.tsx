// * StateRenderer Component
// * This component handles all four states for data-displaying components
// * Non-negotiable: Every data component MUST use this pattern

'use client';

import React from 'react';
import { Loader2, AlertTriangle, FolderOpen } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

interface StateRendererProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  // Slots (as render props/children)
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: (data: NonNullable<T>) => React.ReactNode; // Success component
}

export function StateRenderer<T>({
  data,
  isLoading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
}: StateRendererProps<T>) {
  console.log('[StateRenderer] Decision logic:', {
    data,
    dataLength: Array.isArray(data) ? data.length : 'not-array',
    isLoading,
    error,
    dataIsNull: data == null,
    dataIsArray: Array.isArray(data),
    dataIsEmptyArray: Array.isArray(data) && data.length === 0,
    condition1: isLoading,
    condition2: !!error,
    condition3: Array.isArray(data) && data.length === 0
  });

  return (
    <ClientOnly fallback={<DefaultLoadingComponent />}>
      {/* * Show loading state only when explicitly loading */}
      {isLoading && (
        <>
          {console.log('[StateRenderer] Showing LOADING state')}
          {loadingComponent ?? <DefaultLoadingComponent />}
        </>
      )}

      {/* * Show error state */}
      {!isLoading && error && (
        <>
          {console.log('[StateRenderer] Showing ERROR state')}
          {errorComponent ?? <DefaultErrorComponent error={error} onRetry={onRetry} />}
        </>
      )}

      {/* * Show empty state for null/undefined or empty arrays when not loading and no error */}
      {!isLoading && !error && (data == null || (Array.isArray(data) && data.length === 0)) && (
        <>
          {console.log('[StateRenderer] Showing EMPTY state')}
          {emptyComponent ?? <DefaultEmptyComponent message="No items to display." />}
        </>
      )}

      {/* * Show data */}
      {!isLoading && !error && data != null && !(Array.isArray(data) && data.length === 0) && (
        <>
          {console.log('[StateRenderer] Showing DATA state with:', data)}
          {children(data as NonNullable<T>)}
        </>
      )}
    </ClientOnly>
  );
}

// * Default Components for Common States
export const DefaultLoadingComponent = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-neutral-400 mb-4">
      <Loader2 className="w-16 h-16 animate-spin" />
    </div>
    <span className="text-neutral-600">Loading...</span>
  </div>
);

export const DefaultErrorComponent = ({ error, onRetry }: { error: Error; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-500 mb-4">
      <AlertTriangle className="w-16 h-16" />
    </div>
    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Something went wrong</h3>
    <p className="text-neutral-600 mb-4">{error.message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-600 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export const DefaultEmptyComponent = ({ message, actionButton }: { message: string; actionButton?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-neutral-400 mb-4">
      <FolderOpen className="w-16 h-16" />
    </div>
    <h3 className="text-xl font-semibold text-neutral-900 mb-2">No data found</h3>
    <p className="text-neutral-600 mb-4">{message}</p>
    {actionButton}
  </div>
);
