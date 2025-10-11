// * Admin Groups Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills page

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { GroupsTable } from '@/components/features/admin/GroupsTable';
import { skillGroupsApi } from '@/lib/api';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody, Chip, Select, SelectItem } from '@heroui/react';
import { Eye, Filter } from 'lucide-react';
import type { Group, SkillGroup } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminGroupsPage() {
  const [viewGroup, setViewGroup] = useState<Group | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // * Initialize filter from query params
  useEffect(() => {
    const skillId = searchParams.get('skill_id');
    if (skillId) {
      setSelectedSkillFilter(skillId);
    }
  }, [searchParams]);

  // * Update URL when filter changes
  const updateFilter = (skillId: string) => {
    setSelectedSkillFilter(skillId);
    const params = new URLSearchParams(searchParams.toString());
    if (skillId === 'all') {
      params.delete('skill_id');
    } else {
      params.set('skill_id', skillId);
    }
    router.push(`/admin/groups?${params.toString()}`, { scroll: false });
  };

  // * Fetch detailed skill group data for view modal
  const { data: detailedGroupData, isLoading: isDetailedLoading } = useClientQuery({
    queryKey: ['skill-group-details', viewGroup?.id],
    queryFn: async () => {
      if (!viewGroup?.id) return null;
      const res = await skillGroupsApi.getById(Number(viewGroup.id));
      return res.data;
    },
    enabled: !!viewGroup?.id && isViewOpen,
  });

  // * React Query for data fetching - only run on client
  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useClientQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      // * No direct groups list API; derive from skill groups
      const res = await skillGroupsApi.list({ per_page: 100 });
      const results = res.data?.items ?? [];
      // * Map to Group[] shape for this table (best-effort)
      const mapped = results.map((g: SkillGroup) => ({
        id: String(g.id),
        name: g.group_display_name || `Group ${g.group_number}`,
        skill: { id: String(g.skill?.id ?? ''), title: g.skill?.title ?? 'Unknown' },
        mentor: null,
        members: Array.from({ length: Number(g.current_student_count) || 0 }, (_, i) => ({ 
          id: `member-${i}`, 
          first_name: 'Student', 
          last_name: `${i + 1}` 
        })), // * Create placeholder members based on count
        creation_date: g.created_at ?? '',
        end_date: g.updated_at ?? '',
        // * Store original skill group data for detailed view
        skillGroupData: g
      })) as unknown as (Group & { skillGroupData: any })[];
      return mapped;
    },
  });

  // * Get unique skills for filter
  const uniqueSkills = useMemo(() => {
    if (!groups) return []
    const skills = groups.map(group => group.skill)
    const unique = skills.filter((skill, index, self) => 
      index === self.findIndex(s => s.id === skill.id)
    )
    return unique
  }, [groups])

  // * Filter groups by selected skill
  const filteredGroups = useMemo(() => {
    if (!groups) return []
    
    if (selectedSkillFilter === 'all') return groups
    
    return groups.filter(group => group.skill.id === selectedSkillFilter)
  }, [groups, selectedSkillFilter])

  // * Read-only view: open details modal
  const handleView = (group: Group) => {
    setViewGroup(group);
    setIsViewOpen(true);
  };
  const closeView = () => {
    setIsViewOpen(false);
    setViewGroup(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Groups</h1>
          <p className="text-neutral-600 mt-1">
            View groups and their status. Creation and editing are disabled.
          </p>
        </div>
      </div>

      {/* Info: How to use */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm">
        View groups and their capacity. Use the eye icon to view group details. Creation and editing are disabled here.
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
          <div className="flex gap-4 items-center">
            <div className="w-full md:w-80">
              <Select
                label="Filter by Skill"
                placeholder="Select a skill"
                selectedKeys={selectedSkillFilter !== 'all' ? [selectedSkillFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  const value = selected || 'all';
                  updateFilter(value)
                }}
                variant="bordered"
                items={[{ key: 'all', title: 'All Skills' }, ...uniqueSkills.map(skill => ({ key: skill.id, title: skill.title }))]}
              >
                {(skill) => <SelectItem key={skill.key}>{skill.title}</SelectItem>}
              </Select>
            </div>
            <Chip variant="flat" color="primary">
              {filteredGroups?.length || 0} groups
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* * Groups Table with StateRenderer */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Groups</p>
            <Chip variant="flat">{filteredGroups?.length || 0}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <StateRenderer
            data={filteredGroups}
            isLoading={isLoading}
            error={error}
            loadingComponent={<div className="py-2"><DefaultLoadingComponent /></div>}
            errorComponent={<div className="py-2"><DefaultErrorComponent error={error!} onRetry={() => refetch()} /></div>}
            emptyComponent={<div className="py-6"><DefaultEmptyComponent message="No groups found." /></div>}
          >
            {(data) => (
              <GroupsTable
                groups={data}
                onView={(group) => handleView(group)}
              />
            )}
          </StateRenderer>
        </CardBody>
      </Card>

      {/* * Debug Information (hidden in production) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="bg-neutral-50 p-4 rounded-lg">
          <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
          <div className="text-sm text-neutral-600 space-y-1">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error ? (error as Error).message : 'None'}</p>
            <p><strong>Data Count:</strong> {groups?.length || 0}</p>
            <p><strong>Query Key:</strong> ['groups']</p>
            <p><strong>Mode:</strong> Read-only</p>
          </div>
        </div>
      )}

      {/* * View Group Modal (read-only) */}
      <Modal isOpen={isViewOpen} onClose={closeView} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Group Details</h2>
                <p className="text-sm text-neutral-500">Comprehensive information about this skill group</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="px-6 py-4">
            {viewGroup && (
              <div className="space-y-6">
                {isDetailedLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                      <div className="text-neutral-500">Loading group details...</div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* * Group Overview Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                            {detailedGroupData?.group_display_name || viewGroup.name}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {detailedGroupData?.skill?.title || viewGroup.skill.title}
                          </p>
                        </div>
                        <Chip 
                          color={detailedGroupData?.is_full ? 'danger' : detailedGroupData?.has_capacity ? 'success' : 'warning'}
                          variant="flat"
                          size="sm"
                        >
                          {detailedGroupData?.is_full ? 'Full' : detailedGroupData?.has_capacity ? 'Available' : 'Limited'}
                        </Chip>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{detailedGroupData?.current_student_count || 0}</div>
                          <div className="text-xs text-neutral-600">Current Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-neutral-700">{detailedGroupData?.max_student_capacity || 0}</div>
                          <div className="text-xs text-neutral-600">Max Capacity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{detailedGroupData?.capacity_percentage || 0}%</div>
                          <div className="text-xs text-neutral-600">Utilization</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{detailedGroupData?.capacity_remaining || 0}</div>
                          <div className="text-xs text-neutral-600">Spots Left</div>
                        </div>
                      </div>
                    </div>

                    {/* * Capacity Progress */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Capacity Overview
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-700">Current Usage</span>
                          <span className="text-sm font-semibold text-neutral-900">
                            {detailedGroupData?.current_student_count || 0} / {detailedGroupData?.max_student_capacity || 0} students
                          </span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-neutral-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${Math.min(detailedGroupData?.capacity_percentage || 0, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-neutral-500 mt-2">
                            <span>0%</span>
                            <span className="font-medium">{detailedGroupData?.capacity_percentage || 0}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* * Skill Information */}
                    {detailedGroupData?.skill && (
                      <div className="bg-white border border-neutral-200 rounded-xl p-6">
                        <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Skill Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Description</label>
                              <p className="text-sm text-neutral-700 mt-1">{detailedGroupData.skill.description || 'No description provided'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Allowed Levels</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {detailedGroupData.skill.allowed_levels?.map((level: string) => (
                                  <Chip key={level} size="sm" variant="flat" color="primary">{level}</Chip>
                                )) || <span className="text-sm text-neutral-500">No restrictions</span>}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Min Students</label>
                                <p className="text-sm font-semibold text-neutral-900 mt-1">{detailedGroupData.skill.min_students_per_group || '—'}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Max Students</label>
                                <p className="text-sm font-semibold text-neutral-900 mt-1">{detailedGroupData.skill.max_students_per_group || '—'}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Weekend Exclusion</label>
                              <div className="mt-1">
                                <Chip 
                                  size="sm" 
                                  variant="flat" 
                                  color={detailedGroupData.skill.exclude_weekends ? 'warning' : 'success'}
                                >
                                  {detailedGroupData.skill.exclude_weekends ? 'Excluded' : 'Included'}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* * Academic Session & Metadata */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Session & Metadata
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Academic Session</label>
                          <p className="text-sm font-semibold text-neutral-900 mt-1">
                            {detailedGroupData?.academic_session?.name || 'No session assigned'}
                          </p>
                          {detailedGroupData?.academic_session && (
                            <div className="text-xs text-neutral-600 mt-1">
                              {detailedGroupData.academic_session.starts_at ? new Date(detailedGroupData.academic_session.starts_at).toLocaleDateString() : 'N/A'} - {detailedGroupData.academic_session.ends_at ? new Date(detailedGroupData.academic_session.ends_at).toLocaleDateString() : 'N/A'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Created Date</label>
                          <p className="text-sm font-semibold text-neutral-900 mt-1">
                            {detailedGroupData?.created_at ? new Date(detailedGroupData.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter className="px-6 py-4">
            <Button 
              color="primary" 
              variant="light" 
              onClick={closeView}
              className="font-medium"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
