// * Admin Groups Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills page

'use client';

import { useState } from 'react';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { GroupsTable } from '@/components/features/admin/GroupsTable';
import { skillGroupsApi } from '@/lib/api';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody, Chip } from '@heroui/react';
import { Eye } from 'lucide-react';
import type { Group, SkillGroup } from '@/lib/types';

export default function AdminGroupsPage() {
  const [viewGroup, setViewGroup] = useState<Group | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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
      const mapped = results.map((g: any) => ({
        id: String(g.id),
        name: g.group_display_name || `Group ${g.group_number}`,
        skill: { id: String(g.skill?.id ?? ''), title: g.skill?.title ?? 'Unknown' },
        mentor: null,
        members: Array.from({ length: g.current_student_count || 0 }, (_, i) => ({ 
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

      {/* * Groups Table with StateRenderer */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Groups</p>
            <Chip variant="flat">{groups?.length || 0}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <StateRenderer
            data={groups}
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
            <p><strong>Query Key:</strong> [&apos;groups&apos;]</p>
            <p><strong>Mode:</strong> Read-only</p>
          </div>
        </div>
      )}

      {/* * View Group Modal (read-only) */}
      <Modal isOpen={isViewOpen} onClose={closeView} size="lg" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Group Details</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            {viewGroup && (
              <div className="space-y-4">
                {isDetailedLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-neutral-500">Loading group details...</div>
                  </div>
                ) : (
                  <>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-neutral-600">Group Name:</span>
                          <span className="ml-2 font-medium">{detailedGroupData?.group_display_name || viewGroup.name}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Skill:</span>
                          <span className="ml-2 font-medium">{detailedGroupData?.skill?.title || viewGroup.skill.title}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Current Students:</span>
                          <span className="ml-2 font-medium">{detailedGroupData?.current_student_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Max Capacity:</span>
                          <span className="ml-2 font-medium">{detailedGroupData?.max_student_capacity || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Capacity:</span>
                          <span className="ml-2 font-medium">{detailedGroupData?.capacity_percentage || 0}%</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Status:</span>
                          <span className="ml-2 font-medium">
                            {detailedGroupData?.is_full ? 'Full' : detailedGroupData?.has_capacity ? 'Available' : 'Limited'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Academic Session:</span>
                          <span className="ml-2 font-medium">{detailedGroupData?.academic_session?.name || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Created:</span>
                          <span className="ml-2 font-medium">
                            {detailedGroupData?.created_at ? new Date(detailedGroupData.created_at).toLocaleDateString() : '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {detailedGroupData?.skill && (
                      <div>
                        <h3 className="font-medium text-neutral-900 mb-2">Skill Details</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-neutral-600">Description:</span>
                              <span className="ml-2 font-medium">{detailedGroupData.skill.description || '—'}</span>
                            </div>
                            <div>
                              <span className="text-neutral-600">Max Groups:</span>
                              <span className="ml-2 font-medium">{detailedGroupData.skill.max_groups || '—'}</span>
                            </div>
                            <div>
                              <span className="text-neutral-600">Min Students:</span>
                              <span className="ml-2 font-medium">{detailedGroupData.skill.min_students_per_group || '—'}</span>
                            </div>
                            <div>
                              <span className="text-neutral-600">Max Students:</span>
                              <span className="ml-2 font-medium">{detailedGroupData.skill.max_students_per_group || '—'}</span>
                            </div>
                            <div>
                              <span className="text-neutral-600">Allowed Levels:</span>
                              <span className="ml-2 font-medium">
                                {detailedGroupData.skill.allowed_levels?.join(', ') || '—'}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-600">Exclude Weekends:</span>
                              <span className="ml-2 font-medium">{detailedGroupData.skill.exclude_weekends ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium text-neutral-900 mb-2">Capacity Overview</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-600">Current Usage</span>
                          <span className="text-sm font-medium">{detailedGroupData?.current_student_count || 0} / {detailedGroupData?.max_student_capacity || 0}</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${detailedGroupData?.capacity_percentage || 0}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-500 mt-1">
                          <span>0%</span>
                          <span>{detailedGroupData?.capacity_percentage || 0}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={closeView}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
