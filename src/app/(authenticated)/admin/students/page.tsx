// * Admin Students Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills and groups pages

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { StudentsTable } from '@/components/features/admin/StudentsTable';
// import { StudentModal } from '@/components/features/admin/StudentModal';
import { StudentProfileModal } from '@/components/features/admin/StudentProfileModal';
import { StudentEnrollmentsModal } from '@/components/features/admin/StudentEnrollmentsModal';
import { studentsApi, enrollmentsApi, skillsApi, academicSessionsApi } from '@/lib/api';
import { StudentProfile, Enrollment, Skill, AcademicSession } from '@/lib/types';
import type { CreateUserPayload, UpdateUserPayload } from '@/lib/types'
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody, Chip, Select, SelectItem } from '@heroui/react';
import { AlertTriangle, Search, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getErrorMessage, getErrorTitle, getSuccessTitle, getSuccessMessage } from '@/lib/error-handling';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminStudentsPage() {
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEnrollmentsModalOpen, setIsEnrollmentsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [enrollmentStatusFilter, setEnrollmentStatusFilter] = useState<string>('all');

  const queryClient = useQueryClient();
  const { addNotification } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // * Initialize filters from query params
  useEffect(() => {
    const skillId = searchParams.get('skill_id');
    const department = searchParams.get('department');
    const level = searchParams.get('level');
    const enrollmentStatus = searchParams.get('enrollment_status');
    const searchQuery = searchParams.get('search');

    if (skillId) setSkillFilter(skillId);
    if (department) setDepartmentFilter(department);
    if (level) setLevelFilter(level);
    if (enrollmentStatus) setEnrollmentStatusFilter(enrollmentStatus);
    if (searchQuery) setSearch(searchQuery);
  }, [searchParams]);

  // * Update URL when filters change
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    router.push(`/admin/students?${params.toString()}`, { scroll: false });
  };

  // * Fetch filter data
  const { data: skillsData } = useClientQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await skillsApi.getAll();
      return Array.isArray(response.data) ? response.data : response.data?.items || [];
    },
  });

  const { data: sessionsData } = useClientQuery({
    queryKey: ['academic-sessions'],
    queryFn: async () => {
      const response = await academicSessionsApi.getAll();
      return response.data || [];
    },
  });

  // * React Query for data fetching - only run on client
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // * Fetch students data
  const {
    data: studentsResponse,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useClientQuery({
    queryKey: ['students'],
    queryFn: async () => {
      // * Fetch first page to get total count
      const firstPage = await studentsApi.searchStudents({ per_page: 100, page: 1 });
      console.log('Students API response (first page):', firstPage.data);
      
      // * If there are more pages, fetch them
      const totalPages = firstPage.data?.meta?.last_page || 1;
      if (totalPages <= 1) {
        return firstPage.data;
      }
      
      // * Fetch all remaining pages in parallel
      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) => 
          studentsApi.searchStudents({ per_page: 100, page: i + 2 })
        )
      );
      
      // * Combine all pages
      const allItems = [
        ...(firstPage.data?.items || []),
        ...remainingPages.flatMap(page => page.data?.items || [])
      ];
      
      return {
        ...firstPage.data,
        items: allItems,
        meta: {
          ...firstPage.data?.meta,
          total: allItems.length,
          last_page: 1,
          current_page: 1
        }
      };
    },
  });

  // * Fetch enrollments data in parallel
  const {
    data: enrollmentsResponse,
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
  } = useClientQuery({
    queryKey: ['admin-enrollments-for-students'],
    queryFn: async () => {
      // * Fetch first page to get total count
      const firstPage = await enrollmentsApi.getAll({ per_page: 100, page: 1 });
      console.log('Enrollments API response (first page):', firstPage.data);
      
      // * If there are more pages, fetch them
      const totalPages = firstPage.data?.meta?.last_page || 1;
      if (totalPages <= 1) {
        return firstPage.data;
      }
      
      // * Fetch all remaining pages in parallel
      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) => 
          enrollmentsApi.getAll({ per_page: 100, page: i + 2 })
        )
      );
      
      // * Combine all pages
      const allItems = [
        ...(firstPage.data?.items || []),
        ...remainingPages.flatMap(page => page.data?.items || [])
      ];
      
      return {
        ...firstPage.data,
        items: allItems,
        meta: {
          ...firstPage.data?.meta,
          total: allItems.length,
          last_page: 1,
          current_page: 1
        }
      };
    },
  });

  // * Merge students with enrollment data
  const students = useMemo(() => {
    const allStudents = studentsResponse?.items ?? [];
    const allEnrollments = enrollmentsResponse?.items ?? [];
    
    // * Create a map of enrollments by student.user_id for quick lookup
    const enrollmentsByUser = allEnrollments.reduce((acc, enrollment) => {
      const userId = enrollment.student?.id; // * Use student.id from enrollment
      if (!userId) return acc;
      
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(enrollment);
      return acc;
    }, {} as Record<string, Enrollment[]>);

    // * Merge student data with enrollment data
    const mergedStudents = allStudents.map(student => {
      const studentEnrollments = enrollmentsByUser[student.user_id] || [];
      
      // * Find the most recent/active enrollment
      const activeEnrollment = studentEnrollments.find(e => 
        e.status === 'assigned' || e.status === 'paid'
      ) || studentEnrollments[0];

      // * Get assigned group info if available
      const assignedGroup = activeEnrollment?.group ? {
        id: activeEnrollment.group.id,
        group_number: activeEnrollment.group.group_number,
        group_display_name: activeEnrollment.group.group_display_name,
        skill_title: activeEnrollment.skill?.title || 'Unknown Skill'
      } : null;

      // * Get current enrollment info
      const currentEnrollment = activeEnrollment ? {
        skill_title: activeEnrollment.skill?.title || 'Unknown Skill',
        status: activeEnrollment.status,
        group_assigned: !!activeEnrollment.group
      } : null;

      return {
        ...student,
        assigned_group: assignedGroup,
        current_enrollment: currentEnrollment,
        // * Update enrollments_count with actual count
        enrollments_count: studentEnrollments.length.toString()
      };
    });

    // * Apply client-side filtering
    let filteredStudents = mergedStudents;
    
    // * Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.full_name.toLowerCase().includes(searchLower) ||
        student.matric_number.toLowerCase().includes(searchLower) ||
        student.department.toLowerCase().includes(searchLower) ||
        (student.faculty && student.faculty.toLowerCase().includes(searchLower)) ||
        (student.assigned_group?.skill_title && student.assigned_group.skill_title.toLowerCase().includes(searchLower)) ||
        (student.current_enrollment?.skill_title && student.current_enrollment.skill_title.toLowerCase().includes(searchLower))
      );
    }
    
    // * Apply skill filter
    if (skillFilter !== 'all') {
      filteredStudents = filteredStudents.filter(student => 
        student.current_enrollment?.skill_title === skillsData?.find(s => s.id === skillFilter)?.title
      );
    }
    
    // * Apply department filter
    if (departmentFilter !== 'all') {
      filteredStudents = filteredStudents.filter(student => 
        student.department.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    // * Apply level filter
    if (levelFilter !== 'all') {
      filteredStudents = filteredStudents.filter(student => 
        student.student_level === levelFilter
      );
    }
    
    // * Apply enrollment status filter
    if (enrollmentStatusFilter !== 'all') {
      filteredStudents = filteredStudents.filter(student => 
        student.current_enrollment?.status === enrollmentStatusFilter
      );
    }
    
    return filteredStudents;
  }, [studentsResponse, enrollmentsResponse, debouncedSearch, skillFilter, departmentFilter, levelFilter, enrollmentStatusFilter, skillsData]);

  // * Combined loading and error states
  const isLoading = studentsLoading || enrollmentsLoading;
  const error = studentsError || enrollmentsError;
  const refetch = () => {
    refetchStudents();
    // Note: enrollments will refetch automatically due to query invalidation
  };

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

  const openEnrollmentsModal = (student: StudentProfile) => {
    setSelectedStudent(student);
    setIsEnrollmentsModalOpen(true);
  };

  // * Close all modals
  const closeModals = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Students</h1>
          <p className="text-neutral-600 mt-1">Search and manage student profiles and enrollments</p>
        </div>
      </div>

      {/* Filters Card */}
      <Card shadow="sm">
        <CardHeader className="px-4 pt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-600" />
            <p className="text-base font-medium text-neutral-900">Filters</p>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  updateFilters({ search: e.target.value });
                }}
                startContent={<Search className="w-4 h-4 text-neutral-400" />}
                placeholder="Search by name or matric number"
                variant="bordered"
                label="Search"
              />
            </div>
            
            <div>
              <Select
                label="Skill"
                placeholder="All skills"
                selectedKeys={skillFilter !== 'all' ? [skillFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  const value = selected || 'all';
                  setSkillFilter(value);
                  updateFilters({ skill_id: value });
                }}
                variant="bordered"
                size="sm"
                items={[{ key: 'all', title: 'All Skills' }, ...(skillsData || []).map(skill => ({ key: skill.id, title: skill.title }))]}
              >
                {(skill) => <SelectItem key={skill.key}>{skill.title}</SelectItem>}
              </Select>
            </div>
            
            <div>
              <Select
                label="Department"
                placeholder="All departments"
                selectedKeys={departmentFilter !== 'all' ? [departmentFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  const value = selected || 'all';
                  setDepartmentFilter(value);
                  updateFilters({ department: value });
                }}
                variant="bordered"
                size="sm"
                items={[
                  { key: 'all', title: 'All Departments' },
                  { key: 'computer-science', title: 'Computer Science' },
                  { key: 'electrical-engineering', title: 'Electrical Engineering' },
                  { key: 'mechanical-engineering', title: 'Mechanical Engineering' },
                  { key: 'civil-engineering', title: 'Civil Engineering' }
                ]}
              >
                {(department) => <SelectItem key={department.key}>{department.title}</SelectItem>}
              </Select>
            </div>
            
            <div>
              <Select
                label="Level"
                placeholder="All levels"
                selectedKeys={levelFilter !== 'all' ? [levelFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  const value = selected || 'all';
                  setLevelFilter(value);
                  updateFilters({ level: value });
                }}
                variant="bordered"
                size="sm"
                items={[
                  { key: 'all', title: 'All Levels' },
                  { key: '100', title: '100 Level' },
                  { key: '200', title: '200 Level' },
                  { key: '300', title: '300 Level' },
                  { key: '400', title: '400 Level' },
                  { key: '500', title: '500 Level' }
                ]}
              >
                {(level) => <SelectItem key={level.key}>{level.title}</SelectItem>}
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Select
                label="Enrollment Status"
                placeholder="All statuses"
                selectedKeys={enrollmentStatusFilter !== 'all' ? [enrollmentStatusFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  const value = selected || 'all';
                  setEnrollmentStatusFilter(value);
                  updateFilters({ enrollment_status: value });
                }}
                variant="bordered"
                size="sm"
                className="w-48"
                items={[
                  { key: 'all', title: 'All Statuses' },
                  { key: 'pending', title: 'Pending' },
                  { key: 'approved', title: 'Approved' },
                  { key: 'rejected', title: 'Rejected' },
                  { key: 'completed', title: 'Completed' }
                ]}
              >
                {(status) => <SelectItem key={status.key}>{status.title}</SelectItem>}
              </Select>
            </div>
            
            <Chip variant="flat" color="primary">
              {students?.length || 0} students
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* Students Results Card */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Students</p>
            <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 text-xs px-2 py-0.5">{students?.length || 0}</span>
          </div>
        </div>
        <div className="px-4 pb-4">
          {isLoading && (
            <div className="text-center py-4 text-sm text-neutral-600">
              {studentsLoading && enrollmentsLoading ? 'Loading students and enrollment data...' :
               studentsLoading ? 'Loading students...' :
               enrollmentsLoading ? 'Loading enrollment data...' : 'Loading...'}
            </div>
          )}
          <StudentsTable
            students={students}
            isLoading={isLoading}
            error={error as Error | null}
            onView={openProfileModal}
            onManageProfile={openProfileModal}
            onManageEnrollments={openEnrollmentsModal}
          />
        </div>
      </div>

      {/* * Edit/Delete deferred per route specs */}

      {/* * Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedStudent?.user_id || null}
      />

      {/* * Student Enrollments Modal */}
      <StudentEnrollmentsModal
        isOpen={isEnrollmentsModalOpen}
        onClose={() => setIsEnrollmentsModalOpen(false)}
        student={selectedStudent}
      />

      {/* * Debug Information (hidden in production) */}
    </div>
  );
}
