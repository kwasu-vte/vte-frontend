// * Student Attendance Page
// * View own attendance with AttendanceStats, ScanHistoryTable, and AttendanceCalendar
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi } from '@/lib/api';
import { AttendanceCompletionBadge } from '@/components/features/student/AttendanceCompletionBadge';
import { AttendanceReport } from '@/components/features/student/AttendanceReport';
import { PracticalCalendar } from '@/components/features/student/PracticalCalendar';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button, Progress, Chip, Divider } from '@nextui-org/react';
import { ArrowLeft, BarChart3, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface AttendancePageData {
  enrollment: any;
  attendanceStats: any;
  attendanceHistory: any[];
}

async function getAttendancePageData(userId: string): Promise<AttendancePageData> {
  try {
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    const enrollment = enrollmentResponse.success ? enrollmentResponse.data : null;

    // Mock attendance data - this would come from attendance APIs
    const attendanceStats = enrollment ? {
      totalSessions: 12,
      attendedSessions: 10,
      attendanceRate: 83.3,
      totalPoints: 150,
      lastAttendance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      streak: 5,
      weeklyProgress: [
        { week: 'Week 1', completed: 3, required: 3 },
        { week: 'Week 2', completed: 2, required: 3 },
        { week: 'Week 3', completed: 3, required: 3 },
        { week: 'Week 4', completed: 2, required: 3 }
      ]
    } : null;

    const attendanceHistory = enrollment ? [
      { student: 'You', scans: 10, points: 150, percentage: 83 },
      { student: 'Jane Doe', scans: 9, points: 135, percentage: 75 },
      { student: 'Bob Johnson', scans: 11, points: 165, percentage: 92 },
      { student: 'Alice Brown', scans: 8, points: 120, percentage: 67 }
    ] : [];

    return {
      enrollment,
      attendanceStats,
      attendanceHistory
    };
  } catch (error) {
    console.error('Error fetching attendance page data:', error);
    return {
      enrollment: null,
      attendanceStats: null,
      attendanceHistory: []
    };
  }
}

export default async function StudentAttendance() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getAttendancePageData(user.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          as={Link}
          href="/student/dashboard"
          isIconOnly
          variant="ghost"
          className="text-neutral-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            My Attendance
          </h1>
          <p className="text-neutral-600">
            Track your attendance progress and view detailed reports.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <StateRenderer
        data={data.enrollment}
        loadingComponent={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} shadow="sm" className="w-full">
                  <CardBody className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardBody>
                </Card>
              ))}
            </div>
            <Card shadow="sm" className="w-full">
              <CardBody className="p-6">
                <Skeleton className="h-40 w-full" />
              </CardBody>
            </Card>
          </div>
        }
        emptyComponent={
          <Card shadow="sm" className="w-full">
            <CardBody className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Attendance Data</h3>
              <p className="text-neutral-600 mb-6">
                You need to be enrolled in a skill to view attendance records.
              </p>
              <Button
                as={Link}
                href="/student/skills"
                color="primary"
                startContent={<BarChart3 className="h-4 w-4" />}
              >
                Browse Skills
              </Button>
            </CardBody>
          </Card>
        }
      >
        {(enrollment) => {
          // Check if student is in a group
          const isInGroup = enrollment.status === 'assigned' || enrollment.status === 'active';
          
          if (!isInGroup || !data.attendanceStats) {
            return (
              <Card shadow="sm" className="w-full">
                <CardBody className="p-8 text-center">
                  <Users className="h-12 w-12 text-warning-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Attendance Records</h3>
                  <p className="text-neutral-600 mb-6">
                    You need to be assigned to a group and start attending practical sessions to see attendance data.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-500">
                      Current status: <span className="font-medium capitalize">{enrollment.status}</span>
                    </p>
                    <p className="text-sm text-neutral-500">
                      Group assignment: <span className="font-medium">{enrollment.group_id ? `Group ${enrollment.group_id}` : 'Not assigned'}</span>
                    </p>
                  </div>
                </CardBody>
              </Card>
            );
          }

          return (
            <div className="space-y-6">
              {/* Attendance Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card shadow="sm" className="w-full">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Attendance Rate</p>
                        <p className="text-2xl font-bold text-neutral-900">{data.attendanceStats.attendanceRate}%</p>
                        <p className="text-xs text-neutral-500">
                          {data.attendanceStats.attendedSessions} of {data.attendanceStats.totalSessions} sessions
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card shadow="sm" className="w-full">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-success-50 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Total Points</p>
                        <p className="text-2xl font-bold text-neutral-900">{data.attendanceStats.totalPoints}</p>
                        <p className="text-xs text-neutral-500">Points earned</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card shadow="sm" className="w-full">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-warning-50 rounded-lg">
                        <Clock className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Current Streak</p>
                        <p className="text-2xl font-bold text-neutral-900">{data.attendanceStats.streak}</p>
                        <p className="text-xs text-neutral-500">Days in a row</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Weekly Progress */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Weekly Progress</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {data.attendanceStats.weeklyProgress.map((week: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-900">{week.week}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-600">{week.completed}/{week.required}</span>
                            <Chip
                              color={week.completed >= week.required ? "success" : "warning"}
                              variant="flat"
                              size="sm"
                            >
                              {Math.round((week.completed / week.required) * 100)}%
                            </Chip>
                          </div>
                        </div>
                        <Progress
                          value={(week.completed / week.required) * 100}
                          color={week.completed >= week.required ? "success" : "warning"}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Attendance Calendar */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Attendance Calendar</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <PracticalCalendar
                    groupId={enrollment.group_id?.toString() || ''}
                    skillId={enrollment.skill?.id || ''}
                    startDate={enrollment.created_at}
                    endDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
                  />
                </CardBody>
              </Card>

              {/* Group Attendance Report */}
              <AttendanceReport
                groupId={enrollment.group_id?.toString() || 'Unknown'}
                dateRange={{
                  start: enrollment.created_at,
                  end: new Date().toISOString()
                }}
                attendanceData={data.attendanceHistory}
              />

              {/* Today's Progress */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Today's Progress</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <AttendanceCompletionBadge
                    date={new Date().toISOString()}
                    scanProgress={{ required: 3, completed: 2 }}
                  />
                  <div className="mt-4">
                    <p className="text-sm text-neutral-600 mb-2">Required scans today: 3</p>
                    <Progress
                      value={(2 / 3) * 100}
                      color="warning"
                      className="w-full"
                    />
                    <p className="text-xs text-neutral-500 mt-1">2 of 3 scans completed</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        }}
      </StateRenderer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
