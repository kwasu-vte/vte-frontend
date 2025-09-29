// * DataTable Component
// * Wrapper around NextUI Table with StateRenderer integration
// * Handles loading, empty, and error states internally

'use client';

import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from './StateRenderer';

interface DataTableProps<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  columns: {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  emptyActionButton?: React.ReactNode;
}

export function DataTable<T>({
  data,
  isLoading,
  error,
  columns,
  emptyMessage = "No data found",
  onRowClick,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyActionButton,
}: DataTableProps<T>) {
  console.log('🔍 [DataTable] Received props:', {
    data,
    dataLength: Array.isArray(data) ? data.length : 'not-array',
    isLoading,
    error,
    dataType: typeof data,
    dataIsArray: Array.isArray(data)
  });
  
  return (
    <StateRenderer
      data={data}
      isLoading={isLoading}
      error={error}
      loadingComponent={loadingComponent || <DefaultLoadingComponent />}
      errorComponent={errorComponent || <DefaultErrorComponent error={error!} />}
      emptyComponent={emptyComponent || <DefaultEmptyComponent message={emptyMessage} actionButton={emptyActionButton} />}
    >
      {(items) => {
        // * Handle undefined/null data gracefully
        if (!items) {
          return (
            <div className="p-6 text-center">
              <div className="text-neutral-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No data found</h3>
              <p className="text-neutral-600 mb-4">{emptyMessage}</p>
              {emptyActionButton}
            </div>
          );
        }

        // * Ensure items is an array to prevent "items is not iterable" error
        const safeItems = Array.isArray(items) ? items : [];
        
        // * If it's an empty array, show empty state
        if (safeItems.length === 0) {
          return (
            <div className="p-6 text-center">
              <div className="text-neutral-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No data found</h3>
              <p className="text-neutral-600 mb-4">{emptyMessage}</p>
              {emptyActionButton}
            </div>
          );
        }
        
        return (
          <Table
            aria-label="Data table"
            selectionMode="single"
            onRowAction={(key) => {
              if (onRowClick) {
                const item = safeItems.find((_, index) => index.toString() === key);
                if (item) onRowClick(item);
              }
            }}
            classNames={{
              wrapper: "shadow-sm",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={safeItems}>
              {(item) => (
                <TableRow key={(item as any).id || Math.random()}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        );
      }}
    </StateRenderer>
  );
}

// * Skeleton Row Component for Loading States
export function TableSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-neutral-200 rounded animate-pulse"
              style={{ width: `${Math.random() * 100 + 100}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
