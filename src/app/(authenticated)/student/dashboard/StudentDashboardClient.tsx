// * Student Dashboard Client Component
// * Modern dashboard following admin/mentor design patterns
// * Uses composite data hook for optimized data fetching

'use client';

import React from 'react';
import { useStudentDashboardData } from '@/lib/hooks/use-student-dashboard-data';
import { ProfileCompletionAlert } from '@/components/features/student/ProfileCompletionAlert';
import { ProfileCompletionModal } from '@/components/features/student/ProfileCompletionModal';
import { QuickActions } from '@/components/features/student/QuickActions';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StatCard, StatCardGrid } from '@/components/shared/StatCard';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

interface StudentDashboardClientProps {
  userId: string;
}

export function StudentDashboardClient({ userId }: StudentDashboardClientProps) {
  const { profile, enrollment, upcomingPracticals, isLoading, error } = useStudentDashboardData(userId);
  const queryClient = useQueryClient();
  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['student-profile', 'me'] }),
      queryClient.invalidateQueries({ queryKey: ['student-enrollment', userId] }),
    ]);
  };

  // * Calculate key metrics for StatCards
  const enrollmentStatus = enrollment?.status || 'Not Enrolled';
  const upcomingCount = upcomingPracticals.length;
  const groupNumber = enrollment?.group?.group_number || enrollment?.group?.id || '—';
  const groupSize = enrollment?.group?.current_student_count || '0';

  return (
    <div className="space-y-4">
      {/* * Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Student Dashboard</h1>
            <p className="text-sm text-neutral-600">
              {enrollment ? `${enrollment.skill?.title || 'Unknown Skill'} - ${enrollmentStatus}` : 'Not Enrolled'}
            </p>
          </div>
          <Button
            color="primary"
            variant="bordered"
            size="sm"
            isDisabled={isLoading}
            onPress={refetchAll}
          >
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* * Stats */}
      <StatCardGrid columns={4}>
        <StatCard 
          title="Status" 
          value={enrollmentStatus} 
          color={enrollment ? "success" : "neutral"}
          size="sm"
        />
        <StatCard 
          title="Group" 
          value={groupNumber} 
          color={enrollment?.group ? "primary" : "neutral"}
          size="sm"
        />
        <StatCard 
          title="Practicals" 
          value={upcomingCount.toString()} 
          color={upcomingCount > 0 ? "warning" : "neutral"}
          size="sm"
        />
        <StatCard 
          title="Group Size" 
          value={groupSize} 
          color="neutral"
          size="sm"
        />
      </StatCardGrid>

      {/* Profile Completion - Temporarily disabled to debug StateRenderer error */}
      {/* {profile && (
        <>
          <ProfileCompletionModal profile={profile as any} />
          <ProfileCompletionAlert 
            profile={profile as any}
            dismissible={true}
          />
        </>
      )} */}

      {/* * Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* * Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* * Next Step */}
          <Card shadow="sm">
            <CardBody className="p-4">
              {(() => {
                const status = (enrollment?.status || '').toString().toLowerCase()
                const payStatus = (enrollment?.payment_status || '').toString().toLowerCase()
                let title = 'All set!'
                let desc = 'Check your upcoming practicals and group details.'
                let ctaHref: string | null = null
                let ctaLabel = ''
                let color: 'primary' | 'success' | 'warning' | 'danger' = 'success'

                if (!profile) {
                  title = 'Complete Profile'
                  desc = 'Add your details to enable enrollment.'
                  ctaHref = '/student/profile'
                  ctaLabel = 'Complete'
                  color = 'primary'
                } else if (!enrollment) {
                  title = 'Enroll in Skill'
                  desc = 'Choose a practical training program.'
                  ctaHref = '/student/skills'
                  ctaLabel = 'Browse'
                  color = 'primary'
                } else if (payStatus === 'failed') {
                  title = 'Payment Failed'
                  desc = 'Retry your payment to continue.'
                  ctaHref = '/student/enrollment'
                  ctaLabel = 'Retry'
                  color = 'danger'
                } else if (payStatus.includes('pending') || payStatus === 'unpaid' || status === 'unpaid' || status.includes('pending')) {
                  title = 'Payment Pending'
                  desc = 'Complete payment to secure your spot.'
                  ctaHref = '/student/enrollment'
                  ctaLabel = 'Pay'
                  color = 'warning'
                } else if (['paid','assigned','active'].includes(status)) {
                  const awaitingGroup = status === 'paid' && !enrollment.group?.id
                  title = awaitingGroup ? 'Awaiting Group' : 'Group Assigned'
                  desc = awaitingGroup ? 'You will be assigned soon.' : 'Check your group details.'
                  ctaHref = awaitingGroup ? '/student/enrollment' : '/student/my-group'
                  ctaLabel = awaitingGroup ? 'View' : 'View Group'
                  color = 'success'
                } else if (status === 'cancelled') {
                  title = 'Enrollment Cancelled'
                  desc = 'Choose another skill to enroll.'
                  ctaHref = '/student/skills'
                  ctaLabel = 'Browse'
                  color = 'warning'
                }

                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{title}</p>
                      <p className="text-sm text-neutral-600">{desc}</p>
                    </div>
                    {ctaHref && (
                      <Button as={Link} href={ctaHref} color={color} size="sm">
                        {ctaLabel}
                      </Button>
                    )}
                  </div>
                )
              })()}
            </CardBody>
          </Card>

          {/* * Enrollment Status */}
          {enrollment && (
            <Card shadow="sm">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{enrollment.skill?.title || 'Unknown Skill'}</p>
                    <p className="text-sm text-neutral-600">Status: {enrollment.status}</p>
                  </div>
                  <Chip color={enrollment.status === 'active' ? 'success' : 'primary'} size="sm">
                    {enrollment.status}
                  </Chip>
                </div>
              </CardBody>
            </Card>
          )}

          {/* * Upcoming Practicals */}
          {enrollment && upcomingPracticals.length > 0 && (
            <Card shadow="sm">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-neutral-900">Upcoming Practicals</p>
                  <Chip size="sm" variant="flat">{upcomingPracticals.length}</Chip>
                </div>
                <div className="space-y-2">
                  {upcomingPracticals.slice(0, 3).map((practical, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-900">{practical.skill}</span>
                      <span className="text-neutral-600">
                        {new Date(practical.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {upcomingPracticals.length > 3 && (
                    <p className="text-xs text-neutral-500 text-center">
                      +{upcomingPracticals.length - 3} more
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* * Right Column */}
        <div className="lg:col-span-1 space-y-4">
          {/* * Quick Actions */}
          <Card shadow="sm">
            <CardBody className="p-4">
              <p className="font-medium text-neutral-900 mb-3">Quick Actions</p>
              <QuickActions 
                enrollment={enrollment ? {
                  status: enrollment.status,
                  group: enrollment.group?.id ? { id: enrollment.group.id.toString() } : undefined
                } : undefined}
                hasProfile={!!profile}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* * Notifications - Temporarily disabled to debug StateRenderer error */}
      {/* <NotificationContainer /> */}
    </div>
  );
}