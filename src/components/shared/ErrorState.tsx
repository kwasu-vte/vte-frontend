// * ErrorState Component
// * Displays error information with retry functionality
// * Used for handling API errors and network failures

'use client';

import React from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { AlertCircle, RefreshCw, Wifi, Server, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  onReport?: () => void;
  title?: string;
  description?: string;
  variant?: 'default' | 'network' | 'server' | 'validation' | 'permission';
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function ErrorState({
  error,
  onRetry,
  onReport,
  title,
  description,
  variant = 'default',
  size = 'md',
  showDetails = false,
  className = '',
}: ErrorStateProps) {
  // * Parse error message
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'object' && error.stack ? error.stack : null;

  // * Size variants
  const sizeVariants = {
    sm: {
      container: 'p-4',
      iconSize: 'w-8 h-8',
      titleSize: 'text-base',
      descriptionSize: 'text-sm',
      spacing: 'space-y-3',
    },
    md: {
      container: 'p-6',
      iconSize: 'w-12 h-12',
      titleSize: 'text-lg',
      descriptionSize: 'text-base',
      spacing: 'space-y-4',
    },
    lg: {
      container: 'p-8',
      iconSize: 'w-16 h-16',
      titleSize: 'text-xl',
      descriptionSize: 'text-lg',
      spacing: 'space-y-6',
    },
  };

  // * Variant configurations
  const variantConfigs = {
    default: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: title || 'Something went wrong',
      description: description || 'An unexpected error occurred. Please try again.',
    },
    network: {
      icon: Wifi,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      title: title || 'Connection error',
      description: description || 'Please check your internet connection and try again.',
    },
    server: {
      icon: Server,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: title || 'Server error',
      description: description || 'The server is experiencing issues. Please try again later.',
    },
    validation: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: title || 'Validation error',
      description: description || 'Please check your input and try again.',
    },
    permission: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: title || 'Access denied',
      description: description || 'You don\'t have permission to perform this action.',
    },
  };

  const sizes = sizeVariants[size];
  const config = variantConfigs[variant];
  const Icon = config.icon;

  return (
    <Card
      className={`
        ${config.bgColor} ${config.borderColor} border
        ${className}
      `}
    >
      <CardBody className={`${sizes.container}`}>
        <div className={`flex flex-col items-center text-center ${sizes.spacing}`}>
          {/* * Error Icon */}
          <div className={`${config.iconColor} ${sizes.iconSize}`}>
            <Icon className="w-full h-full" />
          </div>

          {/* * Error Content */}
          <div className="space-y-2">
            <h3 className={`${sizes.titleSize} font-semibold text-neutral-900`}>
              {config.title}
            </h3>
            <p className={`${sizes.descriptionSize} text-neutral-600 max-w-md`}>
              {config.description}
            </p>
          </div>

          {/* * Error Details (if enabled) */}
          {showDetails && errorMessage && (
            <div className="w-full max-w-md">
              <details className="text-left">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Show error details
                </summary>
                <div className="mt-2 p-3 bg-neutral-100 rounded text-xs font-mono text-neutral-600 overflow-auto">
                  <div className="mb-2">
                    <strong>Message:</strong> {errorMessage}
                  </div>
                  {errorStack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">{errorStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* * Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button
                color="primary"
                startContent={<RefreshCw className="w-4 h-4" />}
                onClick={onRetry}
              >
                Try Again
              </Button>
            )}
            {onReport && (
              <Button
                variant="light"
                onClick={onReport}
              >
                Report Issue
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// * Specialized Error States
export function NetworkErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      error="Network connection failed"
      onRetry={onRetry}
      variant="network"
      title="No internet connection"
      description="Please check your internet connection and try again."
    />
  );
}

export function ServerErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      error="Server error occurred"
      onRetry={onRetry}
      variant="server"
      title="Server temporarily unavailable"
      description="Our servers are experiencing issues. Please try again in a few minutes."
    />
  );
}

export function ValidationErrorState({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry: () => void; 
}) {
  return (
    <ErrorState
      error={error}
      onRetry={onRetry}
      variant="validation"
      title="Invalid input"
      description="Please check your input and try again."
    />
  );
}

export function PermissionErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      error="Insufficient permissions"
      onRetry={onRetry}
      variant="permission"
      title="Access denied"
      description="You don't have permission to perform this action. Contact your administrator if you believe this is an error."
    />
  );
}

// * API Error Handler
export function ApiErrorState({ 
  error, 
  onRetry 
}: { 
  error: any; 
  onRetry: () => void; 
}) {
  // * Determine error type based on status code
  const getErrorVariant = (status?: number) => {
    if (!status) return 'default';
    if (status >= 400 && status < 500) return 'validation';
    if (status >= 500) return 'server';
    return 'default';
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.status) {
      return `Request failed with status ${error.response.status}`;
    }
    return 'An unexpected error occurred';
  };

  return (
    <ErrorState
      error={getErrorMessage(error)}
      onRetry={onRetry}
      variant={getErrorVariant(error?.response?.status)}
      showDetails={process.env.NODE_ENV === 'development'}
    />
  );
}
