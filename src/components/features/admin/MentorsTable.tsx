// * Mentors Table Component
// * Displays mentors data in a table format with actions
// * Follows the same pattern as SkillsTable, GroupsTable, and StudentsTable

"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { MentorProfile } from '@/lib/types';
import { MoreVertical, Eye, User as UserIcon, Users } from 'lucide-react';
import { getSpecializationLabel } from '@/lib/utils/specialization';

interface MentorsTableProps {
  mentors: MentorProfile[];
  onView: (mentor: MentorProfile) => void;
  onManageProfile: (mentor: MentorProfile) => void;
  onManageGroups: (mentor: MentorProfile) => void;
  onAssignSkills?: (mentor: MentorProfile) => void;
}

export function MentorsTable({
  mentors,
  onView,
  onManageProfile,
  onManageGroups,
  onAssignSkills
}: MentorsTableProps) {
  const columns = [
    { key: 'name', label: 'Mentor Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'students', label: 'Current Students' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  const getStatusColor = (mentor: MentorProfile) => {
    if (!mentor.is_active) return 'danger';
    if (mentor.is_available === false) return 'warning';
    return 'success';
  };

  const getStatusText = (mentor: MentorProfile) => {
    if (!mentor.is_active) return 'Inactive';
    if (mentor.is_available === false) return 'Unavailable';
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
        {(mentor: MentorProfile) => (
          <TableRow key={mentor.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">{mentor.full_name || `${mentor.user.first_name} ${mentor.user.last_name}`}</span>
                <span className="text-sm text-neutral-500">ID: {mentor.id}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">{mentor.user.email}</span>
                <span className="text-sm text-neutral-500">Primary contact</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">{getSpecializationLabel(mentor.specialization)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-400" />
                <span className="font-medium">{mentor.current_student_count ?? 0}</span>
                <span className="text-sm text-neutral-500">students</span>
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
                    key="assign"
                    onClick={() => onAssignSkills?.(mentor)}
                    isDisabled={!onAssignSkills}
                  >
                    Assign Skills
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
