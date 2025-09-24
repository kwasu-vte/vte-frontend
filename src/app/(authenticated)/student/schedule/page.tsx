// * Student Schedule Page
// * View practical schedule with PracticalCalendar and UpcomingPracticals
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi } from '@/lib/api';
import { PracticalCalendar } from '@/components/features/student/PracticalCalendar';
import { UpcomingPracticals } from '@/components/features/student/UpcomingPracticals';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button, Chip, Divider } from '@nextui-org/react';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SchedulePageData {
  enrollment: any;
  upcomingPracticals: any[];
}

async function getSchedulePageData(userId: string): Promise<SchedulePageData> {
  try {
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    const enrollment = enrollmentResponse.success ? enrollmentResponse.data : null;

    // Mock upcoming practicals data - this would come from schedule APIs
    const upcomingPracticals = enrollment ? [
      {
        id: '1',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        venue: 'Lab A',
        mentor: 'Dr. Smith'
      },
      {
        id: '2',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        venue: 'Lab B',
        mentor: 'Dr. Johnson'
      },
      {
        id: '3',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        venue: 'Lab C',
        mentor: 'Dr. Williams'
      },
      {
        id: '4',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        venue: 'Lab A',
        mentor: 'Dr. Smith'
      },
      {
        id: '5',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        venue: 'Lab B',
        mentor: 'Dr. Johnson'
      }
    ] : [];

    return {
      enrollment,
      upcomingPracticals
    };
  } catch (error) {
    console.error('Error fetching schedule page data:', error);
    return {
      enrollment: null,
      upcomingPracticals: []
    };
  }
}

export default async function StudentSchedule() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getSchedulePageData(user.id);

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
            My Schedule
          </h1>
          <p className="text-neutral-600">
            View your practical sessions and upcoming schedule.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <StateRenderer
        data={data.enrollment}
        loadingComponent={
          <div className="space-y-6">
            <Card shadow="sm" className="w-full">
              <CardBody className="p-6">
                <Skeleton className="h-40 w-full" />
              </CardBody>
            </Card>
            <Card shadow="sm" className="w-full">
              <CardBody className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardBody>
            </Card>
          </div>
        }
        emptyComponent={
          <Card shadow="sm" className="w-full">
            <CardBody className="p-8 text-center">
              <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Schedule Available</h3>
              <p className="text-neutral-600 mb-6">
                You need to be enrolled in a skill to view your practical schedule.
              </p>
              <Button
                as={Link}
                href="/student/skills"
                color="primary"
                startContent={<Calendar className="h-4 w-4" />}
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
          
          if (!isInGroup) {
            return (
              <Card shadow="sm" className="w-full">
                <CardBody className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-warning-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Schedule Not Available</h3>
                  <p className="text-neutral-600 mb-6">
                    You need to be assigned to a group to view your practical schedule.
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
              {/* Schedule Overview */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Schedule Overview</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">Skill</span>
                      </div>
                      <p className="font-medium text-neutral-900">{enrollment.skill?.title || 'Unknown Skill'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">Group</span>
                      </div>
                      <p className="font-medium text-neutral-900">Group {enrollment.group_id}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">Status</span>
                      </div>
                      <Chip 
                        color={enrollment.status === 'active' ? 'success' : 'warning'} 
                        variant="flat"
                        size="sm"
                      >
                        {enrollment.status}
                      </Chip>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Upcoming Practicals */}
              <UpcomingPracticals
                practicals={data.upcomingPracticals}
                limit={5}
              />

              {/* Practical Calendar */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Practical Calendar</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <PracticalCalendar
                    groupId={enrollment.group_id?.toString() || ''}
                    skillId={enrollment.skill?.id || ''}
                    startDate={enrollment.created_at}
                    endDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}
                  />
                </CardBody>
              </Card>

              {/* Schedule Information */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Schedule Information</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-medium text-neutral-900">Regular Schedule</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-neutral-400" />
                            <span className="text-neutral-600">Days:</span>
                            <span className="font-medium">Monday, Wednesday, Friday</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-neutral-400" />
                            <span className="text-neutral-600">Time:</span>
                            <span className="font-medium">10:00 AM - 12:00 PM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-neutral-400" />
                            <span className="text-neutral-600">Location:</span>
                            <span className="font-medium">Lab 1, Computer Science Building</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-medium text-neutral-900">Important Notes</h3>
                        <div className="space-y-2 text-sm text-neutral-600">
                          <p>• Arrive 10 minutes before scheduled time</p>
                          <p>• Bring your student ID and QR code scanner</p>
                          <p>• Notify your mentor if you'll be late or absent</p>
                          <p>• Check for schedule changes before each session</p>
                        </div>
                      </div>
                    </div>
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
