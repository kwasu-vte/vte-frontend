// * SkillsTable Component
// * Specialized table for displaying skills with actions
// * Extends the generic DataTable with skill-specific functionality

'use client';

import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { MoreVertical, Edit, Trash2, Eye, Users, Calendar, Plus } from 'lucide-react';
import { Skill } from '@/lib/types';

interface SkillsTableProps {
  skills: Skill[];
  onEdit?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
  onView?: (skill: Skill) => void;
  onManageGroups?: (skill: Skill) => void;
  onManageSchedule?: (skill: Skill) => void;
  onCreate?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function SkillsTable({
  skills,
  onEdit,
  onDelete,
  onView,
  onManageGroups,
  onManageSchedule,
  onCreate,
  isLoading = false,
  error = null,
}: SkillsTableProps) {
  // * Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // * Format allowed levels for display
  const formatAllowedLevels = (levels: string[] | null) => {
    if (!levels || levels.length === 0) return 'None';
    return levels.map(level => `L${level}`).join(', ');
  };

  // * Get capacity status
  const getCapacityStatus = (skill: Skill) => {
    const totalCapacity = skill.max_groups * (skill.max_students_per_group || skill.min_students_per_group);
    const currentEnrollments = skill.enrollments_count;
    const percentage = totalCapacity > 0 ? (currentEnrollments / totalCapacity) * 100 : 0;
    
    if (percentage >= 90) return { color: 'danger', text: 'Full' };
    if (percentage >= 70) return { color: 'warning', text: 'Almost Full' };
    return { color: 'success', text: 'Available' };
  };

  // * Table columns configuration
  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (skill: Skill) => (
        <div className="space-y-1">
          <div className="font-medium text-neutral-900">{skill.title}</div>
          {skill.description && (
            <div className="text-sm text-neutral-500 line-clamp-2">
              {skill.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'groups',
      label: 'Max Groups',
      render: (skill: Skill) => (
        <div className="text-center">
          <div className="font-medium text-neutral-900">
            {skill.groups_count} / {skill.max_groups}
          </div>
          <div className="text-xs text-neutral-500">groups</div>
        </div>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (skill: Skill) => {
        const status = getCapacityStatus(skill);
        return (
          <div className="space-y-1">
            <Chip
              color={status.color as any}
              size="sm"
              variant="flat"
            >
              {status.text}
            </Chip>
            <div className="text-xs text-neutral-500">
              {skill.enrollments_count} enrolled
            </div>
          </div>
        );
      },
    },
    {
      key: 'students_per_group',
      label: 'Students/Group',
      render: (skill: Skill) => (
        <div className="text-center">
          <div className="font-medium text-neutral-900">
            {skill.min_students_per_group}
            {skill.max_students_per_group && skill.max_students_per_group !== skill.min_students_per_group
              ? ` - ${skill.max_students_per_group}`
              : ''
            }
          </div>
          <div className="text-xs text-neutral-500">students</div>
        </div>
      ),
    },
    {
      key: 'allowed_levels',
      label: 'Levels',
      render: (skill: Skill) => (
        <div className="text-sm text-neutral-600">
          {formatAllowedLevels(skill.allowed_levels)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (skill: Skill) => {
        const menuItems = [];
        
        if (onView) {
          menuItems.push(
            <DropdownItem
              key="view"
              startContent={<Eye className="w-4 h-4" />}
              onClick={() => onView(skill)}
            >
              View Details
            </DropdownItem>
          );
        }
        
        if (onEdit) {
          menuItems.push(
            <DropdownItem
              key="edit"
              startContent={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(skill)}
            >
              Edit Skill
            </DropdownItem>
          );
        }
        
        if (onManageGroups) {
          menuItems.push(
            <DropdownItem
              key="groups"
              startContent={<Users className="w-4 h-4" />}
              onClick={() => onManageGroups(skill)}
            >
              Manage Groups
            </DropdownItem>
          );
        }
        
        if (onManageSchedule) {
          menuItems.push(
            <DropdownItem
              key="schedule"
              startContent={<Calendar className="w-4 h-4" />}
              onClick={() => onManageSchedule(skill)}
            >
              Manage Schedule
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
              onClick={() => onDelete(skill)}
            >
              Delete Skill
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
            <DropdownMenu aria-label="Skill actions">
              {menuItems}
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <DataTable
      data={skills}
      isLoading={isLoading}
      error={error}
      columns={columns}
      emptyMessage="No skills found. Create your first skill to get started."
      onRowClick={onView}
      emptyActionButton={
        onCreate ? (
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onClick={onCreate}
          >
            Create Skill
          </Button>
        ) : undefined
      }
    />
  );
}
