// * Student Schedule Page
// * View practical sessions and schedule information
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi } from '@/lib/api';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { Card, CardBody, CardHeader, Button, Chip, Divider } from '@heroui/react';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SchedulePageData {
  enrollment: any;
}

async function getSchedulePageData(userId: string): Promise<SchedulePageData> {
  try {
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    const enrollment = enrollmentResponse.data;

    return {
      enrollment
    };
  } catch (error) {
    console.error('Error fetching schedule page data:', error);
    return {
      enrollment: null
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
      {data.enrollment ? (() => {
        // Check if student is in a group
        const isInGroup = data.enrollment.status === 'assigned' || data.enrollment.status === 'paid';
        
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
                    Current status: <span className="font-medium capitalize">{data.enrollment.status}</span>
                  </p>
                  <p className="text-sm text-neutral-500">
                    Group assignment: <span className="font-medium">{data.enrollment.group?.id ? `Group ${data.enrollment.group.group_number}` : 'Not assigned'}</span>
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
                    <p className="font-medium text-neutral-900">{data.enrollment.skill?.title || 'Unknown Skill'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600">Group</span>
                    </div>
                    <p className="font-medium text-neutral-900">
                      {data.enrollment.group?.group_number ? `Group ${data.enrollment.group.group_number}` : 'Not assigned'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600">Status</span>
                    </div>
                    <Chip 
                      color={data.enrollment.status === 'assigned' ? 'success' : 'warning'} 
                      variant="flat"
                      className="capitalize"
                    >
                      {data.enrollment.status}
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Practical Sessions */}
            <Card shadow="sm" className="w-full">
              <CardHeader className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-xl font-medium leading-normal">Practical Sessions</p>
              </CardHeader>
              <Divider />
              <CardBody className="p-6">
                <div className="space-y-4">
                  {/* Mock session data - in real app, this would come from API */}
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Session 1</p>
                        <p className="text-sm text-neutral-600">Introduction to Practical Skills</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">Mon, Jan 15</p>
                      <p className="text-xs text-neutral-600">9:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Session 2</p>
                        <p className="text-sm text-neutral-600">Advanced Techniques</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">Wed, Jan 17</p>
                      <p className="text-xs text-neutral-600">2:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Session 3</p>
                        <p className="text-sm text-neutral-600">Final Assessment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">Fri, Jan 19</p>
                      <p className="text-xs text-neutral-600">10:00 AM - 1:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Group Information */}
            {data.enrollment.group && (
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Group Information</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-600">Group Number</p>
                      <p className="font-medium text-neutral-900">Group {data.enrollment.group.group_number}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-600">Group Display Name</p>
                      <p className="font-medium text-neutral-900">
                        {data.enrollment.group.group_display_name || 'TBD'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-600">Group ID</p>
                      <p className="font-medium text-neutral-900">
                        {data.enrollment.group.id || 'TBD'}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        );
      })() : (
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
      )}

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}