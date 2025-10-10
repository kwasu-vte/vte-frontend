// * Mentors Table Component
// * Displays mentors data in a table format with actions
// * Follows the same pattern as SkillsTable, GroupsTable, and StudentsTable

"use client";

import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { MoreVertical, Eye, User as UserIcon, Users, Plus } from 'lucide-react';
import { MentorProfile } from '@/lib/types';
import { getSpecializationLabel } from '@/lib/utils/specialization';

interface MentorsTableProps {
  mentors: MentorProfile[];
  onView: (mentor: MentorProfile) => void;
  onManageProfile: (mentor: MentorProfile) => void;
  onManageGroups: (mentor: MentorProfile) => void;
  onAssignSkills?: (mentor: MentorProfile) => void;
  onCreate?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function MentorsTable({
  mentors,
  onView,
  onManageProfile,
  onManageGroups,
  onAssignSkills,
  onCreate,
  isLoading = false,
  error = null,
}: MentorsTableProps) {

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

  // * Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Mentor Name',
      render: (mentor: MentorProfile) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{mentor.full_name || `${mentor.user.first_name} ${mentor.user.last_name}`}</span>
          <span className="text-sm text-neutral-500">ID: {mentor.id}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (mentor: MentorProfile) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900">{mentor.user.email}</span>
          <span className="text-sm text-neutral-500">Primary contact</span>
        </div>
      ),
    },
    {
      key: 'specialization',
      label: 'Specialization',
      render: (mentor: MentorProfile) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900">{getSpecializationLabel(mentor.specialization)}</span>
        </div>
      ),
    },
    {
      key: 'skills',
      label: 'Skills',
      render: (mentor: MentorProfile) => {
        let count = 0
        if (mentor.statistics?.assigned_skills_count) {
          const n = Number(mentor.statistics.assigned_skills_count as unknown as string)
          count = Number.isFinite(n) ? n : 0
        } else if (mentor.assigned_skills) {
          try {
            const parsed = typeof mentor.assigned_skills === 'string' ? JSON.parse(mentor.assigned_skills) : mentor.assigned_skills as any
            if (Array.isArray(parsed)) count = parsed.length
          } catch {
            count = 0
          }
        }
        return (
          <Chip variant="flat" size="sm">{count}</Chip>
        )
      },
    },
    {
      key: 'students',
      label: 'Current Students',
      render: (mentor: MentorProfile) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-400" />
          <span className="font-medium">{mentor.current_student_count ?? 0}</span>
          <span className="text-sm text-neutral-500">students</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (mentor: MentorProfile) => (
        <Chip
          color={getStatusColor(mentor)}
          variant="flat"
          size="sm"
        >
          {getStatusText(mentor)}
        </Chip>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (mentor: MentorProfile) => {
        const menuItems = [];
        
        if (onView) {
          menuItems.push(
            <DropdownItem
              key="view"
              startContent={<Eye className="w-4 h-4" />}
              onClick={() => onView(mentor)}
            >
              View Details
            </DropdownItem>
          );
        }
        
        if (onManageProfile) {
          menuItems.push(
            <DropdownItem
              key="profile"
              startContent={<UserIcon className="w-4 h-4" />}
              onClick={() => onManageProfile(mentor)}
            >
              Manage Profile
            </DropdownItem>
          );
        }
        
        if (onManageGroups) {
          menuItems.push(
            <DropdownItem
              key="groups"
              startContent={<Users className="w-4 h-4" />}
              onClick={() => onManageGroups(mentor)}
            >
              Manage Groups
            </DropdownItem>
          );
        }
        
        if (onAssignSkills) {
          menuItems.push(
            <DropdownItem
              key="assign"
              onClick={() => onAssignSkills(mentor)}
            >
              Assign Skills
            </DropdownItem>
          );
        }

        return (
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-neutral-500 hover:text-neutral-700"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Mentor actions">
              {menuItems}
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <DataTable
      data={mentors}
      isLoading={isLoading}
      error={error}
      columns={columns}
      emptyMessage="No mentors found. Create your first mentor to get started."
      onRowClick={onView}
      emptyActionButton={
        onCreate ? (
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onClick={onCreate}
          >
            Add Mentor
          </Button>
        ) : undefined
      }
    />
  );
}