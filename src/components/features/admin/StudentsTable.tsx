// * Students Table Component
// * Displays students data in a table format with actions
// * Follows the same pattern as SkillsTable and GroupsTable

'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { User } from '@/lib/types';
import { MoreVertical, Edit, Trash2, Eye, User as UserIcon, BookOpen, Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';

interface StudentsTableProps {
  students: User[];
  onEdit: (student: User) => void;
  onDelete: (student: User) => void;
  onCreate?: () => void;
  onView: (student: User) => void;
  onManageProfile: (student: User) => void;
  onManageEnrollments: (student: User) => void;
}

export function StudentsTable({
  students,
  onEdit,
  onDelete,
  onCreate,
  onView,
  onManageProfile,
  onManageEnrollments
}: StudentsTableProps) {
  const columns = [
    { key: 'name', label: 'Student Name' },
    { key: 'email', label: 'Email' },
    { key: 'matricNumber', label: 'Matric Number' },
    { key: 'level', label: 'Level' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  const getStatusColor = (student: User) => {
    if (!student.is_active) return 'danger';
    if (student.is_superuser) return 'warning';
    return 'success';
  };

  const getStatusText = (student: User) => {
    if (!student.is_active) return 'Inactive';
    if (student.is_superuser) return 'Superuser';
    return 'Active';
  };

  return (
    <DataTable
      data={students}
      columns={columns}
      emptyActionButton={
        onCreate ? (
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onClick={onCreate}
          >
            Add Student
          </Button>
        ) : undefined
      }
    >
      {(student) => (
        <TableRow key={student.id}>
          <TableCell>
            <div className="flex flex-col">
              <span className="font-semibold text-neutral-900">
                {student.first_name} {student.last_name}
              </span>
              <span className="text-sm text-neutral-500">ID: {student.id}</span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="font-medium text-neutral-900">{student.email}</span>
              <span className="text-sm text-neutral-500">Primary contact</span>
            </div>
          </TableCell>
          <TableCell>
            {student.matric_number ? (
              <span className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">
                {student.matric_number}
              </span>
            ) : (
              <span className="text-neutral-400 italic">Not assigned</span>
            )}
          </TableCell>
          <TableCell>
            {student.level ? (
              <Chip
                color="primary"
                variant="flat"
                size="sm"
              >
                {student.level} Level
              </Chip>
            ) : (
              <span className="text-neutral-400 italic">Not specified</span>
            )}
          </TableCell>
          <TableCell>
            <Chip
              color={getStatusColor(student)}
              variant="flat"
              size="sm"
            >
              {getStatusText(student)}
            </Chip>
          </TableCell>
          <TableCell>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Student actions">
                <DropdownItem
                  key="view"
                  startContent={<Eye className="w-4 h-4" />}
                  onClick={() => onView(student)}
                >
                  View Details
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  startContent={<Edit className="w-4 h-4" />}
                  onClick={() => onEdit(student)}
                >
                  Edit Student
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  startContent={<UserIcon className="w-4 h-4" />}
                  onClick={() => onManageProfile(student)}
                >
                  Manage Profile
                </DropdownItem>
                <DropdownItem
                  key="enrollments"
                  startContent={<BookOpen className="w-4 h-4" />}
                  onClick={() => onManageEnrollments(student)}
                >
                  Manage Enrollments
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<Trash2 className="w-4 h-4" />}
                  onClick={() => onDelete(student)}
                >
                  Delete Student
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}
