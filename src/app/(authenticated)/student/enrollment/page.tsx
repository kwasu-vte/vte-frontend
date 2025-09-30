// * Student Enrollment Page
// * Current enrollment status with StatusTimeline and enrollment cards
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi, skillsApi } from '@/lib/api';
import { StatusTimeline } from '@/components/features/student/StatusTimeline';
import { EnrollmentStatus } from '@/components/features/student/EnrollmentStatus';
import { PaymentRedirect } from '@/components/features/student/PaymentRedirect';
import { GroupAssignmentCard } from '@/components/features/student/GroupAssignmentCard';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button } from '@nextui-org/react';
import { ArrowLeft, BookOpen, CreditCard, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EnrollmentPageData {
  enrollment: any;
  selectedSkill: any | null;
}

//

async function getEnrollmentPageData(userId: string, skillId: string | null): Promise<EnrollmentPageData> {
  try {
    console.info('[EnrollmentPage:getEnrollmentPageData] userId=', userId, 'skillId=', skillId);
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    const enrollment = enrollmentResponse.success ? enrollmentResponse.data : null;
    console.info('[EnrollmentPage:getEnrollmentPageData] enrollmentExists=', !!enrollment);
  let selectedSkill: any | null = null;
    if (skillId) {
      try {
        console.info('[EnrollmentPage:getEnrollmentPageData] fetching skill by id (apiRequest):', skillId);
        const skillRes = await skillsApi.getById(skillId);
        const shapeKeys = skillRes && typeof skillRes === 'object' ? Object.keys(skillRes as any) : [];
        const raw = skillRes as any;
        try {
          console.info('[EnrollmentPage:getEnrollmentPageData] skillRes.raw (apiRequest)=', JSON.stringify(raw).slice(0, 1000));
        } catch (_) {
          console.info('[EnrollmentPage:getEnrollmentPageData] skillRes.raw (apiRequest)=', raw);
        }
        const parsedSkill = raw?.data ?? raw?.skill ?? raw?.data?.skill ?? null;
        selectedSkill = parsedSkill || null;
        console.info('[EnrollmentPage:getEnrollmentPageData] skillRes.keys (apiRequest)=', shapeKeys, 'skillParsed=', !!selectedSkill, 'title=', selectedSkill?.title);
      } catch (err: any) {
        console.error('[EnrollmentPage:getEnrollmentPageData] skillFetchError (apiRequest) for id:', skillId, 'err=', err);
        // Secondary fallback A: try list endpoint and find by id (handles 403 on detail route)
        try {
          const allSkills = await skillsApi.getAll().catch(() => null);
          const list = (allSkills as any)?.data?.data || (allSkills as any)?.data || [];
          const found = Array.isArray(list)
            ? list.find((s: any) => (s?.id != null ? String(s.id) : null) === String(skillId))
            : null;
          if (found) {
            selectedSkill = found;
            console.info('[EnrollmentPage:getEnrollmentPageData] recovered skill via list endpoint. title=', selectedSkill?.title);
          }
        } catch (_) {
          // ignore and try raw fetch fallback next
        }

        // Secondary fallback B: raw fetch to proxy with absolute URL (server-safe)
        if (!selectedSkill) {
          try {
            const { cookies: getCookies } = await import('next/headers');
            const cookieStore = await getCookies();
            const sessionToken = cookieStore.get('session_token');
            const headers: Record<string, string> = { 'Accept': 'application/json' };
            if (sessionToken?.value) headers['Authorization'] = `Bearer ${sessionToken.value}`;
            const isServer = typeof window === 'undefined';
            const origin = isServer
              ? (process.env.NEXT_PUBLIC_APP_URL
                  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))
              : '';
            const url = `${origin}/api/v1/skills/${skillId}`;
            console.info('[EnrollmentPage:getEnrollmentPageData] fetching skill by id (fallback fetch):', url, 'authHdr=', !!headers['Authorization']);
            const resp = await fetch(url, { headers, cache: 'no-store' as any });
            const status = resp.status;
            const text = await resp.text();
            console.info('[EnrollmentPage:getEnrollmentPageData] fallback status=', status, 'bodySnippet=', text.slice(0, 500));
            if (resp.ok) {
              try {
                const json = JSON.parse(text);
                const parsedSkill = json?.data ?? json?.skill ?? json?.data?.skill ?? json ?? null;
                selectedSkill = parsedSkill || null;
                console.info('[EnrollmentPage:getEnrollmentPageData] fallback parsed title=', selectedSkill?.title);
              } catch (parseErr) {
                console.error('[EnrollmentPage:getEnrollmentPageData] fallback JSON parse error:', parseErr);
              }
            }
          } catch (fallbackErr) {
            console.error('[EnrollmentPage:getEnrollmentPageData] skillFetchError (fallback) for id:', skillId, 'err=', fallbackErr);
          }
        }
      }
    }

    return {
      enrollment,
      selectedSkill
    };
  } catch (error) {
    console.error('Error fetching enrollment page data:', error);
    return {
      enrollment: null,
      selectedSkill: null
    };
  }
}

export default async function StudentEnrollment({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const sp = await searchParams;
  const skillParam = Array.isArray(sp?.skill) ? sp.skill[0] : sp?.skill ?? null;
  console.info('[EnrollmentPage] query.skill =', skillParam);
  const data = await getEnrollmentPageData(user.id, skillParam);

  // If user has no enrollment and provided a skill with explicit confirmation, create enrollment and redirect to payment
  const confirmParam = Array.isArray(sp?.confirm) ? sp.confirm[0] : sp?.confirm ?? null;
  console.info('[EnrollmentPage] query.confirm =', confirmParam, 'hasEnrollment=', !!data.enrollment, 'hasSelectedSkill=', !!data.selectedSkill);
  if (!data.enrollment && skillParam && confirmParam === '1') {
    const created = await enrollmentsApi.createForUser(user.id, { skill_id: skillParam });
    if (!created.success) {
      console.error('[EnrollmentPage] Failed to create enrollment for skill:', skillParam);
    } else {
      const pay = await enrollmentsApi.payForUser(user.id, { enrollment_id: created.data.id });
      if (pay.success && pay.data?.payment_url) {
        // Use Next.js server redirect (throws NEXT_REDIRECT to short-circuit rendering)
        redirect(pay.data.payment_url);
      }
    }
  }

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
            My Enrollment
          </h1>
          <p className="text-neutral-600">
            Track your enrollment status and progress.
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
              <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Active Enrollment</h3>
              <p className="text-neutral-600 mb-6">
                You haven&apos;t enrolled in any skills yet. Browse available skills to get started.
              </p>
              {(data.selectedSkill || skillParam) ? (
                <div className="space-y-4">
                  <div className="text-left inline-block">
                    <p className="text-sm font-medium text-neutral-900">Selected Skill</p>
                    <p className="text-sm text-neutral-700">
                      {data.selectedSkill?.title || skillParam}
                    </p>
                  </div>
                  <Button
                    as={Link}
                    href={`/student/enrollment?skill=${data.selectedSkill?.id || skillParam}&confirm=1`}
                    color="primary"
                  >
                    Enroll and Pay
                  </Button>
                </div>
              ) : (
                <Button
                  as={Link}
                  href="/student/skills"
                  color="primary"
                  startContent={<BookOpen className="h-4 w-4" />}
                >
                  Browse Skills
                </Button>
              )}
            </CardBody>
          </Card>
        }
      >
        {(enrollment) => (
          <div className="space-y-6">
            {/* Status Timeline */}
            <StatusTimeline
              enrollment={{
                status: enrollment.status,
                payment_status: enrollment.payment_status,
                created_at: enrollment.created_at,
                updated_at: enrollment.updated_at
              }}
              skill={enrollment.skill ? { title: enrollment.skill.title } : undefined}
            />

            {/* Enrollment Status Card */}
            <EnrollmentStatus
              enrollment={{
                id: enrollment.id.toString(),
                skillName: enrollment.skill?.title || 'Unknown Skill',
                status: enrollment.status.toUpperCase() as any,
                paymentStatus: enrollment.payment_status,
                group: enrollment.group_id?.toString()
              }}
              showTimeline={false}
            />

            {/* Payment Section */}
            {(enrollment.status === 'pending' || enrollment.payment_status === 'pending') && (
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Complete Payment</p>
                </CardHeader>
                <CardBody className="p-6">
                  <PaymentRedirect
                    enrollment={{ id: enrollment.id.toString() }}
                    amount={5000} // This would come from the enrollment data
                    onProceed={() => {
                      // This would typically redirect to payment gateway
                      console.log('Proceeding to payment...')
                    }}
                  />
                </CardBody>
              </Card>
            )}

            {/* Group Assignment */}
            {enrollment.group_id && (
              <GroupAssignmentCard
                enrollment={{
                  id: enrollment.id.toString(),
                  status: enrollment.status
                }}
                group={{
                  number: parseInt(enrollment.group_id),
                  mentorName: 'Loading...', // This would come from group details API
                  schedule: 'Loading...'
                }}
              />
            )}

            {/* Next Steps */}
            <Card shadow="sm" className="w-full">
              <CardHeader className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-xl font-medium leading-normal">Next Steps</p>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {enrollment.status === 'pending' && (
                    <div className="flex items-start gap-3 p-4 bg-warning-50 rounded-lg">
                      <div className="text-warning-600 mt-1">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-warning-800">
                          Complete Payment
                        </p>
                        <p className="text-xs text-warning-700">
                          Complete your payment to secure your enrollment and get assigned to a group.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {enrollment.status === 'paid' && (
                    <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                      <div className="text-primary-600 mt-1">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-800">
                          Awaiting Group Assignment
                        </p>
                        <p className="text-xs text-primary-700">
                          Your payment has been confirmed. You will be assigned to a group shortly.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {enrollment.status === 'assigned' && (
                    <div className="flex items-start gap-3 p-4 bg-success-50 rounded-lg">
                      <div className="text-success-600 mt-1">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-success-800">
                          Group Assigned
                        </p>
                        <p className="text-xs text-success-700">
                          You have been assigned to a group. Check your group details and start attending practical sessions.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {enrollment.status === 'active' && (
                    <div className="flex items-start gap-3 p-4 bg-success-50 rounded-lg">
                      <div className="text-success-600 mt-1">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-success-800">
                          Enrollment Active
                        </p>
                        <p className="text-xs text-success-700">
                          Your enrollment is active. Attend practical sessions and track your progress.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </StateRenderer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
