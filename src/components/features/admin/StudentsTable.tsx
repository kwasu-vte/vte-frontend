// * Students Table Component
// * Displays students data in a table format with actions
// * Follows the same pattern as SkillsTable and GroupsTable

'use client';

import { Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { StudentProfile } from '@/lib/types';
import { MoreVertical, Eye, User as UserIcon, BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';

interface StudentsTableProps {
  students: StudentProfile[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onView: (student: StudentProfile) => void;
  onManageProfile: (student: StudentProfile) => void;
  onManageEnrollments: (student: StudentProfile) => void;
  onCreate?: () => void;
  onEdit?: (student: StudentProfile) => void;
  onDelete?: (student: StudentProfile) => void;
}

export function StudentsTable({
  students,
  isLoading,
  error,
  onView,
  onManageProfile,
  onManageEnrollments,
  onCreate,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (student: StudentProfile) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{student.full_name}</span>
          <span className="text-sm text-neutral-500">ID: {student.id}</span>
        </div>
      ),
    },
    {
      key: 'matric',
      label: 'Matric',
      render: (student: StudentProfile) => (
        student.matric_number ? (
          <span className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{student.matric_number}</span>
        ) : (
          <span className="text-neutral-400 italic">Not assigned</span>
        )
      ),
    },
    {
      key: 'level',
      label: 'Level',
      render: (student: StudentProfile) => (
        student.student_level ? (
          <Chip color="primary" variant="flat" size="sm">{student.student_level}</Chip>
        ) : (
          <span className="text-neutral-400 italic">Not specified</span>
        )
      ),
    },
    {
      key: 'department',
      label: 'Dept',
      render: (student: StudentProfile) => (
        student.department || <span className="text-neutral-400 italic">Not specified</span>
      ),
    },
    {
      key: 'enrollment_status',
      label: 'Enrollment Status',
      render: (student: StudentProfile) => {
        const enrolled = Number(student.enrollments_count || 0) > 0;
        return (
          <Chip color={(enrolled ? 'success' : 'warning') as any} variant="flat" size="sm">
            {enrolled ? 'Enrolled' : 'Not Enrolled'}
          </Chip>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (student: StudentProfile) => (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Student actions">
            <DropdownItem key="view" startContent={<Eye className="w-4 h-4" />} onClick={() => onView(student)}>
              View Details
            </DropdownItem>
            {onEdit && (
              <DropdownItem key="edit" startContent={<Edit className="w-4 h-4" />} onClick={() => onEdit(student)}>
                Edit Student
              </DropdownItem>
            )}
            <DropdownItem key="profile" startContent={<UserIcon className="w-4 h-4" />} onClick={() => onManageProfile(student)}>
              Manage Profile
            </DropdownItem>
            <DropdownItem key="enrollments" startContent={<BookOpen className="w-4 h-4" />} onClick={() => onManageEnrollments(student)}>
              Manage Enrollments
            </DropdownItem>
            {onDelete && (
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 className="w-4 h-4" />}
                onClick={() => onDelete(student)}
              >
                Delete Student
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ];

  const getEnrollmentStatus = (student: StudentProfile) => {
    const enrolled = Number(student.enrollments_count || 0) > 0;
    return {
      text: enrolled ? 'Enrolled' : 'Not Enrolled',
      color: enrolled ? 'success' : 'warning',
    } as const;
  };

  return (
    <DataTable
      data={students}
      isLoading={isLoading}
      error={error}
      columns={columns}
      emptyActionButton={
        onCreate ? (
          <Button color="primary" startContent={<Plus className="w-4 h-4" />} onClick={onCreate}>
            Add Student
          </Button>
        ) : undefined
      }
    />
  );
}
