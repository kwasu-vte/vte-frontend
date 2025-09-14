// * Admin Groups Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills page

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { GroupsTable } from '@/components/features/admin/GroupsTable';
import { GroupModal } from '@/components/features/admin/GroupModal';
import { api } from '@/lib/api';
import { Group, CreateGroupPayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Plus, AlertTriangle } from 'lucide-react';

export default function AdminGroupsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching
  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await api.getGroups();
      return response.data;
    },
  });

  // * Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (data: CreateGroupPayload) => {
      const response = await api.createGroup(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating group:', error);
    },
  });

  // * Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async (data: Partial<Group>) => {
      if (!selectedGroup) throw new Error('No group selected');
      const response = await api.updateGroup(selectedGroup.id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsEditModalOpen(false);
      setSelectedGroup(null);
    },
    onError: (error) => {
      console.error('Error updating group:', error);
    },
  });

  // * Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      await api.deleteGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    },
    onError: (error) => {
      console.error('Error deleting group:', error);
    },
  });

  // * Handle create group
  const handleCreateGroup = async (data: CreateGroupPayload | Partial<Group>) => {
    setIsSubmitting(true);
    try {
      await createGroupMutation.mutateAsync(data as CreateGroupPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit group
  const handleEditGroup = async (data: CreateGroupPayload | Partial<Group>) => {
    setIsSubmitting(true);
    try {
      await updateGroupMutation.mutateAsync(data as Partial<Group>);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete group
  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    setIsSubmitting(true);
    try {
      await deleteGroupMutation.mutateAsync(selectedGroup.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = () => {
    setSelectedGroup(null);
    setIsCreateModalOpen(true);
  };

  // * Open edit modal
  const openEditModal = (group: Group) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  // * Open delete modal
  const openDeleteModal = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Groups Management</h1>
          <p className="text-neutral-600 mt-1">
            Manage student groups and enrollments
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={openCreateModal}
        >
          Create Group
        </Button>
      </div>

      {/* * Groups Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={groups}
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
                message="No groups found. Create your first group to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={openCreateModal}
                  >
                    Create Group
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <GroupsTable
              groups={data}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onView={(group) => {
                // TODO: Navigate to group details page
                console.log('View group:', group);
              }}
              onManageMembers={(group) => {
                // TODO: Navigate to members management for this group
                console.log('Manage members for group:', group);
              }}
              onManageAttendance={(group) => {
                // TODO: Navigate to attendance management for this group
                console.log('Manage attendance for group:', group);
              }}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Create Group Modal */}
      <GroupModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateGroup}
        isLoading={isSubmitting}
      />

      {/* * Edit Group Modal */}
      <GroupModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditGroup}
        group={selectedGroup}
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
              <h2 className="text-lg font-semibold">Delete Group</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete <strong>{selectedGroup?.name}</strong>? 
              This action cannot be undone and will remove all associated members and attendance records.
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
              onPress={handleDeleteGroup}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Group
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
          <p><strong>Data Count:</strong> {groups?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;groups&apos;]</p>
          <p><strong>Mutations:</strong> Create: {createGroupMutation.isPending ? 'Pending' : 'Idle'}, Update: {updateGroupMutation.isPending ? 'Pending' : 'Idle'}, Delete: {deleteGroupMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
