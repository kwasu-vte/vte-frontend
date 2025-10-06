'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { authApi, academicSessionsApi } from '@/lib/api';
import type { AcademicSession, User } from '@/lib/types';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Input,
  Chip,
  Divider
} from '@nextui-org/react';
import { 
  CalendarDays, 
  Plus, 
  Edit2, 
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getErrorMessage, getErrorTitle, getSuccessTitle, getSuccessMessage } from '@/lib/error-handling';

// * Uses canonical AcademicSession type from types.ts

export default function AdminSessionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicSession | null>(null);
  const [form, setForm] = useState<{ name: string; starts_at: string; ends_at: string }>({ name: '', starts_at: '', ends_at: '' });

  const queryClient = useQueryClient();
  const { addNotification } = useApp();

  // * Get current user
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError
  } = useClientQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
  });

  const { data: sessions, isLoading, error, refetch } = useClientQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const res = await academicSessionsApi.getAll();
      return res.data as AcademicSession[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return (await academicSessionsApi.update(editing.id, {
          starts_at: form.starts_at || undefined,
          ends_at: form.ends_at || undefined,
        })).data;
      }
      return (await academicSessionsApi.create({
        name: form.name,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
      })).data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      setIsModalOpen(false);
      setEditing(null);
      setForm({ name: '', starts_at: '', ends_at: '' });
      addNotification({
        type: 'success',
        title: getSuccessTitle(editing ? 'update' : 'create', 'academic session'),
        message: getSuccessMessage(response, `Academic session ${editing ? 'updated' : 'created'} successfully.`),
      });
    },
    onError: (error: any) => {
      console.error(`Error ${editing ? 'updating' : 'creating'} academic session:`, error);
      addNotification({
        type: 'error',
        title: getErrorTitle(editing ? 'update' : 'create', 'academic session'),
        message: getErrorMessage(error, `An unexpected error occurred while ${editing ? 'updating' : 'creating'} the academic session.`),
      });
    },
  });

  const startMutation = useMutation({
    mutationFn: async (id: number) => (await academicSessionsApi.start(id)).data,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      addNotification({
        type: 'success',
        title: 'Session Started',
        message: getSuccessMessage(response, 'Academic session started successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error starting academic session:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Start Session',
        message: getErrorMessage(error, 'An unexpected error occurred while starting the academic session.'),
      });
    },
  });

  const endMutation = useMutation({
    mutationFn: async (id: number) => (await academicSessionsApi.end(id)).data,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      addNotification({
        type: 'success',
        title: 'Session Ended',
        message: getSuccessMessage(response, 'Academic session ended successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error ending academic session:', error);
      addNotification({
        type: 'error',
        title: 'Failed to End Session',
        message: getErrorMessage(error, 'An unexpected error occurred while ending the academic session.'),
      });
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

  const hasActive = (sessions || []).some((s) => s.active)

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">System Settings</h1>
          <p className="text-neutral-600 mt-1">
            Manage your profile and academic sessions
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onClick={openCreate}
        >
          Create Academic Session
        </Button>
      </div>

      {/* * Summary */}
      <Card shadow="sm">
        <CardBody className="px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Active Session</span>
              <Chip size="sm" color={hasActive ? 'success' : 'warning'} variant="flat">
                {hasActive ? 'Yes' : 'No'}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Total Sessions</span>
              <Chip size="sm" variant="flat">{(sessions || []).length}</Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* * Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* * Current User Profile */}
        <Card>
          <CardHeader className="flex items-center gap-3 px-4 pt-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Current User Profile</h3>
              <p className="text-sm text-neutral-600">Your account information</p>
            </div>
          </CardHeader>
          <CardBody className="px-4 pb-4">
            {userLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : userError ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">Failed to load user profile</p>
                <p className="text-xs text-gray-500 mt-2">Error: {userError.message}</p>
              </div>
            ) : currentUser ? (
              <div className="space-y-4">
                {/* * Profile Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {currentUser.first_name?.[0]}{currentUser.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">
                      {`${currentUser.first_name} ${currentUser.last_name}`}
                    </h4>
                    <p className="text-sm text-neutral-600">{currentUser.email}</p>
                  </div>
                </div>

                <Divider />

                {/* * Profile Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Role:</span>
                    <Chip color="primary" size="sm" variant="flat">
                      {currentUser.role === 'Admin' ? 'Administrator' :
                       currentUser.role === 'Mentor' ? 'Mentor' :
                       currentUser.role === 'Student' ? 'Student' : 'User'}
                    </Chip>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Status:</span>
                    <Chip color="success" size="sm" variant="flat">
                      Active
                    </Chip>
                  </div>

                  {currentUser.matric_number && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Matric Number:</span>
                      <span className="font-medium">{currentUser.matric_number}</span>
                    </div>
                  )}

                  {currentUser.level && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Academic Level:</span>
                      <span className="font-medium">{currentUser.level} Level</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-600">No user data available</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* * Current Academic Session */}
        <Card>
          <CardHeader className="flex items-center gap-3 px-4 pt-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarDays className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Current Academic Session</h3>
              <p className="text-sm text-neutral-600">Active session information</p>
            </div>
          </CardHeader>
          <CardBody className="px-4 pb-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">Failed to load academic sessions</p>
              </div>
            ) : sessions && sessions.length > 0 ? (
              (() => {
                const currentSession = sessions.find(session => session.active);
                return currentSession ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-neutral-900">{currentSession.name}</h4>
                        <p className="text-sm text-neutral-600">Active Session</p>
                      </div>
                      <Chip color="success" size="sm" variant="flat">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Chip>
                    </div>
                    <Divider />
                    <div className="space-y-2 text-sm">
                      {currentSession.starts_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600">Started:</span>
                          <span>{new Date(currentSession.starts_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {currentSession.ends_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-600">Ends:</span>
                          <span>{new Date(currentSession.ends_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        color="secondary"
                        startContent={<Edit2 className="w-3 h-3" />}
                        onClick={() => openEdit(currentSession)}
                        aria-label="Edit current session"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        startContent={<Edit2 className="w-3 h-3" />}
                        onClick={() => endMutation.mutate(currentSession.id)}
                        isLoading={endMutation.isPending}
                        isDisabled={endMutation.isPending}
                        aria-label="End current session"
                      >
                        End Session
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-neutral-600 mb-4">No active academic session</p>
                    <Button
                      size="sm"
                      color="primary"
                      startContent={<Plus className="w-3 h-3" />}
                      onClick={openCreate}
                      aria-label="Create session"
                    >
                      Create Session
                    </Button>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No academic sessions found</p>
                <Button
                  color="primary"
                  startContent={<Plus className="w-4 h-4" />}
                  onClick={openCreate}
                  aria-label="Create first session"
                >
                  Create First Session
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* * Warning for no active session */}
      {!isLoading && !error && !hasActive && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          No active academic session. Start a session to enable assignments and attendance.
        </div>
      )}

      {/* * All Academic Sessions */}
      <Card>
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarDays className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">All Academic Sessions</h3>
              <p className="text-sm text-neutral-600">Manage all academic sessions</p>
            </div>
          </div>
          <Chip variant="flat">{(sessions || []).length}</Chip>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <StateRenderer
            data={sessions}
            isLoading={isLoading}
            error={error}
            loadingComponent={<div className="p-6"><DefaultLoadingComponent /></div>}
            errorComponent={<div className="p-6"><DefaultErrorComponent error={error!} onRetry={() => refetch()} /></div>}
            emptyComponent={<div className="p-6"><DefaultEmptyComponent message="No sessions found." /></div>}
          >
            {(data: AcademicSession[]) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item) => (
                  <Card key={item.id}>
                    <CardBody className="px-4 py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-neutral-900">{item.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="light" startContent={<Edit2 className="w-4 h-4" />} onClick={() => openEdit(item)} aria-label={`Edit ${item.name}`}>
                            Edit
                          </Button>
                          {!item.active && (
                            <Button size="sm" color="primary" isDisabled={startMutation.isPending} onClick={() => startMutation.mutate(item.id)} aria-label={`Start ${item.name}`}>
                              Start
                            </Button>
                          )}
                          {item.active && (
                            <Button size="sm" color="warning" variant="bordered" isDisabled={endMutation.isPending} onClick={() => endMutation.mutate(item.id)} aria-label={`End ${item.name}`}>
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
        </CardBody>
      </Card>

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

