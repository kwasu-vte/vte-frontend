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
  return (
    <StateRenderer
      data={data}
      isLoading={isLoading}
      error={error}
      loadingComponent={loadingComponent || <DefaultLoadingComponent />}
      errorComponent={errorComponent || <DefaultErrorComponent error={error!} />}
      emptyComponent={emptyComponent || <DefaultEmptyComponent message={emptyMessage} actionButton={emptyActionButton} />}
    >
      {(items) => (
        <Table
          aria-label="Data table"
          selectionMode="single"
          onRowAction={(key) => {
            if (onRowClick) {
              const item = items.find((_, index) => index.toString() === key);
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
          <TableBody items={items}>
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
      )}
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
