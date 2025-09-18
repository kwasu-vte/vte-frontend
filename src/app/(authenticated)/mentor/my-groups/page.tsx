// * Mentor My Groups Page
// * Shows groups assigned to the current mentor
// * Follows the same pattern as admin pages with StateRenderer + React Query

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { GroupsTable } from '@/components/features/admin/GroupsTable';
import { api } from '@/lib/api';
import { Group } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from '@nextui-org/react';
import { Users, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function MentorMyGroupsPage() {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching - get groups assigned to current mentor
  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['mentor-groups'],
    queryFn: async () => {
      // TODO: Implement mentor-specific groups endpoint
      // For now, get all groups and filter client-side
      const response = await api.getGroups();
      return response.data;
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  // * Filter groups for current mentor (placeholder logic)
  const mentorGroups = groups?.filter(group => group.mentor?.id === 'current-mentor-id') || [];

  // * Handle take attendance
  const handleTakeAttendance = (group: Group) => {
    setSelectedGroup(group);
    setIsAttendanceModalOpen(true);
  };

  // * Handle view group details
  const handleViewGroup = (group: Group) => {
    // TODO: Navigate to group details page
    console.log('View group details:', group);
  };

  // * Handle manage members
  const handleManageMembers = (group: Group) => {
    // TODO: Navigate to members management
    console.log('Manage members for group:', group);
  };

  // * Handle manage schedule
  const handleManageSchedule = (group: Group) => {
    // TODO: Navigate to schedule management
    console.log('Manage schedule for group:', group);
  };

  // * Close modals
  const closeModals = () => {
    setIsAttendanceModalOpen(false);
    setSelectedGroup(null);
  };

  // * Calculate statistics
  const totalStudents = mentorGroups.reduce((sum, group) => sum + (group.members?.length || 0), 0);
  const activeGroups = mentorGroups.filter(group => group.members && group.members.length > 0).length;

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Groups</h1>
          <p className="text-neutral-600 mt-1">
            Manage your assigned groups and track student progress
          </p>
        </div>
      </div>

      {/* * Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Groups</p>
              <p className="text-2xl font-bold text-neutral-900">{mentorGroups.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Active Groups</p>
              <p className="text-2xl font-bold text-neutral-900">{activeGroups}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Students</p>
              <p className="text-2xl font-bold text-neutral-900">{totalStudents}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* * Groups Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={mentorGroups}
          isLoading={isLoading}
          error={error}
          loadingComponent={
            <div className="p-6">
              <DefaultLoadingComponent />
            </div>
          }
          errorComponent={
            <div className="p-6">
              <DefaultErrorComponent 
                error={error!} 
                onRetry={() => refetch()} 
              />
            </div>
          }
          emptyComponent={
            <div className="p-6">
              <DefaultEmptyComponent 
                message="No groups assigned to you yet. Contact an administrator to get assigned to groups."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Users className="w-4 h-4" />}
                    onClick={() => window.location.href = '/admin/groups'}
                  >
                    View All Groups
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <GroupsTable
              groups={data}
              onEdit={handleViewGroup}
              onDelete={() => {}} // Mentors can't delete groups
              onView={handleViewGroup}
              onManageMembers={handleManageMembers}
              onManageAttendance={handleTakeAttendance}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900">Today&apos;s Schedule</h3>
                <p className="text-sm text-neutral-600">View your classes and sessions for today</p>
              </div>
              <Button
                color="primary"
                variant="light"
                onClick={() => window.location.href = '/mentor/calendar'}
              >
                View Calendar
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900">Take Attendance</h3>
                <p className="text-sm text-neutral-600">Mark attendance for ongoing sessions</p>
              </div>
              <Button
                color="primary"
                variant="light"
                onClick={() => window.location.href = '/mentor/attendance'}
              >
                Take Attendance
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* * Attendance Modal */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={closeModals}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Take Attendance</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedGroup && (
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-medium text-neutral-900">{selectedGroup.name}</h3>
                  <p className="text-sm text-neutral-600">
                    {selectedGroup.skill?.title} • {selectedGroup.members?.length || 0} students
                  </p>
                </div>
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">
                    Attendance functionality will be implemented in the dedicated attendance page.
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={closeModals}
            >
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                closeModals();
                window.location.href = '/mentor/attendance';
              }}
            >
              Go to Attendance Page
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Total Groups:</strong> {groups?.length || 0}</p>
          <p><strong>My Groups:</strong> {mentorGroups.length}</p>
          <p><strong>Query Key:</strong> [&apos;mentor-groups&apos;]</p>
        </div>
      </div>
    </div>
  );
}
