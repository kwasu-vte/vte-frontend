// * Student My Group Page
// * View assigned group with GroupInfoCard, MentorCard, GroupMembersList, and PracticalSchedule
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi } from '@/lib/api';
import { GroupAssignmentCard } from '@/components/features/student/GroupAssignmentCard';
import { PracticalCalendar } from '@/components/features/student/PracticalCalendar';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button, Avatar, Chip, Divider } from '@nextui-org/react';
import { ArrowLeft, Users, User, Calendar, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface MyGroupPageData {
  enrollment: any;
  groupDetails: any;
}

async function getMyGroupPageData(userId: string): Promise<MyGroupPageData> {
  try {
    const enrollmentResponse = await enrollmentsApi.getEnrollment(userId);
    const enrollment = enrollmentResponse.success ? enrollmentResponse.data : null;

    // Mock group details - this would come from a group details API
    const groupDetails = enrollment?.group_id ? {
      id: enrollment.group_id,
      name: `Group ${enrollment.group_id}`,
      skill: enrollment.skill,
      mentor: {
        id: 'mentor-1',
        name: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        phone: '+234 801 234 5678',
        specialization: 'Full-Stack Development'
      },
      members: [
        { id: 'student-1', name: 'You', email: 'you@student.edu', level: '300' },
        { id: 'student-2', name: 'Jane Doe', email: 'jane@student.edu', level: '300' },
        { id: 'student-3', name: 'Bob Johnson', email: 'bob@student.edu', level: '400' },
        { id: 'student-4', name: 'Alice Brown', email: 'alice@student.edu', level: '300' }
      ],
      schedule: {
        start: '2024-01-15',
        end: '2024-06-15',
        days: ['Monday', 'Wednesday', 'Friday'],
        location: 'Lab 1, Computer Science Building'
      }
    } : null;

    return {
      enrollment,
      groupDetails
    };
  } catch (error) {
    console.error('Error fetching my group page data:', error);
    return {
      enrollment: null,
      groupDetails: null
    };
  }
}

export default async function StudentMyGroup() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getMyGroupPageData(user.id);

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
            My Group
          </h1>
          <p className="text-neutral-600">
            View your assigned group details and members.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <StateRenderer
        isLoading={false}
        error={null}
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
              <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Group Assignment</h3>
              <p className="text-neutral-600 mb-6">
                You haven&apos;t been assigned to a group yet. Complete your enrollment and payment to get assigned.
              </p>
              <Button
                as={Link}
                href="/student/enrollment"
                color="primary"
                startContent={<Users className="h-4 w-4" />}
              >
                View Enrollment
              </Button>
            </CardBody>
          </Card>
        }
      >
        {(enrollment) => {
          // Check if student is assigned to a group
          const isAssigned = enrollment.status === 'assigned' || enrollment.status === 'active';
          
          if (!isAssigned || !data.groupDetails) {
            return (
              <Card shadow="sm" className="w-full">
                <CardBody className="p-8 text-center">
                  <Users className="h-12 w-12 text-warning-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Awaiting Group Assignment</h3>
                  <p className="text-neutral-600 mb-6">
                    Your enrollment is confirmed but you haven&apos;t been assigned to a group yet. This usually happens within 24-48 hours after payment confirmation.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-500">
                      Current status: <span className="font-medium capitalize">{enrollment.status}</span>
                    </p>
                    <p className="text-sm text-neutral-500">
                      Payment status: <span className="font-medium capitalize">{enrollment.payment_status}</span>
                    </p>
                  </div>
                </CardBody>
              </Card>
            );
          }

          return (
            <div className="space-y-6">
              {/* Group Assignment Card */}
              <GroupAssignmentCard
                enrollment={{
                  id: enrollment.id.toString(),
                  status: enrollment.status
                }}
                group={{
                  number: parseInt(data.groupDetails.id),
                  mentorName: data.groupDetails.mentor.name,
                  schedule: `${data.groupDetails.schedule.days.join(', ')} at ${data.groupDetails.schedule.location}`
                }}
              />

              {/* Group Information */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Group Information</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Group Name</span>
                      <span className="font-medium text-neutral-900">{data.groupDetails.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Skill</span>
                      <span className="font-medium text-neutral-900">{data.groupDetails.skill?.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Duration</span>
                      <span className="font-medium text-neutral-900">
                        {new Date(data.groupDetails.schedule.start).toLocaleDateString()} - {new Date(data.groupDetails.schedule.end).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Schedule</span>
                      <span className="font-medium text-neutral-900">{data.groupDetails.schedule.days.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Location</span>
                      <span className="font-medium text-neutral-900">{data.groupDetails.schedule.location}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Mentor Information */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Mentor</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar
                      name={data.groupDetails.mentor.name.split(' ').map((n: string) => n[0]).join('')}
                      size="lg"
                      className="text-lg"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900">{data.groupDetails.mentor.name}</h3>
                        <p className="text-sm text-neutral-600">{data.groupDetails.mentor.specialization}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-neutral-400" />
                          <span className="text-neutral-600">{data.groupDetails.mentor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-neutral-400" />
                          <span className="text-neutral-600">{data.groupDetails.mentor.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Group Members */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Group Members</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {data.groupDetails.members.map((member: any, index: number) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg">
                        <Avatar
                          name={member.name.split(' ').map((n: string) => n[0]).join('')}
                          size="md"
                          className="text-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900">{member.name}</span>
                            {index === 0 && (
                              <Chip size="sm" color="primary" variant="flat">
                                You
                              </Chip>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600">{member.email}</p>
                          <p className="text-xs text-neutral-500">Level {member.level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Practical Schedule */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Practical Schedule</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <PracticalCalendar
                    practicalDates={data.groupDetails.schedule.days.map((day: string) => ({
                      date: `${data.groupDetails.schedule.start}T09:00:00Z`, // Mock time
                      venue: data.groupDetails.schedule.location,
                      time: '09:00 AM'
                    }))}
                    viewMode="month"
                  />
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
