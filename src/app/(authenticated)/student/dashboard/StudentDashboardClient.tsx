// * Student Dashboard Client Component
// * Uses composite data hook for optimized data fetching

'use client';

import React from 'react';
import { useStudentDashboardData } from '@/lib/hooks/use-student-dashboard-data';
import { ProfileCompletionAlert } from '@/components/features/student/ProfileCompletionAlert';
import { ProfileCompletionModal } from '@/components/features/student/ProfileCompletionModal';
import { EnrollmentStatus } from '@/components/features/student/EnrollmentStatus';
import { GroupAssignmentCard } from '@/components/features/student/GroupAssignmentCard';
import { QuickActions } from '@/components/features/student/QuickActions';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button, Chip } from '@nextui-org/react';
import { ListSkeleton, CardGridSkeleton } from '@/components/shared/Skeletons';
import Link from 'next/link';
import { BookOpen, CreditCard, Users } from 'lucide-react';
import { StartTourButton } from '@/components/shared/StartTourButton';
import { UpcomingPracticals } from '@/components/features/student/UpcomingPracticals';
import { useQueryClient } from '@tanstack/react-query';

interface StudentDashboardClientProps {
  userId: string;
}

export function StudentDashboardClient({ userId }: StudentDashboardClientProps) {
  const { profile, enrollment, isLoading, error } = useStudentDashboardData(userId);
  const queryClient = useQueryClient();
  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['student-profile', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['student-enrollment', userId] }),
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div id="student-welcome">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back!</h1>
            <p className="text-neutral-600">Here&apos;s what&apos;s happening with your practical training.</p>
            <div className="mt-3">
              <StartTourButton tour="student-dashboard" label="Start Tour" />
            </div>
          </div>
          <div className="shrink-0">
            <Button
              variant="bordered"
              color="primary"
              size="sm"
              aria-label="Refresh dashboard data"
              isDisabled={isLoading}
              onPress={refetchAll}
            >
              {isLoading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Guidance */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm">
        Tip: The card below shows your next step. Complete your profile, finish payment, or review your group to keep moving.
      </div>

      {/* Profile Completion - Permanent Modal + Dismissible Banner */}
      {profile && (
        <>
          <ProfileCompletionModal profile={profile as any} />
          <ProfileCompletionAlert 
            profile={profile as any}
            dismissible={true}
          />
        </>
      )}

      {/* Guided Next Step Callout */}
      <div>
        <StateRenderer
          data={{ profile, enrollment }}
          isLoading={isLoading}
          error={error}
          onRetry={() => window.location.reload()}
          loadingComponent={null}
          emptyComponent={null}
        >
          {() => {
            const status = (enrollment?.status || '').toString().toLowerCase()
            const payStatus = (enrollment?.payment_status || '').toString().toLowerCase()
            let title = 'You are all set'
            let desc = 'Explore your dashboard to see upcoming practicals and quick actions.'
            let ctaHref: string | null = null
            let ctaLabel = ''

            if (!profile) {
              title = 'Complete your profile'
              desc = 'Add your details to get personalized guidance and enable enrollment.'
              ctaHref = '/student/profile'
              ctaLabel = 'Complete Profile'
            } else if (!enrollment) {
              title = 'Enroll in a skill'
              desc = 'Choose a practical training program to get started.'
              ctaHref = '/student/skills'
              ctaLabel = 'Browse Skills'
            } else if (payStatus === 'failed') {
              title = 'Payment failed'
              desc = 'Retry your payment to continue with your enrollment.'
              ctaHref = '/student/enrollment'
              ctaLabel = 'Retry Payment'
            } else if (payStatus.includes('pending') || payStatus === 'unpaid' || status === 'unpaid' || status.includes('pending')) {
              title = 'Payment pending'
              desc = 'Complete your payment to secure your spot.'
              ctaHref = '/student/enrollment'
              ctaLabel = 'Go to Payment'
            } else if (['paid','assigned','active'].includes(status)) {
              const awaitingGroup = status === 'paid' && !enrollment.group?.id
              title = awaitingGroup ? 'Awaiting group assignment' : 'Group assigned'
              desc = awaitingGroup ? 'You will be assigned to a group soon.' : 'Review your group and schedule.'
              ctaHref = awaitingGroup ? '/student/enrollment' : '/student/my-group'
              ctaLabel = awaitingGroup ? 'View Enrollment' : 'View Group'
            } else if (status === 'cancelled') {
              title = 'Enrollment cancelled'
              desc = 'You can choose another skill and enroll again.'
              ctaHref = '/student/skills'
              ctaLabel = 'Browse Skills'
            }

            return (
              <Card shadow="sm" className="w-full border-primary-200 bg-primary-50">
                <CardHeader className="flex items-center justify-between px-4 pt-4">
                  <div>
                    <p className="text-lg font-medium leading-normal">{title}</p>
                    <p className="text-sm text-neutral-700 mt-1">{desc}</p>
                  </div>
                  {ctaHref && (
                    <Button as={Link} href={ctaHref} color="primary" size="sm">
                      {ctaLabel}
                    </Button>
                  )}
                </CardHeader>
              </Card>
            )
          }}
        </StateRenderer>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Status Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Status */}
          <Card shadow="sm" className="w-full" id="student-enrollment-status">
            <CardHeader className="px-4 pt-4">
              <p className="text-base font-medium text-neutral-900">Enrollment Overview</p>
            </CardHeader>
            <CardBody className="p-4">
              <StateRenderer
                data={enrollment}
                isLoading={isLoading}
                error={error}
                onRetry={refetchAll}
                loadingComponent={<div className="py-2"><ListSkeleton rows={2} /></div>}
                emptyComponent={
                  <div className="text-center">
                    <BookOpen className="h-10 w-10 text-primary mb-2 inline-block" />
                    <p className="text-xl font-medium leading-normal">No Active Enrollment</p>
                    <p className="text-sm text-neutral-600 mt-1">You haven&apos;t enrolled in any skills yet. Browse available skills to get started.</p>
                    <div className="mt-4">
                      <Button as={Link} href="/student/skills" color="primary" variant="solid">Browse Skills</Button>
                    </div>
                  </div>
                }
              >
                {(enrollment) => (
                  <div className="space-y-4">
                    <EnrollmentStatus 
                      enrollment={{
                        id: enrollment.id.toString(),
                        skillName: enrollment.skill?.title || 'Unknown Skill',
                        status: enrollment.status.toUpperCase() as any,
                        paymentStatus: enrollment.payment_status,
                        group: enrollment.group?.id?.toString()
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
                              <p className="text-lg font-medium leading-normal">{status === 'paid' && !enrollment.group?.id ? 'Awaiting Group Assignment' : 'Group Assigned'}</p>
                            </CardHeader>
                            <CardBody className="p-6">
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-neutral-700">
                                  {status === 'paid' && !enrollment.group?.id
                                    ? 'You will be assigned to a group soon. You can review your schedule once assigned.'
                                    : 'Check your group roster and practical schedule.'}
                                </p>
                                <Button as={Link} href={status === 'paid' && !enrollment.group?.id ? '/student/enrollment' : '/student/my-group'} color="success" size="sm">
                                  {status === 'paid' && !enrollment.group?.id ? 'View Enrollment' : 'View Group'}
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
                                <p className="text-base md:text-sm text-neutral-700">Check your group roster and practical schedule.</p>
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
                  </div>
                )}
              </StateRenderer>
            </CardBody>
          </Card>

          {/* Group Assignment */}
          {enrollment && (
            <Card shadow="sm" className="w-full">
              <CardHeader className="px-4 pt-4">
                <p className="text-base font-medium text-neutral-900">Group</p>
              </CardHeader>
              <CardBody className="p-4">
                <StateRenderer
                  data={enrollment.group?.id}
                  isLoading={isLoading}
                  error={error}
                  onRetry={refetchAll}
                  loadingComponent={<div className="py-2"><ListSkeleton rows={2} /></div>}
                  emptyComponent={null}
                >
                  {(groupId) => (
                    <GroupAssignmentCard
                      enrollment={{
                        id: enrollment.id.toString(),
                        status: enrollment.status
                      }}
                      group={{
                        number: parseInt(String(groupId))
                      }}
                    />
                  )}
                </StateRenderer>
              </CardBody>
            </Card>
          )}

        </div>

        {/* Right Column - Quick Actions + Widgets */}
        <div className="lg:col-span-1">
          <div id="student-quick-actions" className="space-y-6 lg:sticky lg:top-24">
            <Card shadow="sm">
              <CardHeader className="px-4 pt-4">
                <p className="text-base font-medium text-neutral-900">Quick Actions</p>
              </CardHeader>
              <CardBody className="p-4">
                <QuickActions 
                  enrollment={enrollment ? {
                    status: enrollment.status,
                    group: enrollment.group?.id ? { id: enrollment.group.id.toString() } : undefined
                  } : undefined}
                  hasProfile={!!profile}
                />
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardHeader className="px-4 pt-4">
                <p className="text-base font-medium text-neutral-900">Upcoming Practicals</p>
              </CardHeader>
              <CardBody className="p-4">
                <UpcomingPracticals practicals={[]} limit={5} />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
