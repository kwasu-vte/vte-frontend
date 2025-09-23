// * StateRenderer Component
// * This component handles all four states for data-displaying components
// * Non-negotiable: Every data component MUST use this pattern

import React from 'react';

interface StateRendererProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
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
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
}: StateRendererProps<T>) {
  // * State 1: Loading
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // * State 2: Error
  if (error) {
    return <>{errorComponent}</>;
  }

  // * State 3: Empty - Only show empty state for explicitly empty arrays
  // * Don't show empty state for undefined data (which happens during initial load)
  if (Array.isArray(data) && data.length === 0) {
    return <>{emptyComponent}</>;
  }

  // * State 4: Success - Render the data (including undefined/null data)
  // * Let the child component handle undefined/null data gracefully
  return children(data as NonNullable<T>);
}

// * Default Components for Common States
export const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-3 text-neutral-600">Loading...</span>
  </div>
);

export const DefaultErrorComponent = ({ error, onRetry }: { error: Error; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-error text-6xl mb-4">⚠️</div>
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
    <div className="text-neutral-400 text-6xl mb-4">📭</div>
    <h3 className="text-xl font-semibold text-neutral-900 mb-2">No data found</h3>
    <p className="text-neutral-600 mb-4">{message}</p>
    {actionButton}
  </div>
);
