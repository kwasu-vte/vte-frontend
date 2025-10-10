'use client';

import { useMemo, useState } from 'react';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { enrollmentsApi, skillGroupsApi, skillsApi } from '@/lib/api';
import type { Enrollment, PaginatedResponse } from '@/lib/types';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent } from '@/components/shared/StateRenderer';
import EnrollmentFilters from '@/components/features/admin/EnrollmentFilters';
import EnrollmentsTable from '@/components/features/admin/EnrollmentsTable';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Card, CardHeader, CardBody, Chip } from '@heroui/react';
import { RefreshCw } from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const [filters, setFilters] = useState<{ academic_session_id?: number; skill_id?: string; per_page?: number }>({ per_page: 25 });
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignEnrollmentId, setAssignEnrollmentId] = useState<number | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignEnrollmentId, setReassignEnrollmentId] = useState<number | null>(null);
  const [reassignFromGroupId, setReassignFromGroupId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const { data, isLoading, error, refetch } = useClientQuery({
    queryKey: ['admin-enrollments', filters],
    queryFn: async () => (await enrollmentsApi.getAll(filters)).data as PaginatedResponse<Enrollment>,
  });
  const { data: groupsData } = useClientQuery({
    queryKey: ['skill-groups', { skill_id: filters.skill_id, academic_session_id: filters.academic_session_id }],
    queryFn: async () => {
      const res = await skillGroupsApi.list({
        per_page: 100,
        has_capacity: true,
        ...(filters.skill_id ? { skill_id: Number(filters.skill_id) } : {}),
        ...(filters.academic_session_id ? { academic_session_id: Number(filters.academic_session_id) } : {}),
      })
      return res.data?.items ?? []
    },
  })
  const groupOptions = (groupsData || []).map((g: any) => ({
    id: String(g.id),
    name: g.group_display_name || `Group ${g.group_number}`,
    current: Number(g.current_student_count ?? 0),
    max: Number(g.max_student_capacity ?? 0),
  }))

  async function openAssign(enrollmentId: number) {
    setAssignEnrollmentId(enrollmentId)
    setAssignOpen(true)
  }

  async function openReassign(enrollmentId: number, fromGroupId: string) {
    setReassignEnrollmentId(enrollmentId)
    setReassignFromGroupId(fromGroupId)
    setSelectedGroupId("")
    setReassignOpen(true)
  }

  async function handleAssignConfirm() {
    if (!assignEnrollmentId || !selectedGroupId) return
    await skillGroupsApi.assignStudent(Number(selectedGroupId), { enrollment_id: assignEnrollmentId })
    setAssignOpen(false)
    setAssignEnrollmentId(null)
    setSelectedGroupId("")
    refetch()
  }

  async function handleReassignConfirm() {
    if (!reassignEnrollmentId || !reassignFromGroupId || !selectedGroupId) return
    await skillGroupsApi.reassignStudent(Number(reassignFromGroupId), Number(selectedGroupId), Number(reassignEnrollmentId))
    setReassignOpen(false)
    setReassignEnrollmentId(null)
    setReassignFromGroupId(null)
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

      {/* Info: How to use */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm">
        Filter by academic session and skill to narrow results. Use the Assign action to place students into groups, or Auto-assign to distribute automatically.
      </div>

      {/* Filters Card (prominent) */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <p className="text-base font-medium text-neutral-900">Filters</p>
          <div className="flex gap-2">
            <Button color="primary" onClick={handleAutoAssign} isDisabled={!filters.skill_id || !filters.academic_session_id}>Auto-assign to groups</Button>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <EnrollmentFilters
            value={filters}
            onChange={(v) => setFilters((s) => ({ ...s, ...v }))}
            defaultPerPage={25}
          />
        </CardBody>
      </Card>

      {/* Results Card */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Enrollments</p>
            <Chip variant="flat">{rows.length}</Chip>
          </div>
          <div>
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
        </CardHeader>
        <CardBody className="px-4 pb-4">
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
                onReassignGroup={(id, fromGroupId) => openReassign(id, fromGroupId)}
                onViewStudent={(userId, enrollment) => {
                  // Prefer reassign flow if assigned; otherwise open profile view in students page
                  const currentGroupId = (enrollment as any)?.group?.id as string | undefined
                  if (currentGroupId) {
                    openReassign(Number(enrollment.id), currentGroupId)
                  } else {
                    window.open(`/admin/students?focus=${encodeURIComponent(userId)}`, '_blank', 'noopener,noreferrer')
                  }
                }}
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
              // label="Group"
              placeholder="Select group"
              selectedKeys={selectedGroupId ? [selectedGroupId] : []}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              {groupOptions.map((g: any) => (
                <SelectItem key={g.id} textValue={g.name}>
                  <div className="flex items-center justify-between w-full">
                    <span>{g.name}</span>
                    <span className="text-xs text-neutral-500">{g.current}/{g.max}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setAssignOpen(false)}>Cancel</Button>
            <Button color="primary" isDisabled={!selectedGroupId} onPress={handleAssignConfirm}>Assign</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Auto-Assign moved into Filters card header */}

      {/* Reassign Modal */}
      <Modal isOpen={reassignOpen} onClose={() => setReassignOpen(false)} size="md">
        <ModalContent>
          <ModalHeader>Reassign to Different Group</ModalHeader>
          <ModalBody>
            <Select
              placeholder="Select new group"
              selectedKeys={selectedGroupId ? [selectedGroupId] : []}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              {groupOptions.map((g: any) => (
                <SelectItem key={g.id} textValue={g.name}>
                  <div className="flex items-center justify-between w-full">
                    <span>{g.name}</span>
                    <span className="text-xs text-neutral-500">{g.current}/{g.max}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setReassignOpen(false)}>Cancel</Button>
            <Button color="primary" isDisabled={!selectedGroupId} onPress={handleReassignConfirm}>Reassign</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}


