// * EmptyState Component
// * Displays when there's no data to show
// * Provides clear messaging and optional action buttons

'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionButton?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'illustrated';
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  icon: Icon,
  actionButton,
  size = 'md',
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  // * Size variants
  const sizeVariants = {
    sm: {
      container: 'p-6',
      iconSize: 'w-12 h-12',
      titleSize: 'text-lg',
      descriptionSize: 'text-sm',
      spacing: 'space-y-3',
    },
    md: {
      container: 'p-8',
      iconSize: 'w-16 h-16',
      titleSize: 'text-xl',
      descriptionSize: 'text-base',
      spacing: 'space-y-4',
    },
    lg: {
      container: 'p-12',
      iconSize: 'w-20 h-20',
      titleSize: 'text-2xl',
      descriptionSize: 'text-lg',
      spacing: 'space-y-6',
    },
  };

  // * Variant styles
  const variantStyles = {
    default: {
      container: 'bg-white border border-neutral-200 rounded-lg',
      iconColor: 'text-neutral-400',
      titleColor: 'text-neutral-900',
      descriptionColor: 'text-neutral-600',
    },
    minimal: {
      container: 'bg-transparent',
      iconColor: 'text-neutral-300',
      titleColor: 'text-neutral-700',
      descriptionColor: 'text-neutral-500',
    },
    illustrated: {
      container: 'bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 rounded-xl',
      iconColor: 'text-primary-600',
      titleColor: 'text-neutral-900',
      descriptionColor: 'text-neutral-600',
    },
  };

  const sizes = sizeVariants[size];
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${sizes.container} ${styles.container}
        ${className}
      `}
    >
      <div className={`${sizes.spacing}`}>
        {/* * Icon */}
        {Icon && (
          <div className={`${styles.iconColor} ${sizes.iconSize} mx-auto`}>
            <Icon className="w-full h-full" />
          </div>
        )}

        {/* * Content */}
        <div className="space-y-2">
          <h3 className={`${sizes.titleSize} font-semibold ${styles.titleColor}`}>
            {title}
          </h3>
          <p className={`${sizes.descriptionSize} ${styles.descriptionColor} max-w-md`}>
            {description}
          </p>
        </div>

        {/* * Action Button */}
        {actionButton && (
          <div className="pt-2">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}

// * Predefined Empty States for Common Scenarios
export function EmptySkillsState({ onCreateSkill }: { onCreateSkill: () => void }) {
  return (
    <EmptyState
      title="No skills found"
      description="Get started by creating your first vocational skill. Students will be able to enroll in skills you create."
      icon={require('lucide-react').BookOpen}
      actionButton={
        <Button
          color="primary"
          onClick={onCreateSkill}
        >
          Create First Skill
        </Button>
      }
    />
  );
}

export function EmptyStudentsState({ onAddStudent }: { onAddStudent: () => void }) {
  return (
    <EmptyState
      title="No students found"
      description="No students have been added to the system yet. Add students to start managing enrollments."
      icon={require('lucide-react').Users}
      actionButton={
        <Button
          color="primary"
          onClick={onAddStudent}
        >
          Add Students
        </Button>
      }
    />
  );
}

export function EmptyGroupsState({ onCreateGroup }: { onCreateGroup: () => void }) {
  return (
    <EmptyState
      title="No groups found"
      description="Groups help organize students for practical sessions. Create a group to get started."
      icon={require('lucide-react').UserCheck}
      actionButton={
        <Button
          color="primary"
          onClick={onCreateGroup}
        >
          Create Group
        </Button>
      }
    />
  );
}

export function EmptyAttendanceState({ onTakeAttendance }: { onTakeAttendance: () => void }) {
  return (
    <EmptyState
      title="No attendance records"
      description="Attendance records will appear here once you start taking attendance for your groups."
      icon={require('lucide-react').ClipboardCheck}
      actionButton={
        <Button
          color="primary"
          onClick={onTakeAttendance}
        >
          Take Attendance
        </Button>
      }
    />
  );
}

export function EmptyPaymentsState({ onViewPayments }: { onViewPayments: () => void }) {
  return (
    <EmptyState
      title="No payment records"
      description="Payment records will appear here once students start making payments for their enrollments."
      icon={require('lucide-react').CreditCard}
      actionButton={
        <Button
          color="primary"
          onClick={onViewPayments}
        >
          View All Payments
        </Button>
      }
    />
  );
}

// * Search Empty State
export function EmptySearchState({ 
  searchTerm, 
  onClearSearch 
}: { 
  searchTerm: string; 
  onClearSearch: () => void; 
}) {
  return (
    <EmptyState
      title={`No results for "${searchTerm}"`}
      description="Try adjusting your search terms or filters to find what you're looking for."
      icon={require('lucide-react').Search}
      actionButton={
        <Button
          variant="light"
          onClick={onClearSearch}
        >
          Clear Search
        </Button>
      }
      variant="minimal"
    />
  );
}

// * Error Empty State
export function EmptyErrorState({ 
  onRetry 
}: { 
  onRetry: () => void; 
}) {
  return (
    <EmptyState
      title="Something went wrong"
      description="We couldn't load the data. Please try again or contact support if the problem persists."
      icon={require('lucide-react').AlertCircle}
      actionButton={
        <Button
          color="primary"
          onClick={onRetry}
        >
          Try Again
        </Button>
      }
      variant="minimal"
    />
  );
}
