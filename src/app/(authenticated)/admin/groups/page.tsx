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
import type { Group } from '@/lib/types';

export default function AdminGroupsPage() {
  const [viewGroup, setViewGroup] = useState<Group | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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
        members: [],
        creation_date: g.created_at ?? '',
        end_date: g.updated_at ?? ''
      })) as unknown as Group[];
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
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-600">Name:</span>
                      <span className="ml-2 font-medium">{viewGroup.name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">ID:</span>
                      <span className="ml-2 font-medium">{viewGroup.id}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Skill:</span>
                      <span className="ml-2 font-medium">{viewGroup.skill.title}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Mentor:</span>
                      <span className="ml-2 font-medium">{viewGroup.mentor ? `${viewGroup.mentor.first_name} ${viewGroup.mentor.last_name}` : '—'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Created:</span>
                      <span className="ml-2 font-medium">{viewGroup.creation_date}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Ends:</span>
                      <span className="ml-2 font-medium">{viewGroup.end_date}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Members ({viewGroup.members?.length || 0})</h3>
                  <div className="space-y-2">
                    {(viewGroup.members || []).map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-sm bg-white border border-neutral-200 rounded p-2">
                        <span className="font-medium text-neutral-900">{m.first_name} {m.last_name}</span>
                        <span className="text-neutral-500">{m.id}</span>
                      </div>
                    ))}
                    {(!viewGroup.members || viewGroup.members.length === 0) && (
                      <div className="text-sm text-neutral-500 italic">No members yet.</div>
                    )}
                  </div>
                </div>
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
