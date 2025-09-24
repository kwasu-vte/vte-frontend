'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { api } from '@/lib/api';
import type { AcademicSession } from '@/lib/types';
import { Button, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from '@nextui-org/react';
import { CalendarDays, Plus, Edit2 } from 'lucide-react';

// * Uses canonical AcademicSession type from types.ts

export default function AdminSessionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicSession | null>(null);
  const [form, setForm] = useState<{ name: string; starts_at: string; ends_at: string }>({ name: '', starts_at: '', ends_at: '' });

  const queryClient = useQueryClient();

  const { data: sessions, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const res = await api.getAcademicSessions();
      return res.data as AcademicSession[];
    },
    enabled: typeof window !== 'undefined',
  });

  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return (await api.updateAcademicSession(editing.id, {
          name: form.name || undefined,
          starts_at: form.starts_at || undefined,
          ends_at: form.ends_at || undefined,
        })).data;
      }
      return (await api.createAcademicSession({
        name: form.name,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
      })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      setIsModalOpen(false);
      setEditing(null);
      setForm({ name: '', starts_at: '', ends_at: '' });
    },
  });

  const startMutation = useMutation({
    mutationFn: async (id: number) => (await api.startAcademicSession(id)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
  });

  const endMutation = useMutation({
    mutationFn: async (id: number) => (await api.endAcademicSession(id)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', starts_at: '', ends_at: '' });
    setIsModalOpen(true);
  };

  const openEdit = (session: AcademicSession) => {
    setEditing(session);
    setForm({ name: session.name, starts_at: session.starts_at || '', ends_at: session.ends_at || '' });
    setIsModalOpen(true);
  };

  const submit = async () => {
    await upsertMutation.mutateAsync();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Academic Sessions</h1>
          <p className="text-neutral-600 mt-1">Create and manage academic sessions.</p>
        </div>
        <Button color="primary" startContent={<Plus className="w-4 h-4" />} onClick={openCreate}>
          New Session
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={sessions}
          isLoading={isLoading}
          error={error}
          loadingComponent={<div className="p-6"><DefaultLoadingComponent /></div>}
          errorComponent={<div className="p-6"><DefaultErrorComponent error={error!} onRetry={() => refetch()} /></div>}
          emptyComponent={<div className="p-6"><DefaultEmptyComponent message="No sessions found." /></div>}
        >
          {(data: AcademicSession[]) => (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((item) => (
                <Card key={item.id}>
                  <CardBody className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-neutral-900">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="light" startContent={<Edit2 className="w-4 h-4" />} onClick={() => openEdit(item)}>
                          Edit
                        </Button>
                        {!item.active && (
                          <Button size="sm" color="primary" isDisabled={startMutation.isPending} onClick={() => startMutation.mutate(item.id)}>
                            Start
                          </Button>
                        )}
                        {item.active && (
                          <Button size="sm" color="warning" variant="bordered" isDisabled={endMutation.isPending} onClick={() => endMutation.mutate(item.id)}>
                            End
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600">
                      <p><strong>Start:</strong> {item.starts_at || '—'}</p>
                      <p><strong>End:</strong> {item.ends_at || '—'}</p>
                    </div>
                    {item.active && (
                      <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded w-fit">Active</div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </StateRenderer>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {editing ? 'Edit Session' : 'Create Session'}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input label="Name" placeholder="2024/2025" value={form.name} onValueChange={(v) => setForm((s) => ({ ...s, name: v }))} />
              <Input type="date" label="Start Date" value={form.starts_at} onValueChange={(v) => setForm((s) => ({ ...s, starts_at: v }))} />
              <Input type="date" label="End Date" value={form.ends_at} onValueChange={(v) => setForm((s) => ({ ...s, ends_at: v }))} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={submit} isLoading={upsertMutation.isPending}>
              {editing ? 'Save Changes' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

