// * Admin Mentors Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills, groups, and students pages

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { MentorsTable } from '@/components/features/admin/MentorsTable';
import { MentorModal } from '@/components/features/admin/MentorModal';
import { api } from '@/lib/api';
import { User, CreateUserPayload, UpdateUserPayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Plus, AlertTriangle } from 'lucide-react';

export default function AdminMentorsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching - only run on client
  const {
    data: mentors,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const response = await api.getUsers({ role: 'Mentor' });
      // * Extract items from paginated response
      return response.data?.items || [];
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  // * Create mentor mutation
  const createMentorMutation = useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const response = await api.createUser(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating mentor:', error);
    },
  });

  // * Update mentor mutation
  const updateMentorMutation = useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      if (!selectedMentor) throw new Error('No mentor selected');
      const response = await api.updateUser(selectedMentor.id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      setIsEditModalOpen(false);
      setSelectedMentor(null);
    },
    onError: (error) => {
      console.error('Error updating mentor:', error);
    },
  });

  // * Delete mentor mutation
  const deleteMentorMutation = useMutation({
    mutationFn: async (mentorId: string) => {
      await api.deleteUser(mentorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      setIsDeleteModalOpen(false);
      setSelectedMentor(null);
    },
    onError: (error) => {
      console.error('Error deleting mentor:', error);
    },
  });

  // * Handle create mentor
  const handleCreateMentor = async (data: CreateUserPayload | UpdateUserPayload) => {
    setIsSubmitting(true);
    try {
      await createMentorMutation.mutateAsync(data as CreateUserPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit mentor
  const handleEditMentor = async (data: CreateUserPayload | UpdateUserPayload) => {
    setIsSubmitting(true);
    try {
      await updateMentorMutation.mutateAsync(data as UpdateUserPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete mentor
  const handleDeleteMentor = async () => {
    if (!selectedMentor) return;
    setIsSubmitting(true);
    try {
      await deleteMentorMutation.mutateAsync(selectedMentor.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = () => {
    setSelectedMentor(null);
    setIsCreateModalOpen(true);
  };

  // * Open edit modal
  const openEditModal = (mentor: User) => {
    setSelectedMentor(mentor);
    setIsEditModalOpen(true);
  };

  // * Open delete modal
  const openDeleteModal = (mentor: User) => {
    setSelectedMentor(mentor);
    setIsDeleteModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedMentor(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mentors Management</h1>
          <p className="text-neutral-600 mt-1">
            Manage mentor accounts and profiles
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Add Mentor
        </Button>
      </div>

      {/* * Mentors Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={mentors}
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
                message="No mentors found. Add your first mentor to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onClick={openCreateModal}
                  >
                    Add Mentor
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <MentorsTable
              mentors={data}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onView={(mentor) => {
                // TODO: Navigate to mentor details page
                console.log('View mentor:', mentor);
              }}
              onManageProfile={(mentor) => {
                // TODO: Navigate to mentor profile management
                console.log('Manage profile for mentor:', mentor);
              }}
              onManageGroups={(mentor) => {
                // TODO: Navigate to mentor groups management
                console.log('Manage groups for mentor:', mentor);
              }}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Create Mentor Modal */}
      <MentorModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateMentor}
        isLoading={isSubmitting}
      />

      {/* * Edit Mentor Modal */}
      <MentorModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditMentor}
        mentor={selectedMentor}
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
              <h2 className="text-lg font-semibold">Delete Mentor</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete <strong>{selectedMentor?.first_name} {selectedMentor?.last_name}</strong>? 
              This action cannot be undone and will remove all associated data.
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
              onClick={handleDeleteMentor}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Mentor
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
          <p><strong>Data Count:</strong> {mentors?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;mentors&apos;]</p>
          <p><strong>Mutations:</strong> Create: {createMentorMutation.isPending ? 'Pending' : 'Idle'}, Update: {updateMentorMutation.isPending ? 'Pending' : 'Idle'}, Delete: {deleteMentorMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
