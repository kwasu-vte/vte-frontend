// * Reusable Skeleton Components
// * Provides consistent loading placeholders for lists, cards, and tables

'use client'

import React from 'react'
import { Skeleton } from '@heroui/react'

export type ListSkeletonProps = {
  rows?: number
  className?: string
}

export function ListSkeleton({ rows = 5, className }: ListSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="py-3">
          <Skeleton className="h-5 w-2/3 rounded-md mb-2" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export type CardGridSkeletonProps = {
  items?: number
  className?: string
}

export function CardGridSkeleton({ items = 6, className }: CardGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className ?? ''}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="border rounded-md p-4">
          <Skeleton className="h-5 w-1/3 rounded-md mb-3" />
          <Skeleton className="h-4 w-full rounded-md mb-2" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export type TableSkeletonProps = {
  rows?: number
  cols?: number
  className?: string
}

export function TableSkeleton({ rows = 8, cols = 5, className }: TableSkeletonProps) {
  return (
    <div className={className}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={`h-${c}`} className="h-5 rounded-md m-2" />
        ))}
        {Array.from({ length: rows }).map((_, r) => (
          <React.Fragment key={`r-${r}`}>
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={`c-${r}-${c}`} className="h-4 rounded-md m-2" />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}


