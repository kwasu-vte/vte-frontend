// * Mentor Modal Component
// * Handles creating and editing mentors
// * Follows the same pattern as SkillModal, GroupModal, and StudentModal

'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { User, CreateUserPayload, UpdateUserPayload } from '@/lib/types';

interface MentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void;
  mentor?: User | null;
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
    experience: '',
    bio: '',
    role: 'Mentor'
  });

  // * Reset form when modal opens/closes or mentor changes
  useEffect(() => {
    if (isOpen) {
      if (mentor) {
        setFormData({
          first_name: mentor.first_name,
          last_name: mentor.last_name,
          email: mentor.email,
          password: '',
          password_confirmation: '',
          specialization: mentor.specialization || '',
          experience: mentor.experience || '',
          bio: mentor.bio || '',
          role: mentor.role
        });
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          password_confirmation: '',
          specialization: '',
          experience: '',
          bio: '',
          role: 'Mentor'
        });
      }
    }
  }, [isOpen, mentor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
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

    const submitData: CreateUserPayload | UpdateUserPayload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      role: formData.role as 'Mentor',
      specialization: formData.specialization || null,
      experience: formData.experience || null,
      bio: formData.bio || null,
      ...(mentor ? {} : {
        password: formData.password,
        password_confirmation: formData.password_confirmation
      })
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.first_name && formData.last_name && formData.email && 
    (mentor ? true : formData.password && formData.password_confirmation);

  const isPasswordMatch = !formData.password || !formData.password_confirmation || 
    formData.password === formData.password_confirmation;

  const specializationOptions = [
    { key: 'web-development', value: 'web-development', label: 'Web Development' },
    { key: 'mobile-development', value: 'mobile-development', label: 'Mobile Development' },
    { key: 'data-science', value: 'data-science', label: 'Data Science' },
    { key: 'cybersecurity', value: 'cybersecurity', label: 'Cybersecurity' },
    { key: 'cloud-computing', value: 'cloud-computing', label: 'Cloud Computing' },
    { key: 'artificial-intelligence', value: 'artificial-intelligence', label: 'Artificial Intelligence' },
    { key: 'digital-marketing', value: 'digital-marketing', label: 'Digital Marketing' },
    { key: 'graphic-design', value: 'graphic-design', label: 'Graphic Design' },
    { key: 'project-management', value: 'project-management', label: 'Project Management' },
    { key: 'other', value: 'other', label: 'Other' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            {mentor ? 'Edit Mentor' : 'Add New Mentor'}
          </h2>
          <p className="text-sm text-neutral-600">
            {mentor ? 'Update mentor information' : 'Fill in the details to add a new mentor'}
          </p>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                isRequired
                variant="bordered"
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                isRequired
                variant="bordered"
              />
            </div>

            <Input
              label="Email"
              placeholder="Enter email address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              isRequired
              variant="bordered"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Specialization"
                placeholder="Select specialization"
                selectedKeys={formData.specialization ? [formData.specialization] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('specialization', selectedKey);
                }}
                variant="bordered"
              >
                {specializationOptions.map((option) => (
                  <SelectItem key={option.key} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Years of Experience"
                placeholder="e.g., 5 years"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                variant="bordered"
              />
            </div>

            <Textarea
              label="Bio"
              placeholder="Tell us about the mentor's background and expertise"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              variant="bordered"
              minRows={3}
            />

            {!mentor && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  isRequired={!mentor}
                  variant="bordered"
                />
                <Input
                  label="Confirm Password"
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
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              isDisabled={!isFormValid || !isPasswordMatch || isLoading}
            >
              {mentor ? 'Update Mentor' : 'Add Mentor'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
