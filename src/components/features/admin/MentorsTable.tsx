// * Mentors Table Component
// * Displays mentors data in a table format with actions
// * Follows the same pattern as SkillsTable, GroupsTable, and StudentsTable

'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { User } from '@/lib/types';
import { MoreVertical, Edit, Trash2, Eye, User as UserIcon, Users } from 'lucide-react';

interface MentorsTableProps {
  mentors: User[];
  onEdit: (mentor: User) => void;
  onDelete: (mentor: User) => void;
  onView: (mentor: User) => void;
  onManageProfile: (mentor: User) => void;
  onManageGroups: (mentor: User) => void;
}

export function MentorsTable({
  mentors,
  onEdit,
  onDelete,
  onView,
  onManageProfile,
  onManageGroups
}: MentorsTableProps) {
  const columns = [
    { key: 'name', label: 'Mentor Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'groups', label: 'Groups' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  const getStatusColor = (mentor: User) => {
    if (!mentor.is_active) return 'danger';
    if (mentor.is_superuser) return 'warning';
    return 'success';
  };

  const getStatusText = (mentor: User) => {
    if (!mentor.is_active) return 'Inactive';
    if (mentor.is_superuser) return 'Superuser';
    return 'Active';
  };

  return (
    <Table aria-label="Mentors table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={mentors}>
        {(mentor) => (
          <TableRow key={mentor.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">
                  {mentor.first_name} {mentor.last_name}
                </span>
                <span className="text-sm text-neutral-500">ID: {mentor.id}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">{mentor.email}</span>
                <span className="text-sm text-neutral-500">Primary contact</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">
                  {mentor.specialization || 'General'}
                </span>
                <span className="text-sm text-neutral-500">
                  {mentor.experience || 'No experience specified'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-400" />
                <span className="font-medium">
                  {mentor.groups?.length || 0}
                </span>
                <span className="text-sm text-neutral-500">groups</span>
              </div>
            </TableCell>
            <TableCell>
              <Chip
                color={getStatusColor(mentor)}
                variant="flat"
                size="sm"
              >
                {getStatusText(mentor)}
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
                <DropdownMenu aria-label="Mentor actions">
                  <DropdownItem
                    key="view"
                    startContent={<Eye className="w-4 h-4" />}
                    onClick={() => onView(mentor)}
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={<Edit className="w-4 h-4" />}
                    onClick={() => onEdit(mentor)}
                  >
                    Edit Mentor
                  </DropdownItem>
                  <DropdownItem
                    key="profile"
                    startContent={<UserIcon className="w-4 h-4" />}
                    onClick={() => onManageProfile(mentor)}
                  >
                    Manage Profile
                  </DropdownItem>
                  <DropdownItem
                    key="groups"
                    startContent={<Users className="w-4 h-4" />}
                    onClick={() => onManageGroups(mentor)}
                  >
                    Manage Groups
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<Trash2 className="w-4 h-4" />}
                    onClick={() => onDelete(mentor)}
                  >
                    Delete Mentor
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
