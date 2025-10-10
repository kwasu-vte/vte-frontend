// * Students Table Component
// * Displays students data in a table format with actions
// * Follows the same pattern as SkillsTable and GroupsTable

'use client';

import { Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { StudentProfile } from '@/lib/types';
import { MoreVertical, Eye, User as UserIcon, BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { ClientOnly } from '@/components/shared/ClientOnly';

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
        // * Convert to number and check if > 0
        const count = Number(student.enrollments_count || 0);
        const enrolled = count > 0;
        
        // * Determine status based on enrollment data
        let statusText = 'Not Enrolled';
        let chipColor: 'success' | 'warning' | 'danger' = 'warning';
        
        if (enrolled) {
          if (student.current_enrollment?.group_assigned) {
            statusText = `Assigned (${count})`;
            chipColor = 'success';
          } else if (student.current_enrollment?.status === 'paid') {
            statusText = `Paid - Pending Assignment (${count})`;
            chipColor = 'warning';
          } else {
            statusText = `Enrolled (${count})`;
            chipColor = 'success'; // * Green for enrolled students
          }
        }
        
        return (
          <Chip color={chipColor} variant="flat" size="sm">
            {statusText}
          </Chip>
        );
      },
    },
    {
      key: 'assigned_skill',
      label: 'Assigned Skill',
      render: (student: StudentProfile) => {
        if (student.assigned_group?.skill_title) {
          return (
            <span className="font-medium text-neutral-900">{student.assigned_group.skill_title}</span>
          );
        }
        if (student.current_enrollment?.skill_title) {
          return (
            <span className="font-medium text-neutral-900">{student.current_enrollment.skill_title}</span>
          );
        }
        return <span className="text-neutral-400 italic">No assignment</span>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (student: StudentProfile) => {
        const menuItems = [];
        
        if (onView) {
          menuItems.push(
            <DropdownItem
              key="view"
              startContent={<Eye className="w-4 h-4" />}
              onClick={() => onView(student)}
            >
              View Profile
            </DropdownItem>
          );
        }
        
        if (onManageProfile) {
          menuItems.push(
            <DropdownItem
              key="profile"
              startContent={<UserIcon className="w-4 h-4" />}
              onClick={() => onManageProfile(student)}
            >
              Manage Profile
            </DropdownItem>
          );
        }
        
        if (onManageEnrollments) {
          menuItems.push(
            <DropdownItem
              key="enrollments"
              startContent={<BookOpen className="w-4 h-4" />}
              onClick={() => onManageEnrollments(student)}
            >
              Manage Enrollments
            </DropdownItem>
          );
        }
        
        if (onEdit) {
          menuItems.push(
            <DropdownItem
              key="edit"
              startContent={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(student)}
            >
              Edit Student
            </DropdownItem>
          );
        }
        
        if (onDelete) {
          menuItems.push(
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 className="w-4 h-4" />}
              onClick={() => onDelete(student)}
            >
              Delete Student
            </DropdownItem>
          );
        }

        return (
          <ClientOnly fallback={
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-neutral-500 hover:text-neutral-700"
              aria-label="Student actions"
              isDisabled
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          }>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-700"
                  aria-label="Student actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Student actions">
                {menuItems}
              </DropdownMenu>
            </Dropdown>
          </ClientOnly>
        );
      },
    },
  ];

  const getEnrollmentStatus = (student: StudentProfile) => {
    const count = Number(student.enrollments_count || 0);
    const enrolled = count > 0;
    
    let statusText = 'Not Enrolled';
    let color: 'success' | 'warning' | 'danger' = 'warning';
    
    if (enrolled) {
      if (student.current_enrollment?.group_assigned) {
        statusText = `Assigned (${count})`;
        color = 'success';
      } else if (student.current_enrollment?.status === 'paid') {
        statusText = `Paid - Pending Assignment (${count})`;
        color = 'warning';
      } else {
        statusText = `Enrolled (${count})`;
        color = 'success'; // * Green for enrolled students
      }
    }
    
    return {
      text: statusText,
      color,
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
