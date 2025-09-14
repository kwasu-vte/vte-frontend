// * Admin Students Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills and groups pages

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { StudentsTable } from '@/components/features/admin/StudentsTable';
import { StudentModal } from '@/components/features/admin/StudentModal';
import { api } from '@/lib/api';
import { User, CreateUserPayload, UpdateUserPayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Plus, AlertTriangle } from 'lucide-react';

export default function AdminStudentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching
  const {
    data: students,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await api.getUsers({ role: 'Student' });
      return response.data;
    },
  });

  // * Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const response = await api.createUser(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating student:', error);
    },
  });

  // * Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      if (!selectedStudent) throw new Error('No student selected');
      const response = await api.updateUser(selectedStudent.id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    },
    onError: (error) => {
      console.error('Error updating student:', error);
    },
  });

  // * Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      await api.deleteUser(studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    },
    onError: (error) => {
      console.error('Error deleting student:', error);
    },
  });

  // * Handle create student
  const handleCreateStudent = async (data: CreateUserPayload | UpdateUserPayload) => {
    setIsSubmitting(true);
    try {
      await createStudentMutation.mutateAsync(data as CreateUserPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit student
  const handleEditStudent = async (data: CreateUserPayload | UpdateUserPayload) => {
    setIsSubmitting(true);
    try {
      await updateStudentMutation.mutateAsync(data as UpdateUserPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete student
  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await deleteStudentMutation.mutateAsync(selectedStudent.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = () => {
    setSelectedStudent(null);
    setIsCreateModalOpen(true);
  };

  // * Open edit modal
  const openEditModal = (student: User) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  // * Open delete modal
  const openDeleteModal = (student: User) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Students Management</h1>
          <p className="text-neutral-600 mt-1">
            Manage student accounts and profiles
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={openCreateModal}
        >
          Add Student
        </Button>
      </div>

      {/* * Students Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={students}
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
                message="No students found. Add your first student to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={openCreateModal}
                  >
                    Add Student
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <StudentsTable
              students={data}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onView={(student) => {
                // TODO: Navigate to student details page
                console.log('View student:', student);
              }}
              onManageProfile={(student) => {
                // TODO: Navigate to student profile management
                console.log('Manage profile for student:', student);
              }}
              onManageEnrollments={(student) => {
                // TODO: Navigate to student enrollments management
                console.log('Manage enrollments for student:', student);
              }}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Create Student Modal */}
      <StudentModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateStudent}
        isLoading={isSubmitting}
      />

      {/* * Edit Student Modal */}
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditStudent}
        student={selectedStudent}
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
              <h2 className="text-lg font-semibold">Delete Student</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete <strong>{selectedStudent?.first_name} {selectedStudent?.last_name}</strong>? 
              This action cannot be undone and will remove all associated data.
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
              onPress={handleDeleteStudent}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Student
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
          <p><strong>Data Count:</strong> {students?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;students&apos;]</p>
          <p><strong>Mutations:</strong> Create: {createStudentMutation.isPending ? 'Pending' : 'Idle'}, Update: {updateStudentMutation.isPending ? 'Pending' : 'Idle'}, Delete: {deleteStudentMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
