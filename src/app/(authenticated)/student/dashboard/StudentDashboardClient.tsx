// * Student Dashboard Client Component
// * Uses composite data hook for optimized data fetching

'use client';

import React from 'react';
import { useStudentDashboardData } from '@/lib/hooks/use-student-dashboard-data';
import { ProfileCompletionAlert } from '@/components/features/student/ProfileCompletionAlert';
import { EnrollmentStatus } from '@/components/features/student/EnrollmentStatus';
import { GroupAssignmentCard } from '@/components/features/student/GroupAssignmentCard';
import { UpcomingPracticals } from '@/components/features/student/UpcomingPracticals';
import { QuickActions } from '@/components/features/student/QuickActions';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import { ListSkeleton, CardGridSkeleton } from '@/components/shared/Skeletons';

interface StudentDashboardClientProps {
  userId: string;
}

export function StudentDashboardClient({ userId }: StudentDashboardClientProps) {
  const { profile, enrollment, upcomingPracticals, attendanceSummary, isLoading, error } = useStudentDashboardData(userId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-neutral-600">
          Here&apos;s what&apos;s happening with your practical training.
        </p>
      </div>

      {/* Profile Completion Alert */}
      {profile && (
        <ProfileCompletionAlert 
          profile={profile as any}
          dismissible={true}
        />
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Status Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Status */}
          <StateRenderer
            data={enrollment}
            isLoading={isLoading}
            error={error}
            onRetry={() => window.location.reload()}
            loadingComponent={
              <Card shadow="sm" className="w-full">
                <CardBody className="p-6">
                  <ListSkeleton rows={2} />
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
          {enrollment && (
            <StateRenderer
              data={enrollment.group_id}
              isLoading={isLoading}
              error={error}
              onRetry={() => window.location.reload()}
              loadingComponent={
                <Card shadow="sm" className="w-full">
                  <CardBody className="p-6">
                    <ListSkeleton rows={2} />
                  </CardBody>
                </Card>
              }
              emptyComponent={null}
            >
              {(groupId) => (
                <GroupAssignmentCard
                  enrollment={{
                    id: enrollment.id.toString(),
                    status: enrollment.status
                  }}
                  group={{
                    number: parseInt(String(groupId)),
                    mentorName: 'Loading...', // This would come from group details API
                    schedule: 'Loading...'
                  }}
                />
              )}
            </StateRenderer>
          )}

          {/* Upcoming Practicals */}
          <UpcomingPracticals 
            practicals={upcomingPracticals}
            limit={3}
          />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActions 
            enrollment={enrollment ? {
              status: enrollment.status,
              group: enrollment.group_id ? { id: enrollment.group_id.toString() } : undefined
            } : undefined}
            hasProfile={!!profile}
          />
        </div>
      </div>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
