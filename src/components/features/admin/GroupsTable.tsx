// * Groups Table Component
// * Displays groups data in a table format with actions
// * Follows the same pattern as SkillsTable

'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Group } from '@/lib/types';
import { MoreVertical, Edit, Trash2, Eye, Users, Calendar } from 'lucide-react';

interface GroupsTableProps {
  groups: Group[];
  onView?: (group: Group) => void;
  onEdit?: (group: Group) => void;
  onDelete?: (group: Group) => void;
  onManageMembers?: (group: Group) => void;
  onManageAttendance?: (group: Group) => void;
}

export function GroupsTable({
  groups,
  onEdit,
  onDelete,
  onView,
  onManageMembers,
  onManageAttendance
}: GroupsTableProps) {
  const columns = [
    { key: 'name', label: 'Group Name' },
    { key: 'skill', label: 'Skill' },
    { key: 'mentor', label: 'Mentor' },
    { key: 'members', label: 'Members' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  const getStatusColor = (group: Group) => {
    if (group.members.length === 0) return 'default';
    if (group.members.length < 5) return 'warning';
    return 'success';
  };

  const getStatusText = (group: Group) => {
    if (group.members.length === 0) return 'Empty';
    if (group.members.length < 5) return 'Low';
    return 'Active';
  };

  return (
    <Table aria-label="Groups table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={groups}>
        {(group) => (
          <TableRow key={group.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">{group.name}</span>
                <span className="text-sm text-neutral-500">ID: {group.id}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">{group.skill.title}</span>
                <span className="text-sm text-neutral-500">{group.skill.id}</span>
              </div>
            </TableCell>
            <TableCell>
              {group.mentor ? (
                <div className="flex flex-col">
                  <span className="font-medium text-neutral-900">
                    {group.mentor.first_name} {group.mentor.last_name}
                  </span>
                  <span className="text-sm text-neutral-500">{group.mentor.id}</span>
                </div>
              ) : (
                <span className="text-neutral-400 italic">No mentor assigned</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-400" />
                <span className="font-medium">{group.members.length}</span>
                <span className="text-sm text-neutral-500">members</span>
              </div>
            </TableCell>
            <TableCell>
              <Chip
                color={getStatusColor(group)}
                variant="flat"
                size="sm"
              >
                {getStatusText(group)}
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
                <DropdownMenu aria-label="Group actions">
                  <DropdownItem
                    key="view"
                    startContent={<Eye className="w-4 h-4" />}
                    onClick={() => onView?.(group)}
                    isDisabled={!onView}
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={<Edit className="w-4 h-4" />}
                    onClick={() => onEdit?.(group)}
                    isDisabled={!onEdit}
                  >
                    Edit Group
                  </DropdownItem>
                  <DropdownItem
                    key="members"
                    startContent={<Users className="w-4 h-4" />}
                    onClick={() => onManageMembers?.(group)}
                    isDisabled={!onManageMembers}
                  >
                    Manage Members
                  </DropdownItem>
                  <DropdownItem
                    key="attendance"
                    startContent={<Calendar className="w-4 h-4" />}
                    onClick={() => onManageAttendance?.(group)}
                    isDisabled={!onManageAttendance}
                  >
                    Manage Attendance
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<Trash2 className="w-4 h-4" />}
                    onClick={() => onDelete?.(group)}
                    isDisabled={!onDelete}
                  >
                    Delete Group
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
