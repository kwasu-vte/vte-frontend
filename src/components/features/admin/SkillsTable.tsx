// * SkillsTable Component
// * Specialized table for displaying skills with actions
// * Extends the generic DataTable with skill-specific functionality

'use client';

import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { MoreVertical, Edit, Trash2, Eye, Users, Plus, UserCheck } from 'lucide-react';
import { Skill } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ClientOnly } from '@/components/shared/ClientOnly';

interface SkillsTableProps {
  skills: Skill[];
  onEdit?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
  onView?: (skill: Skill) => void;
  onManageGroups?: (skill: Skill) => void;
  onManageEnrollments?: (skill: Skill) => void;
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
  onManageEnrollments,
  onCreate,
  isLoading = false,
  error = null,
}: SkillsTableProps) {
  const router = useRouter();
  console.log('[SkillsTable] Received props:', {
    skills,
    skillsLength: skills?.length,
    isLoading,
    error,
    skillsType: typeof skills,
    skillsIsArray: Array.isArray(skills)
  });
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
      label: 'Skill',
      render: (skill: Skill) => (
        <div className="space-y-2">
          <div className="font-semibold text-neutral-900 text-base">{skill.title}</div>
          {skill.description && (
            <div className="text-sm text-neutral-600 line-clamp-2 max-w-xs">
              {skill.description}
            </div>
          )}
          {skill.allowed_levels && skill.allowed_levels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.allowed_levels.slice(0, 3).map((level: string) => (
                <Chip key={level} size="sm" variant="flat" color="primary" className="text-xs">
                  L{level}
                </Chip>
              ))}
              {skill.allowed_levels.length > 3 && (
                <Chip size="sm" variant="flat" color="default" className="text-xs">
                  +{skill.allowed_levels.length - 3}
                </Chip>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'groups',
      label: 'Groups',
      render: (skill: Skill) => (
        <div className="text-center space-y-1">
          <div className="text-lg font-bold text-blue-600">
            {skill.groups_count || 0}
          </div>
          <div className="text-xs text-neutral-500">
            of {skill.max_groups || 0} max
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ 
                width: `${skill.max_groups ? Math.min(((skill.groups_count || 0) / skill.max_groups) * 100, 100) : 0}%` 
              }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      key: 'enrollments',
      label: 'Enrollments',
      render: (skill: Skill) => (
        <div className="text-center space-y-1">
          <div className="text-lg font-bold text-green-600">
            {skill.enrollments_count || 0}
          </div>
          <div className="text-xs text-neutral-500">students</div>
        </div>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (skill: Skill) => {
        const status = getCapacityStatus(skill);
        return (
          <div className="space-y-2">
            <Chip
              color={status.color as any}
              size="sm"
              variant="flat"
              className="font-medium"
            >
              {status.text}
            </Chip>
            <div className="text-xs text-neutral-600">
              {skill.min_students_per_group}
              {skill.max_students_per_group && skill.max_students_per_group !== skill.min_students_per_group
                ? ` - ${skill.max_students_per_group}`
                : ''
              } per group
            </div>
          </div>
        );
      },
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
        
        if (onManageEnrollments) {
          menuItems.push(
            <DropdownItem
              key="enrollments"
              startContent={<UserCheck className="w-4 h-4" />}
              onClick={() => onManageEnrollments(skill)}
            >
              Manage Enrollments
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
          <ClientOnly fallback={
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-neutral-500 hover:text-neutral-700"
              aria-label="Skill actions"
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
                  aria-label="Skill actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Skill actions">
                {menuItems}
              </DropdownMenu>
            </Dropdown>
          </ClientOnly>
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
      onRowClick={(skill: Skill) => {
        // Navigate to skill groups per NEW.md pattern
        router.push(`/admin/skills/${skill.id}/groups`)
      }}
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
