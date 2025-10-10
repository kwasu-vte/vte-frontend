// * Mentor Modal Component
// * Handles creating and editing mentors
// * Follows the same pattern as SkillModal, GroupModal, and StudentModal

'use client';

import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Input, Select, SelectItem, Textarea, Tooltip } from '@heroui/react';
import { User, CreateMentorProfilePayload, UpdateUserPayload, MentorProfile } from '@/lib/types';
import { getSpecializationOptions } from '@/lib/utils/specialization';

interface MentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMentorProfilePayload | UpdateUserPayload) => void;
  mentor?: MentorProfile | null;
  isLoading?: boolean;
}

export function MentorModal({
  isOpen,
  onClose,
  onSubmit,
  mentor,
  isLoading = false
}: MentorModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    specialization: '',
    phone: '',
    is_available: true,
    is_active: true,
    meta: ''
  });

  // * Reset form when modal opens/closes or mentor changes
  useEffect(() => {
    if (isOpen) {
      if (mentor) {
        setFormData({
          first_name: mentor.user.first_name,
          last_name: mentor.user.last_name,
          email: mentor.user.email,
          password: '',
          password_confirmation: '',
          specialization: mentor.specialization || '',
          phone: mentor.phone || '',
          is_available: mentor.is_available,
          is_active: mentor.is_active,
          meta: mentor.meta ? (Array.isArray(mentor.meta) ? mentor.meta.join(', ') : String(mentor.meta)) : ''
        });
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          password_confirmation: '',
          specialization: '',
          phone: '',
          is_available: true,
          is_active: true,
          meta: ''
        });
      }
    }
  }, [isOpen, mentor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.specialization) {
      return;
    }

    // * For new mentors, password is required
    if (!mentor && (!formData.password || !formData.password_confirmation)) {
      return;
    }

    // * Validate password match for new mentors
    if (!mentor && formData.password !== formData.password_confirmation) {
      return;
    }

    const submitData: CreateMentorProfilePayload | UpdateUserPayload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      specialization: formData.specialization,
      phone: formData.phone || null,
      is_available: formData.is_available,
      is_active: formData.is_active,
      meta: formData.meta || null,
      ...(mentor ? {} : {
        password: formData.password,
        password_confirmation: formData.password_confirmation
      })
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.first_name && formData.last_name && formData.email && formData.specialization && 
    (mentor ? true : formData.password && formData.password_confirmation);

  const isPasswordMatch = !formData.password || !formData.password_confirmation || 
    formData.password === formData.password_confirmation;

  const specializationOptions = getSpecializationOptions();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="lg">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            {mentor ? 'Edit Mentor' : 'Add New Mentor'}
          </h2>
          <p className="text-sm text-neutral-600">
            {mentor ? 'Update mentor information' : 'Fill in the details to add a new mentor'}
          </p>
        </DrawerHeader>
        <form onSubmit={handleSubmit}>
          <DrawerBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                // label="First Name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                isRequired
                variant="bordered"
              />
              <Input
                // label="Last Name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                isRequired
                variant="bordered"
              />
            </div>

            <Input
              // label="Email"
              placeholder="Enter email address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              isRequired
              variant="bordered"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
            <Select
  placeholder="Mentorship"
  selectedKeys={["mentorship"]} // Hardcode the default value
  onSelectionChange={(keys) => {
    const selectedKey = Array.from(keys)[0] as string;
    handleInputChange('specialization', selectedKey);
  }}
  isRequired
  variant="bordered"
  isDisabled // Makes it read-only
  disallowEmptySelection // Keeps the selection locked
>
  <SelectItem key="mentorship" value="mentorship">
    Mentorship
  </SelectItem>
</Select>

     <Input
                // label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                variant="bordered"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => handleInputChange('is_available', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_available" className="text-sm font-medium">
                  Available for assignment
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Active mentor
                </label>
              </div>
            </div>

            <Textarea
              // label="Meta Information"
              placeholder="Additional notes or metadata (optional)"
              value={formData.meta}
              onChange={(e) => handleInputChange('meta', e.target.value)}
              variant="bordered"
              minRows={2}
            />

            {!mentor && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  // label="Password"
                  placeholder="Enter password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  isRequired={!mentor}
                  variant="bordered"
                />
                <Input
                  // label="Confirm Password"
                  placeholder="Confirm password"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                  isRequired={!mentor}
                  variant="bordered"
                  color={formData.password_confirmation && !isPasswordMatch ? 'danger' : 'default'}
                  errorMessage={formData.password_confirmation && !isPasswordMatch ? 'Passwords do not match' : ''}
                />
              </div>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Tooltip content="Close without saving" placement="top">
              <Button
                variant="light"
                onClick={onClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
            </Tooltip>
            <Tooltip content={mentor ? 'Save changes' : 'Create mentor'} placement="top">
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
                isDisabled={!isFormValid || !isPasswordMatch || isLoading}
              >
                {mentor ? 'Update Mentor' : 'Add Mentor'}
              </Button>
            </Tooltip>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
