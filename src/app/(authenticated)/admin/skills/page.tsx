// * Admin Skills Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This is the blueprint for all other data-driven pages

'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { SkillsTable } from '@/components/features/admin/SkillsTable';
import { SkillModal } from '@/components/features/admin/SkillModal';
import { api } from '@/lib/api';
import { Skill, CreateSkillPayload, UpdateSkillPayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Plus, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getErrorMessage, getErrorTitle, getSuccessTitle, getSuccessMessage } from '@/lib/error-handling';

export default function AdminSkillsPage() {
  console.log('🎯 AdminSkillsPage component mounted');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { addNotification } = useApp();

  // * React Query for data fetching - only run on client
  const {
    data: skills,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.getSkills();
      return response.data;
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  // * Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: async (data: CreateSkillPayload) => {
      const response = await api.createSkill(data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsCreateModalOpen(false);
      addNotification({
        type: 'success',
        title: getSuccessTitle('create', 'skill'),
        message: getSuccessMessage(response, 'The skill has been created successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error creating skill:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('create', 'skill'),
        message: getErrorMessage(error, 'An unexpected error occurred while creating the skill.'),
      });
    },
  });

  // * Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: async (data: UpdateSkillPayload) => {
      if (!selectedSkill) throw new Error('No skill selected');
      const response = await api.updateSkill(selectedSkill.id, data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsEditModalOpen(false);
      setSelectedSkill(null);
      addNotification({
        type: 'success',
        title: getSuccessTitle('update', 'skill'),
        message: getSuccessMessage(response, 'The skill has been updated successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error updating skill:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('update', 'skill'),
        message: getErrorMessage(error, 'An unexpected error occurred while updating the skill.'),
      });
    },
  });

  // * Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      const response = await api.deleteSkill(skillId);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsDeleteModalOpen(false);
      setSelectedSkill(null);
      addNotification({
        type: 'success',
        title: getSuccessTitle('delete', 'skill'),
        message: getSuccessMessage(response, 'The skill has been deleted successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error deleting skill:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('delete', 'skill'),
        message: getErrorMessage(error, 'An unexpected error occurred while deleting the skill.'),
      });
    },
  });

  // * Handle create skill
  const handleCreateSkill = async (data: CreateSkillPayload | UpdateSkillPayload) => {
    console.log('🎯 Creating skill with data:', data);
    setIsSubmitting(true);
    try {
      await createSkillMutation.mutateAsync(data as CreateSkillPayload);
      console.log('🎯 Skill created successfully');
    } catch (error) {
      console.error('🎯 Error creating skill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit skill
  const handleEditSkill = async (data: CreateSkillPayload | UpdateSkillPayload) => {
    setIsSubmitting(true);
    try {
      await updateSkillMutation.mutateAsync(data as UpdateSkillPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete skill
  const handleDeleteSkill = async () => {
    if (!selectedSkill) return;
    setIsSubmitting(true);
    try {
      await deleteSkillMutation.mutateAsync(selectedSkill.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = () => {
    console.log('🎯 Opening create modal...');
    alert('Button clicked! Modal should open now.');
    setSelectedSkill(null);
    setIsCreateModalOpen(true);
    console.log('🎯 Modal state set to true');
  };

  // * Open edit modal
  const openEditModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  // * Open delete modal
  const openDeleteModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDeleteModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedSkill(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Skills Management</h1>
          <p className="text-neutral-600 mt-1">
            Manage vocational skills and courses
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Create Skill
        </Button>
      </div>

      {/* * Skills Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <SkillsTable
          skills={skills}
          isLoading={isLoading}
          error={error}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onCreate={openCreateModal}
          onView={(skill) => {
            // TODO: Navigate to skill details page
            console.log('View skill:', skill);
          }}
          onManageGroups={(skill) => {
            // TODO: Navigate to groups management for this skill
            console.log('Manage groups for skill:', skill);
          }}
          onManageSchedule={(skill) => {
            // TODO: Navigate to schedule management for this skill
            console.log('Manage schedule for skill:', skill);
          }}
        />
      </div>

      {/* * Create Skill Modal */}
      <SkillModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateSkill}
        isLoading={isSubmitting}
      />

      {/* * Edit Skill Modal */}
      <SkillModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditSkill}
        skill={selectedSkill}
        isLoading={isSubmitting}
      />

      {/* * Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Delete Skill</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete <strong>{selectedSkill?.title}</strong>? 
              This action cannot be undone and will remove all associated groups and enrollments.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={closeModals}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={handleDeleteSkill}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Skill
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Data Count:</strong> {skills?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;skills&apos;]</p>
          <p><strong>Mutations:</strong> Create: {createSkillMutation.isPending ? 'Pending' : 'Idle'}, Update: {updateSkillMutation.isPending ? 'Pending' : 'Idle'}, Delete: {deleteSkillMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
