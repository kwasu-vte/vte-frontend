// * Admin Students Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills and groups pages

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentsTable } from '@/components/features/admin/StudentsTable';
// import { StudentModal } from '@/components/features/admin/StudentModal';
import { StudentProfileModal } from '@/components/features/admin/StudentProfileModal';
import { api } from '@/lib/api';
import { StudentProfile } from '@/lib/types';
import type { CreateUserPayload, UpdateUserPayload } from '@/lib/types'
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { AlertTriangle, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getErrorMessage, getErrorTitle, getSuccessTitle, getSuccessMessage } from '@/lib/error-handling';

export default function AdminStudentsPage() {
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const queryClient = useQueryClient();
  const { addNotification } = useApp();

  // * React Query for data fetching - only run on client
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: studentsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['students', { search: debouncedSearch }],
    queryFn: async () => {
      const response = await api.getStudents({ search: debouncedSearch || undefined, per_page: 25 });
      return response.data;
    },
    enabled: typeof window !== 'undefined',
  });

  const students = useMemo(() => studentsResponse?.results ?? [], [studentsResponse]);

  // * Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      if (!selectedStudent) throw new Error('No student selected');
      // * No update API available; return selected student as placeholder
      return { data: selectedStudent } as unknown as Response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setSelectedStudent(null);
      addNotification({
        type: 'success',
        title: getSuccessTitle('update', 'student'),
        message: getSuccessMessage(response, 'The student has been updated successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error updating student:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('update', 'student'),
        message: getErrorMessage(error, 'An unexpected error occurred while updating the student.'),
      });
    },
  });

  // * Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (_studentId: string) => {
      // * No delete API available; return true as placeholder
      return { data: true } as unknown as Response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setSelectedStudent(null);
      addNotification({
        type: 'success',
        title: getSuccessTitle('delete', 'student'),
        message: getSuccessMessage(response, 'The student has been deleted successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error deleting student:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('delete', 'student'),
        message: getErrorMessage(error, 'An unexpected error occurred while deleting the student.'),
      });
    },
  });

  // * Handle edit student
  const handleEditStudent = async (data: CreateUserPayload | UpdateUserPayload) => {
    await updateStudentMutation.mutateAsync(data as UpdateUserPayload);
  };

  // * Handle delete student
  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    await deleteStudentMutation.mutateAsync(String(selectedStudent.id));
  };

  // * Open edit modal (not wired yet per specs)

  // * Open delete modal (not wired yet per specs)

  const openProfileModal = (student: StudentProfile) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Students</h1>
          <p className="text-neutral-600 mt-1">Search and manage student profiles and enrollments</p>
        </div>
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<Search className="w-4 h-4 text-neutral-400" />}
            placeholder="Search by name or matric number"
            variant="bordered"
          />
        </div>
      </div>

      {/* * Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StudentsTable
          students={students}
          isLoading={isLoading}
          error={error as Error | null}
          onView={openProfileModal}
          onManageProfile={openProfileModal}
          onManageEnrollments={(student) => {
            console.log('Manage enrollments for student:', student);
          }}
        />
      </div>

      {/* * Edit/Delete deferred per route specs */}

      {/* * Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedStudent?.id ? String(selectedStudent.id) : null}
      />

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? (error as Error).message : 'None'}</p>
          <p><strong>Data Count:</strong> {students?.length || 0}</p>
          <p><strong>Query Key:</strong> [&#39;students&#39;, {}]</p>
        </div>
      </div>
    </div>
  );
}
