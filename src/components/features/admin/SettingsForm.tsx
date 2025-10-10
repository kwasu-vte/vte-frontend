// * Settings Form Component
// * Handles system configuration form
// * Follows the same pattern as other form components

'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Switch, Button, Divider } from '@heroui/react';
// Deprecated per plan: no SystemConfig API; keep local prop types to avoid leaking types
type SystemConfig = {
  system_name?: string;
  system_description?: string | null;
  admin_email?: string;
  support_email?: string;
  max_file_size?: number | null;
  session_timeout?: string;
  email_daily_limit?: number | null;
  enable_registration?: boolean;
  enable_notifications?: boolean;
  enable_analytics?: boolean;
  enable_backups?: boolean;
  maintenance_mode?: boolean;
}

type UpdateSystemConfigPayload = Partial<SystemConfig>
import { Settings, Database, Mail, Shield, Users, Bell } from 'lucide-react';

interface SettingsFormProps {
  config: SystemConfig;
  onSubmit: (data: UpdateSystemConfigPayload) => void;
  onChange: () => void;
  isLoading?: boolean;
}

export function SettingsForm({
  config,
  onSubmit,
  onChange,
  isLoading = false
}: SettingsFormProps) {
  const [formData, setFormData] = useState({
    system_name: '',
    system_description: '',
    admin_email: '',
    support_email: '',
    max_file_size: '',
    session_timeout: '',
    email_daily_limit: '',
    enable_registration: true,
    enable_notifications: true,
    enable_analytics: true,
    enable_backups: true,
    maintenance_mode: false
  });

  // * Initialize form data
  useEffect(() => {
    if (config) {
      setFormData({
        system_name: config.system_name || '',
        system_description: config.system_description || '',
        admin_email: config.admin_email || '',
        support_email: config.support_email || '',
        max_file_size: config.max_file_size?.toString() || '',
        session_timeout: config.session_timeout || '',
        email_daily_limit: config.email_daily_limit?.toString() || '',
        enable_registration: config.enable_registration ?? true,
        enable_notifications: config.enable_notifications ?? true,
        enable_analytics: config.enable_analytics ?? true,
        enable_backups: config.enable_backups ?? true,
        maintenance_mode: config.maintenance_mode ?? false
      });
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: UpdateSystemConfigPayload = {
      system_name: formData.system_name,
      system_description: formData.system_description,
      admin_email: formData.admin_email,
      support_email: formData.support_email,
      max_file_size: formData.max_file_size ? parseInt(formData.max_file_size) : undefined,
      session_timeout: formData.session_timeout,
      email_daily_limit: formData.email_daily_limit ? parseInt(formData.email_daily_limit) : undefined,
      enable_registration: formData.enable_registration,
      enable_notifications: formData.enable_notifications,
      enable_analytics: formData.enable_analytics,
      enable_backups: formData.enable_backups,
      maintenance_mode: formData.maintenance_mode
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    onChange();
  };

  return (
    <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
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
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="System Name"
              placeholder="Enter system name"
              value={formData.system_name}
              onChange={(e) => handleInputChange('system_name', e.target.value)}
              variant="bordered"
            />
            <Input
              label="Admin Email"
              placeholder="Enter admin email"
              type="email"
              value={formData.admin_email}
              onChange={(e) => handleInputChange('admin_email', e.target.value)}
              variant="bordered"
            />
          </div>
          <Input
            label="System Description"
            placeholder="Enter system description"
            value={formData.system_description}
            onChange={(e) => handleInputChange('system_description', e.target.value)}
            variant="bordered"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Support Email"
              placeholder="Enter support email"
              type="email"
              value={formData.support_email}
              onChange={(e) => handleInputChange('support_email', e.target.value)}
              variant="bordered"
            />
            <Input
              label="Max File Size (MB)"
              placeholder="Enter max file size"
              type="number"
              value={formData.max_file_size}
              onChange={(e) => handleInputChange('max_file_size', e.target.value)}
              variant="bordered"
            />
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
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Session Timeout"
              placeholder="e.g., 24 hours"
              value={formData.session_timeout}
              onChange={(e) => handleInputChange('session_timeout', e.target.value)}
              variant="bordered"
            />
            <Input
              label="Email Daily Limit"
              placeholder="Enter daily email limit"
              type="number"
              value={formData.email_daily_limit}
              onChange={(e) => handleInputChange('email_daily_limit', e.target.value)}
              variant="bordered"
            />
          </div>
        </CardBody>
      </Card>

      {/* * Feature Toggles */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Feature Toggles</h3>
            <p className="text-sm text-neutral-600">Enable or disable system features</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Registration</p>
                <p className="text-sm text-neutral-600">Allow new users to register</p>
              </div>
              <Switch
                isSelected={formData.enable_registration}
                onValueChange={(value) => handleInputChange('enable_registration', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-neutral-600">Send system notifications</p>
              </div>
              <Switch
                isSelected={formData.enable_notifications}
                onValueChange={(value) => handleInputChange('enable_notifications', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Analytics</p>
                <p className="text-sm text-neutral-600">Collect usage analytics</p>
              </div>
              <Switch
                isSelected={formData.enable_analytics}
                onValueChange={(value) => handleInputChange('enable_analytics', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Backups</p>
                <p className="text-sm text-neutral-600">Automated database backups</p>
              </div>
              <Switch
                isSelected={formData.enable_backups}
                onValueChange={(value) => handleInputChange('enable_backups', value)}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* * Maintenance Mode */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Maintenance Mode</h3>
            <p className="text-sm text-neutral-600">System maintenance settings</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-neutral-600">Put the system in maintenance mode</p>
            </div>
            <Switch
              isSelected={formData.maintenance_mode}
              onValueChange={(value) => handleInputChange('maintenance_mode', value)}
              color="danger"
            />
          </div>
        </CardBody>
      </Card>

      {/* * Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={isLoading}
          isDisabled={isLoading}
          className="min-w-32"
        >
          Save Settings
        </Button>
      </div>
    </form>
  );
}
