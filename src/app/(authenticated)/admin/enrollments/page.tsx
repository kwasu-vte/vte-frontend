'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Enrollment, PaginatedResponse } from '@/lib/types';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent } from '@/components/shared/StateRenderer';
import EnrollmentFilters from '@/components/features/admin/EnrollmentFilters';
import EnrollmentsTable from '@/components/features/admin/EnrollmentsTable';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import { RefreshCw } from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const [filters, setFilters] = useState<{ academic_session_id?: number; skill_id?: string; per_page?: number }>({ per_page: 25 });
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignEnrollmentId, setAssignEnrollmentId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-enrollments', filters],
    queryFn: async () => (await api.getAllEnrollments(filters)).data as PaginatedResponse<Enrollment>,
    enabled: typeof window !== 'undefined',
  });
  const { data: groupsData } = useQuery({
    queryKey: ['skill-groups', { skill_id: filters.skill_id }],
    queryFn: async () => {
      const res = await api.getSkillGroups({ per_page: 100, ...(filters.skill_id ? { skill_id: Number(filters.skill_id) } : {}) })
      return res.data?.results ?? []
    },
    enabled: typeof window !== 'undefined',
  })
  const groupOptions = (groupsData || []).map((g: any) => ({ id: String(g.id), name: g.group_display_name || `Group ${g.group_number}` }))

  async function openAssign(enrollmentId: number) {
    setAssignEnrollmentId(enrollmentId)
    setAssignOpen(true)
  }

  async function handleAssignConfirm() {
    if (!assignEnrollmentId || !selectedGroupId) return
    await api.assignStudentToGroup(Number(selectedGroupId), { enrollment_id: assignEnrollmentId })
    setAssignOpen(false)
    setAssignEnrollmentId(null)
    setSelectedGroupId("")
    refetch()
  }

  async function handleAutoAssign() {
    if (!filters.skill_id || !filters.academic_session_id) return
    await api.autoAssignStudentsToGroups(filters.skill_id, { academic_session_id: filters.academic_session_id })
    refetch()
  }

  const rows = useMemo(() => data?.results ?? [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Enrollments</h1>
          <p className="text-neutral-600 mt-1">Filter, review and assign enrollments.</p>
        </div>
        <Button variant="light" startContent={<RefreshCw className="w-4 h-4" />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
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
          loadingComponent={<div className="p-6"><DefaultLoadingComponent /></div>}
          errorComponent={<div className="p-6"><DefaultErrorComponent error={error as Error} onRetry={() => refetch()} /></div>}
          emptyComponent={<div className="p-6 text-center text-neutral-600">No enrollments found.</div>}
        >
          {(items) => (
            <div className="p-4">
              <EnrollmentsTable
                enrollments={items}
                perPage={filters.per_page ?? 25}
                onAssignGroup={(id) => openAssign(id)}
              />
            </div>
          )}
        </StateRenderer>
      </div>

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
              {groupOptions.map((g) => (
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


