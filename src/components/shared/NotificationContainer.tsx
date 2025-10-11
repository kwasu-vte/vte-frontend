'use client';

import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Mock context for demo
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const useApp = () => ({
  notifications: [] as Notification[],
  removeNotification: (id: string) => console.log('Remove:', id),
});

export function NotificationContainer() {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        const colorConfig = getNotificationColor(notification.type);

        return (
          <Card
            key={notification.id}
            shadow="lg"
            className={`border-2 ${colorConfig.border} ${colorConfig.bg}`}
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${colorConfig.icon}`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm mb-1 ${colorConfig.text}`}>
                    {notification.title}
                  </h4>
                  <p className={`text-sm ${colorConfig.textSecondary}`}>
                    {notification.message}
                  </p>
                  {notification.action && (
                    <Button
                      size="sm"
                      variant="flat"
                      color={colorConfig.buttonColor}
                      className="mt-3"
                      onPress={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
                
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className={`flex-shrink-0 ${colorConfig.closeButton}`}
                  onPress={() => removeNotification(notification.id)}
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-success-50',
        border: 'border-success-200',
        icon: 'text-success-600',
        text: 'text-success-900',
        textSecondary: 'text-success-700',
        closeButton: 'text-success-600 hover:bg-success-100',
        buttonColor: 'success' as const,
      };
    case 'error':
      return {
        bg: 'bg-danger-50',
        border: 'border-danger-200',
        icon: 'text-danger-600',
        text: 'text-danger-900',
        textSecondary: 'text-danger-700',
        closeButton: 'text-danger-600 hover:bg-danger-100',
        buttonColor: 'danger' as const,
      };
    case 'warning':
      return {
        bg: 'bg-warning-50',
        border: 'border-warning-200',
        icon: 'text-warning-600',
        text: 'text-warning-900',
        textSecondary: 'text-warning-700',
        closeButton: 'text-warning-600 hover:bg-warning-100',
        buttonColor: 'warning' as const,
      };
    case 'info':
    default:
      return {
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        icon: 'text-primary-600',
        text: 'text-primary-900',
        textSecondary: 'text-primary-700',
        closeButton: 'text-primary-600 hover:bg-primary-100',
        buttonColor: 'primary' as const,
      };
  }
}