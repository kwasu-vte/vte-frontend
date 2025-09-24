// * Admin Attendance Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as other admin pages

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { AttendanceTable } from '@/components/features/admin/AttendanceTable';
import { AttendanceModal } from '@/components/features/admin/AttendanceModal';
import { api } from '@/lib/api';
import { AttendanceRecord, CreateAttendanceRecordPayload, UpdateAttendanceRecordPayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Plus, AlertTriangle, Calendar, Download } from 'lucide-react';

export default function AdminAttendancePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // * React Query for data fetching - only run on client
  const {
    data: attendanceRecords,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['attendance', { groupId: selectedGroupId }],
    queryFn: async () => {
      // * No direct list endpoint. Report structure differs, so return empty list for now.
      return [] as AttendanceRecord[];
    },
    enabled: typeof window !== 'undefined',
  });

  // * Create attendance record mutation
  const createAttendanceMutation = useMutation({
    mutationFn: async (_data: CreateAttendanceRecordPayload) => {
      // * No direct create API in specs; this is a no-op placeholder
      return { id: 'temp' } as unknown as AttendanceRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setIsCreateModalOpen(false);
    },
    onError: (err) => {
      console.error('Create attendance not supported:', err);
    },
  });

  // * Update attendance record mutation
  const updateAttendanceMutation = useMutation({
    mutationFn: async (_data: UpdateAttendanceRecordPayload) => {
      if (!selectedRecord) throw new Error('No record selected');
      // * No direct update API in specs; this is a no-op placeholder
      return selectedRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setIsEditModalOpen(false);
      setSelectedRecord(null);
    },
    onError: (err) => {
      console.error('Update attendance not supported:', err);
    },
  });

  // * Delete attendance record mutation
  const deleteAttendanceMutation = useMutation({
    mutationFn: async (_recordId: string) => {
      // * No direct delete API in specs; this is a no-op placeholder
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
    },
    onError: (err) => {
      console.error('Delete attendance not supported:', err);
    },
  });

  // * Handle create attendance record
  const handleCreateAttendance = async (data: CreateAttendanceRecordPayload | UpdateAttendanceRecordPayload) => {
    setIsSubmitting(true);
    try {
      await createAttendanceMutation.mutateAsync(data as CreateAttendanceRecordPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit attendance record
  const handleEditAttendance = async (data: CreateAttendanceRecordPayload | UpdateAttendanceRecordPayload) => {
    setIsSubmitting(true);
    try {
      await updateAttendanceMutation.mutateAsync(data as UpdateAttendanceRecordPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete attendance record
  const handleDeleteAttendance = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      await deleteAttendanceMutation.mutateAsync(selectedRecord.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = () => {
    setSelectedRecord(null);
    setIsCreateModalOpen(true);
  };

  // * Open edit modal
  const openEditModal = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  // * Open delete modal
  const openDeleteModal = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRecord(null);
  };

  // * Export attendance data
  const handleExportAttendance = () => {
    // TODO: Implement attendance export functionality
    console.log('Export attendance data');
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Attendance Management</h1>
          <p className="text-neutral-600 mt-1">
            Track and manage student attendance records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="secondary"
            startContent={<Download className="w-4 h-4" />}
            onClick={handleExportAttendance}
          >
            Export Data
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            Add Record
          </Button>
        </div>
      </div>

      {/* * Attendance Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={attendanceRecords}
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
                message="No attendance records found. Add your first record to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onClick={openCreateModal}
                  >
                    Add Record
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <AttendanceTable
              records={data}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onView={(record) => {
                // TODO: Navigate to attendance details page
                console.log('View attendance record:', record);
              }}
              onMarkPresent={(record) => {
                // TODO: Mark student as present
                console.log('Mark present:', record);
              }}
              onMarkAbsent={(record) => {
                // TODO: Mark student as absent
                console.log('Mark absent:', record);
              }}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Create Attendance Modal */}
      <AttendanceModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateAttendance}
        isLoading={isSubmitting}
      />

      {/* * Edit Attendance Modal */}
      <AttendanceModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditAttendance}
        record={selectedRecord}
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
              <h2 className="text-lg font-semibold">Delete Attendance Record</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete this attendance record? 
              This action cannot be undone.
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
              onClick={handleDeleteAttendance}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Record
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
          <p><strong>Data Count:</strong> {attendanceRecords?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;attendance&apos;]</p>
          <p><strong>Mutations:</strong> Create: {createAttendanceMutation.isPending ? 'Pending' : 'Idle'}, Update: {updateAttendanceMutation.isPending ? 'Pending' : 'Idle'}, Delete: {deleteAttendanceMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
