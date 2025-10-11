'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'neutral',
  className = '',
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    danger: 'bg-danger-50 border-danger-200',
    neutral: 'bg-default-50 border-default-200',
  };

  const iconColorClasses = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600',
    neutral: 'text-default-600',
  };

  return (
    <Card
      shadow="none"
      className={`border ${colorClasses[color]} ${className}`}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-default-600 uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-default-900 mb-0.5">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-default-500">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={`flex-shrink-0 ${iconColorClasses[color]}`}>
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatCardGrid({
  children,
  columns = 4,
  className = '',
}: StatCardGridProps) {
  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridColsClasses[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
}