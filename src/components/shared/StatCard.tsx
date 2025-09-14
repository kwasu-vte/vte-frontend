// * StatCard Component
// * Displays key metrics and statistics in a card format
// * Used for dashboard summaries and key performance indicators

'use client';

import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'neutral',
  size = 'md',
  className = '',
}: StatCardProps) {
  // * Color variants
  const colorVariants = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      icon: 'text-primary-500',
      border: 'border-primary-200',
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-500',
      border: 'border-green-200',
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      icon: 'text-yellow-500',
      border: 'border-yellow-200',
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      icon: 'text-red-500',
      border: 'border-red-200',
    },
    neutral: {
      bg: 'bg-neutral-50',
      text: 'text-neutral-600',
      icon: 'text-neutral-500',
      border: 'border-neutral-200',
    },
  };

  // * Size variants
  const sizeVariants = {
    sm: {
      padding: 'p-4',
      iconSize: 'w-5 h-5',
      titleSize: 'text-sm',
      valueSize: 'text-lg',
      subtitleSize: 'text-xs',
    },
    md: {
      padding: 'p-6',
      iconSize: 'w-6 h-6',
      titleSize: 'text-base',
      valueSize: 'text-2xl',
      subtitleSize: 'text-sm',
    },
    lg: {
      padding: 'p-8',
      iconSize: 'w-8 h-8',
      titleSize: 'text-lg',
      valueSize: 'text-3xl',
      subtitleSize: 'text-base',
    },
  };

  const colors = colorVariants[color];
  const sizes = sizeVariants[size];

  return (
    <Card
      className={`
        ${colors.bg} ${colors.border} border
        hover:shadow-md transition-shadow duration-200
        ${className}
      `}
    >
      <CardBody className={`${sizes.padding}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`${sizes.titleSize} font-medium ${colors.text} mb-1`}>
              {title}
            </p>
            <p className={`${sizes.valueSize} font-bold text-neutral-900 mb-1`}>
              {value}
            </p>
            {subtitle && (
              <p className={`${sizes.subtitleSize} text-neutral-500`}>
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`
                    ${sizes.subtitleSize} font-medium
                    ${trend.isPositive ? 'text-green-600' : 'text-red-600'}
                  `}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className={`${sizes.subtitleSize} text-neutral-500 ml-1`}>
                  vs last period
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`${colors.icon} ${sizes.iconSize} flex-shrink-0 ml-4`}>
              <Icon className="w-full h-full" />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// * StatCard Grid Layout Component
interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatCardGrid({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}: StatCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapSizes = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div
      className={`
        grid ${gridCols[columns]} ${gapSizes[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
