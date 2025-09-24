// * Group Modal Component
// * Handles creating and editing groups
// * Follows the same pattern as SkillModal

'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { Group, CreateGroupPayload } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupPayload | Partial<Group>) => void;
  group?: Group | null;
  isLoading?: boolean;
}

export function GroupModal({
  isOpen,
  onClose,
  onSubmit,
  group,
  isLoading = false
}: GroupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    skillId: '',
    mentorId: '',
    description: ''
  });

  // * Fetch skills for the skill selection
  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.getSkills();
      return response.data;
    },
  });

  // * Fetch mentors for the mentor selection
  const { data: mentors } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const response = await api.getMentors();
      return response.data;
    },
  });

  // * Reset form when modal opens/closes or group changes
  useEffect(() => {
    if (isOpen) {
      if (group) {
        setFormData({
          name: group.name,
          skillId: group.skill.id,
          mentorId: group.mentor?.id || '',
          description: ''
        });
      } else {
        setFormData({
          name: '',
          skillId: '',
          mentorId: '',
          description: ''
        });
      }
    }
  }, [isOpen, group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.skillId) {
      return;
    }

    const submitData = {
      name: formData.name,
      skill_id: formData.skillId,
      mentor_id: formData.mentorId || null,
      description: formData.description || null
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.name && formData.skillId;

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
            {group ? 'Edit Group' : 'Create New Group'}
          </h2>
          <p className="text-sm text-neutral-600">
            {group ? 'Update group information' : 'Fill in the details to create a new group'}
          </p>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-4">
            <Input
              label="Group Name"
              placeholder="Enter group name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              isRequired
              variant="bordered"
            />

            <Select
              label="Skill"
              placeholder="Select a skill"
              selectedKeys={formData.skillId ? [formData.skillId] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleInputChange('skillId', selectedKey);
              }}
              isRequired
              variant="bordered"
            >
              {skills?.map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.title}
                </SelectItem>
              )) || []}
            </Select>

            <Select
              label="Mentor"
              placeholder="Select a mentor (optional)"
              selectedKeys={formData.mentorId ? [formData.mentorId] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleInputChange('mentorId', selectedKey || '');
              }}
              variant="bordered"
            >
              {mentors?.map((mentor) => (
                <SelectItem key={mentor.id} value={mentor.id}>
                  {mentor.full_name || mentor.user?.first_name + ' ' + mentor.user?.last_name || String(mentor.id)}
                </SelectItem>
              )) || []}
            </Select>

            <Input
              label="Description"
              placeholder="Enter group description (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              variant="bordered"
            />
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
              isDisabled={!isFormValid || isLoading}
            >
              {group ? 'Update Group' : 'Create Group'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
