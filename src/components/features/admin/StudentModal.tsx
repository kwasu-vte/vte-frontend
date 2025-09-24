// * Student Modal Component
// * Handles creating and editing students
// * Follows the same pattern as SkillModal and GroupModal

'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { CreateUserPayload, UpdateUserPayload, StudentProfile } from '@/lib/types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void;
  student?: StudentProfile | null;
  isLoading?: boolean;
}

export function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  student,
  isLoading = false
}: StudentModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    matric_number: '',
    level: '',
    role: 'Student'
  });

  // * Reset form when modal opens/closes or student changes
  useEffect(() => {
    if (isOpen) {
      if (student) {
        setFormData({
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          password: '',
          password_confirmation: '',
          matric_number: student.matric_number || '',
          level: student.level || '',
          role: student.role
        });
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          password_confirmation: '',
          matric_number: '',
          level: '',
          role: 'Student'
        });
      }
    }
  }, [isOpen, student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      return;
    }

    // * For new students, password is required
    if (!student && (!formData.password || !formData.password_confirmation)) {
      return;
    }

    // * Validate password match for new students
    if (!student && formData.password !== formData.password_confirmation) {
      return;
    }

    const submitData: CreateUserPayload | UpdateUserPayload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      role: formData.role as 'Student',
      ...(student ? {} : {
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
    (student ? true : formData.password && formData.password_confirmation);

  const isPasswordMatch = !formData.password || !formData.password_confirmation || 
    formData.password === formData.password_confirmation;

  const levelOptions = [
    { key: '100', value: '100', label: '100 Level' },
    { key: '200', value: '200', label: '200 Level' },
    { key: '300', value: '300', label: '300 Level' },
    { key: '400', value: '400', label: '400 Level' },
    { key: '500', value: '500', label: '500 Level' },
    { key: '600', value: '600', label: '600 Level' }
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
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <p className="text-sm text-neutral-600">
            {student ? 'Update student information' : 'Fill in the details to add a new student'}
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
              <Input
                label="Matric Number"
                placeholder="Enter matric number"
                value={formData.matric_number}
                onChange={(e) => handleInputChange('matric_number', e.target.value)}
                variant="bordered"
              />
              <Select
                label="Level"
                placeholder="Select level"
                selectedKeys={formData.level ? [formData.level] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('level', selectedKey);
                }}
                variant="bordered"
              >
                {levelOptions.map((option) => (
                  <SelectItem key={option.key} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {!student && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  isRequired={!student}
                  variant="bordered"
                />
                <Input
                  label="Confirm Password"
                  placeholder="Confirm password"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                  isRequired={!student}
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
              {student ? 'Update Student' : 'Add Student'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
