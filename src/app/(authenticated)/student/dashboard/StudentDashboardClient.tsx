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
import { Card, CardBody, CardHeader, Skeleton, Button } from '@nextui-org/react';
import { ListSkeleton, CardGridSkeleton } from '@/components/shared/Skeletons';
import Link from 'next/link';
import { BookOpen, CreditCard, Users } from 'lucide-react';

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
                <CardHeader className="flex flex-col items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary mb-2" />
                  <p className="text-xl font-medium leading-normal">No Active Enrollment</p>
                </CardHeader>
                <CardBody className="flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-neutral-600">
                    You haven&apos;t enrolled in any skills yet. Browse available skills to get started.
                  </p>
                  <div className="mt-4 flex items-center justify-center">
                    <Button
                      as={Link}
                      href="/student/skills"
                      color="primary"
                    >
                      Browse Skills
                    </Button>
                  </div>
                </CardBody>
              </Card>
            }
          >
            {(enrollment) => (
              <>
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

                {/* Contextual Guidance */}
                {(() => {
                  const status = (enrollment.status || '').toString().toLowerCase();
                  const payStatus = (enrollment.payment_status || '').toString().toLowerCase();
                  const cta = (href: string, label: string) => (
                    <Button as={Link} href={href} color="primary" size="sm">{label}</Button>
                  );

                  if (payStatus === 'failed') {
                    return (
                      <Card shadow="sm" className="w-full border-danger-200 bg-danger-50">
                        <CardHeader className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-danger" />
                          <p className="text-lg font-medium leading-normal">Payment Failed</p>
                        </CardHeader>
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-neutral-700">Your last payment attempt failed. Please try again.</p>
                            {cta('/student/enrollment', 'Retry Payment')}
                          </div>
                        </CardBody>
                      </Card>
                    );
                  }

                  if (status.includes('pending') || payStatus.includes('pending') || payStatus === 'unpaid' || status === 'unpaid') {
                    return (
                      <Card shadow="sm" className="w-full border-primary-200 bg-primary-50">
                        <CardHeader className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <p className="text-lg font-medium leading-normal">Payment Pending</p>
                        </CardHeader>
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-neutral-700">Complete your payment to secure your spot and continue.</p>
                            {cta('/student/enrollment', 'Go to Payment')}
                          </div>
                        </CardBody>
                      </Card>
                    );
                  }

                  if (['paid','assigned','active'].includes(status)) {
                    return (
                      <Card shadow="sm" className="w-full border-success-200 bg-success-50">
                        <CardHeader className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-success" />
                          <p className="text-lg font-medium leading-normal">{status === 'paid' && !enrollment.group_id ? 'Awaiting Group Assignment' : 'Group Assigned'}</p>
                        </CardHeader>
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-neutral-700">
                              {status === 'paid' && !enrollment.group_id
                                ? 'You will be assigned to a group soon. You can review your schedule once assigned.'
                                : 'Check your group roster and practical schedule.'}
                            </p>
                            <Button as={Link} href={status === 'paid' && !enrollment.group_id ? '/student/enrollment' : '/student/my-group'} color="success" size="sm">
                              {status === 'paid' && !enrollment.group_id ? 'View Enrollment' : 'View Group'}
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  }

                  if (status === 'assigned') {
                    return (
                      <Card shadow="sm" className="w-full border-success-200 bg-success-50">
                        <CardHeader className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-success" />
                          <p className="text-lg font-medium leading-normal">Group Assigned</p>
                        </CardHeader>
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-neutral-700">Check your group roster and practical schedule.</p>
                            {cta('/student/my-group', 'View Group')}
                          </div>
                        </CardBody>
                      </Card>
                    );
                  }

                  if (status === 'cancelled') {
                    return (
                      <Card shadow="sm" className="w-full border-warning-200 bg-warning-50">
                        <CardHeader className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-warning" />
                          <p className="text-lg font-medium leading-normal">Enrollment Cancelled</p>
                        </CardHeader>
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-neutral-700">You can choose another skill and enroll again.</p>
                            {cta('/student/skills', 'Browse Skills')}
                          </div>
                        </CardBody>
                      </Card>
                    );
                  }
                  return null;
                })()}
              </>
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
