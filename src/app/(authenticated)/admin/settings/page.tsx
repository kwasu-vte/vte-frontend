// * Admin Settings Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as other admin pages

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { SettingsForm } from '@/components/features/admin/SettingsForm';
import { api } from '@/lib/api';
import { SystemConfig, UpdateSystemConfigPayload } from '@/lib/types';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { Save, RefreshCw, Settings, Database, Mail, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching
  const {
    data: systemConfig,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: async () => {
      const response = await api.getSystemConfig();
      return response.data;
    },
  });

  // * Update system config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (data: UpdateSystemConfigPayload) => {
      const response = await api.updateSystemConfig(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
      setHasChanges(false);
    },
    onError: (error) => {
      console.error('Error updating system config:', error);
    },
  });

  // * Handle save settings
  const handleSaveSettings = async (data: UpdateSystemConfigPayload) => {
    setIsSubmitting(true);
    try {
      await updateConfigMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle form change
  const handleFormChange = () => {
    setHasChanges(true);
  };

  // * Reset form
  const handleResetForm = () => {
    setHasChanges(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">System Settings</h1>
          <p className="text-neutral-600 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="secondary"
            startContent={<RefreshCw className="w-4 h-4" />}
            onPress={handleResetForm}
            isDisabled={isLoading}
          >
            Reset
          </Button>
          <Button
            color="primary"
            startContent={<Save className="w-4 h-4" />}
            onPress={() => {
              // This will be handled by the SettingsForm component
              const form = document.getElementById('settings-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            isLoading={isSubmitting}
            isDisabled={!hasChanges || isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* * Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* * General Settings */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">General Settings</h3>
              <p className="text-sm text-neutral-600">Basic system configuration</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-sm text-neutral-600">
                <p><strong>System Name:</strong> {systemConfig?.system_name || 'VTE Platform'}</p>
                <p><strong>Version:</strong> {systemConfig?.version || '1.0.0'}</p>
                <p><strong>Environment:</strong> {systemConfig?.environment || 'production'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* * Database Settings */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Database Settings</h3>
              <p className="text-sm text-neutral-600">Database configuration</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-sm text-neutral-600">
                <p><strong>Status:</strong> <span className="text-green-600">Connected</span></p>
                <p><strong>Type:</strong> PostgreSQL</p>
                <p><strong>Last Backup:</strong> {systemConfig?.last_backup || 'Never'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* * Email Settings */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Mail className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email Settings</h3>
              <p className="text-sm text-neutral-600">Email configuration</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-sm text-neutral-600">
                <p><strong>Provider:</strong> {systemConfig?.email_provider || 'SMTP'}</p>
                <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                <p><strong>Daily Limit:</strong> {systemConfig?.email_daily_limit || '1000'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* * Security Settings */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <p className="text-sm text-neutral-600">Security configuration</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="text-sm text-neutral-600">
                <p><strong>SSL:</strong> <span className="text-green-600">Enabled</span></p>
                <p><strong>Rate Limiting:</strong> <span className="text-green-600">Active</span></p>
                <p><strong>Session Timeout:</strong> {systemConfig?.session_timeout || '24 hours'}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* * Settings Form with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={systemConfig}
          isLoading={isLoading}
          error={error}
          loadingComponent={
            <div className="p-6">
              <DefaultLoadingComponent />
            </div>
          }
          errorComponent={
            <div className="p-6">
              <DefaultErrorComponent 
                error={error!} 
                onRetry={() => refetch()} 
              />
            </div>
          }
          emptyComponent={
            <div className="p-6">
              <DefaultEmptyComponent 
                message="No system configuration found. Please contact support."
              />
            </div>
          }
        >
          {(data) => (
            <SettingsForm
              config={data}
              onSubmit={handleSaveSettings}
              onChange={handleFormChange}
              isLoading={isSubmitting}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Has Changes:</strong> {hasChanges ? 'Yes' : 'No'}</p>
          <p><strong>Query Key:</strong> [&apos;systemConfig&apos;]</p>
          <p><strong>Mutation:</strong> Update: {updateConfigMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
