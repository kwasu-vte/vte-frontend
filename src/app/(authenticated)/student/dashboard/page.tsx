// * Student Dashboard Page
// * Student hub with profile completion alert, enrollment status, and quick actions
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { studentsApi, enrollmentsApi } from '@/lib/api';
import { ProfileCompletionAlert } from '@/components/features/student/ProfileCompletionAlert';
import { EnrollmentStatus } from '@/components/features/student/EnrollmentStatus';
import { GroupAssignmentCard } from '@/components/features/student/GroupAssignmentCard';
import { UpcomingPracticals } from '@/components/features/student/UpcomingPracticals';
import { QuickActions } from '@/components/features/student/QuickActions';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';

export const dynamic = 'force-dynamic';

interface DashboardData {
  profile: any;
  enrollment: any;
  upcomingPracticals: any[];
}

async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Fetch profile and enrollment data in parallel
    const [profileResponse, enrollmentResponse] = await Promise.allSettled([
      studentsApi.getStudentProfile(userId),
      enrollmentsApi.getEnrollment(userId)
    ]);

    const profile = profileResponse.status === 'fulfilled' ? profileResponse.value.data : null;
    const enrollment = enrollmentResponse.status === 'fulfilled' ? enrollmentResponse.value.data : null;

    // Mock upcoming practicals for now - this would come from a schedule API
    const upcomingPracticals = [
      {
        id: '1',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        venue: 'Lab A',
        mentor: 'Dr. Smith'
      },
      {
        id: '2', 
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        venue: 'Lab B',
        mentor: 'Dr. Johnson'
      }
    ];

    return {
      profile,
      enrollment,
      upcomingPracticals
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      profile: null,
      enrollment: null,
      upcomingPracticals: []
    };
  }
}

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome back, {user.first_name}!
        </h1>
        <p className="text-neutral-600">
          Here&apos;s what&apos;s happening with your practical training.
        </p>
      </div>

      {/* Profile Completion Alert */}
      {data.profile && (
        <ProfileCompletionAlert 
          profile={data.profile}
          dismissible={true}
        />
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Status Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Status */}
          <StateRenderer
            data={data.enrollment}
            isLoading={false}
            error={null}
            loadingComponent={
              <Card shadow="sm" className="w-full">
                <CardBody className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardBody>
              </Card>
            }
            emptyComponent={
              <Card shadow="sm" className="w-full">
                <CardHeader>
                  <p className="text-xl font-medium leading-normal">No Active Enrollment</p>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-neutral-600">
                    You haven&apos;t enrolled in any skills yet. Browse available skills to get started.
                  </p>
                </CardBody>
              </Card>
            }
          >
            {(enrollment) => (
              <EnrollmentStatus 
                enrollment={{
                  id: enrollment.id.toString(),
                  skillName: enrollment.skill?.title || 'Unknown Skill',
                  status: enrollment.status.toUpperCase() as any,
                  paymentStatus: enrollment.payment_status,
                  group: enrollment.group_id?.toString()
                }}
                showTimeline={true}
              />
            )}
          </StateRenderer>

          {/* Group Assignment */}
          {data.enrollment && (
            <StateRenderer
              data={data.enrollment.group_id}
              isLoading={false}
              error={null}
              loadingComponent={
                <Card shadow="sm" className="w-full">
                  <CardBody className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardBody>
                </Card>
              }
              emptyComponent={null}
            >
              {(groupId) => (
                <GroupAssignmentCard
                  enrollment={{
                    id: data.enrollment.id.toString(),
                    status: data.enrollment.status
                  }}
                  group={{
                    number: parseInt(groupId),
                    mentorName: 'TBD', // This would come from group details API
                    schedule: 'TBD'
                  }}
                />
              )}
            </StateRenderer>
          )}

          {/* Upcoming Practicals */}
          <UpcomingPracticals 
            practicals={data.upcomingPracticals}
            limit={3}
          />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActions 
            enrollment={data.enrollment}
            hasProfile={!!data.profile}
          />
        </div>
      </div>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
