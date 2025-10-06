'use client';

import { useMemo, useState } from 'react';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { enrollmentsApi, skillGroupsApi, skillsApi } from '@/lib/api';
import type { Enrollment, PaginatedResponse } from '@/lib/types';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent } from '@/components/shared/StateRenderer';
import EnrollmentFilters from '@/components/features/admin/EnrollmentFilters';
import EnrollmentsTable from '@/components/features/admin/EnrollmentsTable';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Card, CardHeader, CardBody, Chip } from '@nextui-org/react';
import { RefreshCw } from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const [filters, setFilters] = useState<{ academic_session_id?: number; skill_id?: string; per_page?: number }>({ per_page: 25 });
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignEnrollmentId, setAssignEnrollmentId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const { data, isLoading, error, refetch } = useClientQuery({
    queryKey: ['admin-enrollments', filters],
    queryFn: async () => (await enrollmentsApi.getAll(filters)).data as PaginatedResponse<Enrollment>,
  });
  const { data: groupsData } = useClientQuery({
    queryKey: ['skill-groups', { skill_id: filters.skill_id }],
    queryFn: async () => {
      const res = await skillGroupsApi.list({ per_page: 100, ...(filters.skill_id ? { skill_id: Number(filters.skill_id) } : {}) })
      return res.data?.items ?? []
    },
  })
  const groupOptions = (groupsData || []).map((g) => ({ id: String(g.id), name: g.group_display_name || `Group ${g.group_number}` }))

  async function openAssign(enrollmentId: number) {
    setAssignEnrollmentId(enrollmentId)
    setAssignOpen(true)
  }

  async function handleAssignConfirm() {
    if (!assignEnrollmentId || !selectedGroupId) return
    await skillGroupsApi.assignStudent(Number(selectedGroupId), { enrollment_id: assignEnrollmentId })
    setAssignOpen(false)
    setAssignEnrollmentId(null)
    setSelectedGroupId("")
    refetch()
  }

  async function handleAutoAssign() {
    if (!filters.skill_id || !filters.academic_session_id) return
    await skillsApi.autoAssignStudentsToGroups(filters.skill_id, { academic_session_id: filters.academic_session_id })
    refetch()
  }

  const rows = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Enrollments</h1>
          <p className="text-neutral-600 mt-1">Filter, review and assign enrollments.</p>
        </div>
        <Button
          variant="light"
          startContent={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />}
          aria-label="Refresh enrollments"
          isDisabled={isLoading}
          onClick={() => refetch()}
        >
          {isLoading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Enrollments</p>
            <Chip variant="flat">{rows.length}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <div className="mb-4">
            <EnrollmentFilters
              value={filters}
              onChange={(v) => setFilters((s) => ({ ...s, ...v }))}
              defaultPerPage={25}
            />
          </div>
          <StateRenderer
            data={rows}
            isLoading={isLoading}
            error={error as Error | null}
            loadingComponent={<div className="py-2"><DefaultLoadingComponent /></div>}
            errorComponent={<div className="py-2"><DefaultErrorComponent error={error as Error} onRetry={() => refetch()} /></div>}
            emptyComponent={<div className="py-6 text-center text-neutral-600">No enrollments found.</div>}
          >
            {(items) => (
              <EnrollmentsTable
                enrollments={items}
                perPage={filters.per_page ?? 25}
                onAssignGroup={(id) => openAssign(id)}
              />
            )}
          </StateRenderer>
        </CardBody>
      </Card>

      {/* Manual Assign Modal */}
      <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} size="md">
        <ModalContent>
          <ModalHeader>Assign to Group</ModalHeader>
          <ModalBody>
            <Select
              label="Group"
              placeholder="Select group"
              selectedKeys={selectedGroupId ? [selectedGroupId] : []}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              {groupOptions.map((g: any) => (
                <SelectItem key={g.id}>{g.name}</SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setAssignOpen(false)}>Cancel</Button>
            <Button color="primary" isDisabled={!selectedGroupId} onPress={handleAssignConfirm}>Assign</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Auto-Assign Button */}
      <div className="flex justify-end">
        <Button color="primary" onClick={handleAutoAssign} isDisabled={!filters.skill_id || !filters.academic_session_id}>Auto-assign to groups</Button>
      </div>
    </div>
  );
}


