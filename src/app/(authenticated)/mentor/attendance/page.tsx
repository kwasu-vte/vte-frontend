// * Mentor Attendance Page
// * Allows mentors to take attendance for their groups
// * Follows the same pattern as other pages with StateRenderer + React Query

'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { api } from '@/lib/api';
import { Group, AttendanceRecord, CreateAttendanceRecordPayload } from '@/lib/types';
import { Button, Card, CardBody, CardHeader, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from '@nextui-org/react';
import { Users, Clock, CheckCircle, XCircle, AlertCircle, Save, Calendar } from 'lucide-react';

interface AttendanceSession {
  id: string;
  group: Group;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  attendanceRecords: AttendanceRecord[];
}

interface StudentAttendance {
  studentId: string;
  studentName: string;
  studentEmail: string;
  isPresent: boolean;
  notes?: string;
}

export default function MentorAttendancePage() {
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching - get mentor's groups and sessions
  const {
    data: sessions,
    isLoading,
    error,
    refetch
  } = useClientQuery({
    queryKey: ['mentor-attendance-sessions'],
    queryFn: async () => {
      // TODO: Implement mentor attendance sessions endpoint
      // For now, return mock data
      return [
        {
          id: 'session-1',
          group: {
            id: 'group-1',
            name: 'Group A',
            skill: { id: 'skill-1', title: 'Web Development' },
            mentor: { id: 'mentor-1', first_name: 'John', last_name: 'Smith' },
            members: [
              { id: 'student-1', first_name: 'John', last_name: 'Doe' },
              { id: 'student-2', first_name: 'Jane', last_name: 'Smith' },
              { id: 'student-3', first_name: 'Bob', last_name: 'Johnson' }
            ],
            creation_date: '2024-01-01T00:00:00Z',
            end_date: '2024-06-30T23:59:59Z'
          },
          date: '2024-01-15',
          startTime: '09:00',
          endTime: '11:00',
          status: 'ongoing',
          attendanceRecords: []
        },
        {
          id: 'session-2',
          group: {
            id: 'group-2',
            name: 'Group B',
            skill: { id: 'skill-2', title: 'Mobile Development' },
            mentor: { id: 'mentor-2', first_name: 'Jane', last_name: 'Doe' },
            members: [
              { id: 'student-4', first_name: 'Alice', last_name: 'Brown' },
              { id: 'student-5', first_name: 'Charlie', last_name: 'Wilson' }
            ],
            creation_date: '2024-01-01T00:00:00Z',
            end_date: '2024-06-30T23:59:59Z'
          },
          date: '2024-01-15',
          startTime: '14:00',
          endTime: '16:00',
          status: 'scheduled',
          attendanceRecords: []
        }
      ] as AttendanceSession[];
    },
  });

  // * Create attendance mutation
  const createAttendanceMutation = useMutation({
    mutationFn: async (data: CreateAttendanceRecordPayload[]) => {
      // TODO: Implement batch attendance creation
      console.log('Creating attendance records:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-attendance-sessions'] });
      setIsAttendanceModalOpen(false);
      setAttendanceData([]);
    },
    onError: (error) => {
      console.error('Error creating attendance records:', error);
    },
  });

  // * Handle take attendance
  const handleTakeAttendance = (session: AttendanceSession) => {
    setSelectedSession(session);
    
    // Initialize attendance data
    const initialData = session.group.members?.map(member => ({
      studentId: member.id,
      studentName: `${member.first_name} ${member.last_name}`,
      studentEmail: `${member.first_name.toLowerCase()}.${member.last_name.toLowerCase()}@example.com`, // Mock email
      isPresent: true, // Default to present
      notes: ''
    })) || [];
    
    setAttendanceData(initialData);
    setIsAttendanceModalOpen(true);
  };

  // * Handle attendance change
  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.studentId === studentId 
          ? { ...student, isPresent }
          : student
      )
    );
  };

  // * Handle notes change
  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.studentId === studentId 
          ? { ...student, notes }
          : student
      )
    );
  };

  // * Handle save attendance
  const handleSaveAttendance = async () => {
    if (!selectedSession) return;
    
    setIsSubmitting(true);
    try {
      const attendanceRecords = attendanceData.map(student => ({
        student_id: student.studentId,
        group_id: selectedSession.group.id,
        date: selectedSession.date,
        status: (student.isPresent ? 'present' : 'absent') as 'present' | 'absent' | 'late' | 'excused',
        notes: student.notes || null
      }));
      
      await createAttendanceMutation.mutateAsync(attendanceRecords);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Close modals
  const closeModals = () => {
    setIsAttendanceModalOpen(false);
    setSelectedSession(null);
    setAttendanceData([]);
  };

  // * Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'ongoing': return 'primary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  // * Calculate statistics
  const totalSessions = sessions?.length || 0;
  const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
  const ongoingSessions = sessions?.filter(s => s.status === 'ongoing').length || 0;

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Take Attendance</h1>
          <p className="text-neutral-600 mt-1">
            Mark attendance for your group sessions
          </p>
        </div>
      </div>

      {/* * Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Sessions</p>
              <p className="text-2xl font-bold text-neutral-900">{totalSessions}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Completed</p>
              <p className="text-2xl font-bold text-neutral-900">{completedSessions}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Ongoing</p>
              <p className="text-2xl font-bold text-neutral-900">{ongoingSessions}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* * Sessions List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={sessions}
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
                message="No sessions scheduled. Contact an administrator to get assigned to groups."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Users className="w-4 h-4" />}
                    onClick={() => window.location.href = '/mentor/my-groups'}
                  >
                    View My Groups
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <div className="p-6">
              <Table aria-label="Attendance sessions">
                <TableHeader>
                  <TableColumn>GROUP</TableColumn>
                  <TableColumn>DATE & TIME</TableColumn>
                  <TableColumn>STUDENTS</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-neutral-900">{session.group.name}</div>
                          <div className="text-sm text-neutral-500">{session.group.skill.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-neutral-900">
                            {new Date(session.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {session.startTime} - {session.endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-neutral-400" />
                          <span className="font-medium">
                            {session.group.members?.length || 0}
                          </span>
                          <span className="text-sm text-neutral-500">students</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(session.status)}
                          variant="flat"
                          size="sm"
                        >
                          {session.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleTakeAttendance(session)}
                          isDisabled={session.status === 'completed'}
                        >
                          {session.status === 'completed' ? 'Completed' : 'Take Attendance'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </StateRenderer>
      </div>

      {/* * Attendance Modal */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={closeModals}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Take Attendance</h2>
            </div>
            {selectedSession && (
              <p className="text-sm text-neutral-600">
                {selectedSession.group.name} • {selectedSession.date} • {selectedSession.startTime} - {selectedSession.endTime}
              </p>
            )}
          </ModalHeader>
          <ModalBody>
            {selectedSession && (
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-medium text-neutral-900 mb-2">Session Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Group:</span>
                      <span className="ml-2 font-medium">{selectedSession.group.name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Skill:</span>
                      <span className="ml-2 font-medium">{selectedSession.group.skill.title}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Date:</span>
                      <span className="ml-2 font-medium">{selectedSession.date}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Time:</span>
                      <span className="ml-2 font-medium">{selectedSession.startTime} - {selectedSession.endTime}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-neutral-900">Student Attendance</h3>
                  {attendanceData.map((student) => (
                    <Card key={student.studentId}>
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-neutral-900">{student.studentName}</div>
                            <div className="text-sm text-neutral-500">{student.studentEmail}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Checkbox
                              isSelected={student.isPresent}
                              onValueChange={(checked) => handleAttendanceChange(student.studentId, checked)}
                              color="success"
                            >
                              Present
                            </Checkbox>
                            <div className="flex items-center gap-2">
                              {student.isPresent ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}
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
              startContent={<Save className="w-4 h-4" />}
              onClick={handleSaveAttendance}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Save Attendance
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
          <p><strong>Sessions Count:</strong> {sessions?.length || 0}</p>
          <p><strong>Selected Session:</strong> {selectedSession?.id || 'None'}</p>
          <p><strong>Attendance Data:</strong> {attendanceData.length} students</p>
        </div>
      </div>
    </div>
  );
}
