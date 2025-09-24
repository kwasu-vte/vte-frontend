// * Admin Settings Page
// * Comprehensive settings page with user profile and academic session management

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User, AcademicSession } from '@/lib/types';
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
  Textarea,
  Accordion,
  AccordionItem,
  Chip,
  Divider
} from '@nextui-org/react';
import { 
  User as UserIcon, 
  Calendar, 
  Plus, 
  Play, 
  Square, 
  Edit, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getErrorMessage, getErrorTitle, getSuccessTitle, getSuccessMessage } from '@/lib/error-handling';

export default function AdminSettingsPage() {
  // * State for modals
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [isViewSessionModalOpen, setIsViewSessionModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AcademicSession | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // * Form state for creating academic session
  const [sessionForm, setSessionForm] = useState({
    name: '',
    starts_at: '',
    ends_at: ''
  });

  const queryClient = useQueryClient();
  const { addNotification } = useApp();

  // * Get current user
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.getCurrentUser();
      return response.data;
    },
    enabled: typeof window !== 'undefined',
  });

  // * Get academic sessions
  const {
    data: academicSessions,
    isLoading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions
  } = useQuery({
    queryKey: ['academicSessions'],
    queryFn: async () => {
      const response = await api.getAcademicSessions();
      return response.data;
    },
    enabled: typeof window !== 'undefined',
  });

  // * Create academic session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (data: { name: string; starts_at?: string; ends_at?: string }) => {
      const response = await api.createAcademicSession(data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
      setIsCreateSessionModalOpen(false);
      setSessionForm({ name: '', starts_at: '', ends_at: '' });
      addNotification({
        type: 'success',
        title: getSuccessTitle('create', 'academic session'),
        message: getSuccessMessage(response, 'Academic session created successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error creating academic session:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('create', 'academic session'),
        message: getErrorMessage(error, 'An unexpected error occurred while creating the academic session.'),
      });
    },
  });

  // * Update academic session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async (data: { name?: string; starts_at?: string; ends_at?: string }) => {
      if (!selectedSession) throw new Error('No session selected');
      const response = await api.updateAcademicSession(selectedSession.id, data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
      setIsEditSessionModalOpen(false);
      setSelectedSession(null);
      addNotification({
        type: 'success',
        title: getSuccessTitle('update', 'academic session'),
        message: getSuccessMessage(response, 'Academic session updated successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error updating academic session:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('update', 'academic session'),
        message: getErrorMessage(error, 'An unexpected error occurred while updating the academic session.'),
      });
    },
  });

  // * Start academic session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await api.startAcademicSession(sessionId);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
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

  // * End academic session mutation
  const endSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await api.endAcademicSession(sessionId);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['academicSessions'] });
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

  // * Handle create session
  const handleCreateSession = async () => {
    setIsSubmitting(true);
    try {
      await createSessionMutation.mutateAsync(sessionForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle update session
  const handleUpdateSession = async () => {
    setIsSubmitting(true);
    try {
      await updateSessionMutation.mutateAsync(sessionForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle start session
  const handleStartSession = async (sessionId: number) => {
    await startSessionMutation.mutateAsync(sessionId);
  };

  // * Handle end session
  const handleEndSession = async (sessionId: number) => {
    await endSessionMutation.mutateAsync(sessionId);
  };

  // * Open create modal
  const openCreateModal = () => {
    setSessionForm({ name: '', starts_at: '', ends_at: '' });
    setIsCreateSessionModalOpen(true);
  };

  // * Open view modal
  const openViewModal = (session: AcademicSession) => {
    setSelectedSession(session);
    setIsViewSessionModalOpen(true);
  };

  // * Open edit modal
  const openEditModal = (session: AcademicSession) => {
    setSelectedSession(session);
    setSessionForm({
      name: session.name,
      starts_at: session.starts_at ? new Date(session.starts_at).toISOString().slice(0, 10) : '',
      ends_at: session.ends_at ? new Date(session.ends_at).toISOString().slice(0, 10) : ''
    });
    setIsEditSessionModalOpen(true);
  };

  // * Close modals
  const closeModals = () => {
    setIsCreateSessionModalOpen(false);
    setIsEditSessionModalOpen(false);
    setIsViewSessionModalOpen(false);
    setSelectedSession(null);
    setSessionForm({ name: '', starts_at: '', ends_at: '' });
  };

  // * Get current active session
  const currentSession = academicSessions?.find(session => session.active);

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
          onClick={openCreateModal}
        >
          Create Academic Session
        </Button>
      </div>

      {/* * Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* * Current User Profile */}
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Current User Profile</h3>
              <p className="text-sm text-neutral-600">Your account information</p>
            </div>
          </CardHeader>
          <CardBody>
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

                  {/* * No created_at on User type */}
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
          <CardHeader className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Current Academic Session</h3>
              <p className="text-sm text-neutral-600">Active session information</p>
            </div>
          </CardHeader>
          <CardBody>
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : sessionsError ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">Failed to load academic sessions</p>
              </div>
            ) : currentSession ? (
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
                    startContent={<Edit className="w-3 h-3" />}
                    onClick={() => openEditModal(currentSession)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    startContent={<Square className="w-3 h-3" />}
                    onClick={() => handleEndSession(currentSession.id)}
                    isLoading={endSessionMutation.isPending}
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
                  onClick={openCreateModal}
                >
                  Create Session
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* * All Academic Sessions */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">All Academic Sessions</h3>
              <p className="text-sm text-neutral-600">Manage all academic sessions</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sessionsError ? (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">Failed to load academic sessions</p>
            </div>
          ) : academicSessions && academicSessions.length > 0 ? (
            <Accordion>
              {academicSessions.map((session) => (
                <AccordionItem
                  key={session.id}
                  title={
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{session.name}</span>
                        {session.active && (
                          <Chip color="success" size="sm" variant="flat">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Chip>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<Eye className="w-3 h-3" />}
                          onClick={() => openViewModal(session)}
                        >
                          View
                        </Button>
                        {!session.active && (
                          <Button
                            size="sm"
                            color="success"
                            startContent={<Play className="w-3 h-3" />}
                            onClick={() => handleStartSession(session.id)}
                            isLoading={startSessionMutation.isPending}
                          >
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Session ID:</span>
                        <span className="ml-2 font-mono">{session.id}</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Status:</span>
                        <Chip 
                          color={session.active ? "success" : "default"} 
                          size="sm" 
                          variant="flat"
                          className="ml-2"
                        >
                          {session.active ? "Active" : "Inactive"}
                        </Chip>
                      </div>
                      {session.starts_at && (
                        <div>
                          <span className="text-neutral-600">Start Date:</span>
                          <span className="ml-2">{new Date(session.starts_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {session.ends_at && (
                        <div>
                          <span className="text-neutral-600">End Date:</span>
                          <span className="ml-2">{new Date(session.ends_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        color="primary"
                        startContent={<Edit className="w-3 h-3" />}
                        onClick={() => openEditModal(session)}
                      >
                        Edit Session
                      </Button>
                      {!session.active && (
                        <Button
                          size="sm"
                          color="success"
                          startContent={<Play className="w-3 h-3" />}
                          onClick={() => handleStartSession(session.id)}
                          isLoading={startSessionMutation.isPending}
                        >
                          Start Session
                        </Button>
                      )}
                      {session.active && (
                        <Button
                          size="sm"
                          color="danger"
                          startContent={<Square className="w-3 h-3" />}
                          onClick={() => handleEndSession(session.id)}
                          isLoading={endSessionMutation.isPending}
                        >
                          End Session
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 mb-4">No academic sessions found</p>
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onClick={openCreateModal}
              >
                Create First Session
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* * Create Academic Session Modal */}
      <Modal
        isOpen={isCreateSessionModalOpen}
        onClose={closeModals}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold">Create Academic Session</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Session Name"
                placeholder="e.g., 2024/2025 Academic Year"
                value={sessionForm.name}
                onChange={(e) => setSessionForm(prev => ({ ...prev, name: e.target.value }))}
                isRequired
              />
              <Input
                label="Start Date"
                type="date"
                value={sessionForm.starts_at}
                onChange={(e) => setSessionForm(prev => ({ ...prev, starts_at: e.target.value }))}
              />
              <Input
                label="End Date"
                type="date"
                value={sessionForm.ends_at}
                onChange={(e) => setSessionForm(prev => ({ ...prev, ends_at: e.target.value }))}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={closeModals}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleCreateSession}
              isLoading={isSubmitting}
              isDisabled={!sessionForm.name.trim() || isSubmitting}
            >
              Create Session
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Edit Academic Session Modal */}
      <Modal
        isOpen={isEditSessionModalOpen}
        onClose={closeModals}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold">Edit Academic Session</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Session Name"
                placeholder="e.g., 2024/2025 Academic Year"
                value={sessionForm.name}
                onChange={(e) => setSessionForm(prev => ({ ...prev, name: e.target.value }))}
                isRequired
              />
              <Input
                label="Start Date"
                type="date"
                value={sessionForm.starts_at}
                onChange={(e) => setSessionForm(prev => ({ ...prev, starts_at: e.target.value }))}
              />
              <Input
                label="End Date"
                type="date"
                value={sessionForm.ends_at}
                onChange={(e) => setSessionForm(prev => ({ ...prev, ends_at: e.target.value }))}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={closeModals}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleUpdateSession}
              isLoading={isSubmitting}
              isDisabled={!sessionForm.name.trim() || isSubmitting}
            >
              Update Session
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * View Session Modal */}
      <Modal
        isOpen={isViewSessionModalOpen}
        onClose={closeModals}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Session Details</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedSession && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {selectedSession.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Chip 
                      color={selectedSession.active ? "success" : "default"} 
                      size="sm" 
                      variant="flat"
                    >
                      {selectedSession.active ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-neutral-700">Start Date:</span>
                    <p className="text-neutral-600">
                      {selectedSession.starts_at ? new Date(selectedSession.starts_at).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">End Date:</span>
                    <p className="text-neutral-600">
                      {selectedSession.ends_at ? new Date(selectedSession.ends_at).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Created:</span>
                    <p className="text-neutral-600">
                      {selectedSession.created_at ? new Date(selectedSession.created_at).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Updated:</span>
                    <p className="text-neutral-600">
                      {selectedSession.updated_at ? new Date(selectedSession.updated_at).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={closeModals}>
              Close
            </Button>
            <Button 
              color="primary" 
              variant="light"
              onClick={() => {
                closeModals();
                openEditModal(selectedSession!);
              }}
            >
              Update
            </Button>
            {!selectedSession?.active && (
              <Button 
                color="success" 
                variant="light"
                onClick={() => {
                  closeModals();
                  handleStartSession(selectedSession!.id);
                }}
                isLoading={startSessionMutation.isPending}
              >
                Start Session
              </Button>
            )}
            {selectedSession?.active && (
              <Button 
                color="danger" 
                variant="light"
                onClick={() => {
                  closeModals();
                  handleEndSession(selectedSession!.id);
                }}
                isLoading={endSessionMutation.isPending}
              >
                End Session
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
