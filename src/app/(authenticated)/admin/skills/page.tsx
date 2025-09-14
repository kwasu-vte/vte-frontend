// * Admin Skills Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This is the blueprint for all other data-driven pages

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { SkillsTable } from '@/components/features/admin/SkillsTable';
import { SkillModal } from '@/components/features/admin/SkillModal';
import { api } from '@/lib/api';
import { Skill, CreateSkillPayload, UpdateSkillPayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Plus, AlertTriangle } from 'lucide-react';

export default function AdminSkillsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching
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
  });

  // * Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: async (data: CreateSkillPayload) => {
      const response = await api.createSkill(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating skill:', error);
    },
  });

  // * Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: async (data: UpdateSkillPayload) => {
      if (!selectedSkill) throw new Error('No skill selected');
      const response = await api.updateSkill(selectedSkill.id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsEditModalOpen(false);
      setSelectedSkill(null);
    },
    onError: (error) => {
      console.error('Error updating skill:', error);
    },
  });

  // * Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      await api.deleteSkill(skillId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsDeleteModalOpen(false);
      setSelectedSkill(null);
    },
    onError: (error) => {
      console.error('Error deleting skill:', error);
    },
  });

  // * Handle create skill
  const handleCreateSkill = async (data: CreateSkillPayload | UpdateSkillPayload) => {
    setIsSubmitting(true);
    try {
      await createSkillMutation.mutateAsync(data as CreateSkillPayload);
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
    setSelectedSkill(null);
    setIsCreateModalOpen(true);
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
          onPress={openCreateModal}
        >
          Create Skill
        </Button>
      </div>

      {/* * Skills Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={skills}
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
                message="No skills found. Create your first skill to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={openCreateModal}
                  >
                    Create Skill
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <SkillsTable
              skills={data}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
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
          )}
        </StateRenderer>
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
              onPress={closeModals}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteSkill}
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
