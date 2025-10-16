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
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { ArrowLeft, BookOpen, CreditCard, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EnrollmentPageData {
  enrollment: any;
  selectedSkill: any | null;
}

// * Utility function to determine enrollment status from API response
function getEnrollmentStatusInfo(enrollment: any) {
  if (!enrollment) return { status: 'no_enrollment', needsPayment: false, isAssigned: false };
  
  const status = enrollment.status?.toLowerCase() || '';
  const hasReference = !!enrollment.reference;
  const hasGroup = !!enrollment.group;
  
  return {
    status,
    hasReference,
    hasGroup,
    needsPayment: status === 'pending_payment' && !hasReference,
    paymentInProgress: status === 'pending_payment' && hasReference,
    isAssigned: status === 'assigned' && hasGroup,
    isCancelled: status === 'cancelled',
    groupNumber: enrollment.group?.group_number || null,
    skillTitle: enrollment.skill?.title || null,
    reference: enrollment.reference || null
  };
}

//

async function getEnrollmentPageData(userId: string, skillId: string | null): Promise<EnrollmentPageData> {
  try {
    console.info('[EnrollmentPage:getEnrollmentPageData] userId=', userId, 'skillId=', skillId);
    
    // * Log enrollment API request
    console.log('[EnrollmentPage:getEnrollmentPageData] API Request - getUserEnrollment:', {
      userId,
      timestamp: new Date().toISOString()
    });
    
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    
    // * Log enrollment API response
    console.log('[EnrollmentPage:getEnrollmentPageData] API Response - getUserEnrollment:', {
      success: enrollmentResponse.success,
      message: enrollmentResponse.message || null,
      hasData: !!enrollmentResponse.data,
      data: enrollmentResponse.data,
      // * Key enrollment status indicators
      enrollmentStatus: enrollmentResponse.data?.status || null,
      paymentReference: enrollmentResponse.data?.reference || null,
      hasGroupAssignment: !!enrollmentResponse.data?.group,
      groupNumber: enrollmentResponse.data?.group?.group_number || null,
      skillTitle: enrollmentResponse.data?.skill?.title || null,
      timestamp: new Date().toISOString()
    });
    
    const enrollment = enrollmentResponse.success ? enrollmentResponse.data : null;
    console.info('[EnrollmentPage:getEnrollmentPageData] enrollmentExists=', !!enrollment);
    
    // * Log enrollment status analysis
    if (enrollment) {
      const statusInfo = getEnrollmentStatusInfo(enrollment);
      console.log('[EnrollmentPage:getEnrollmentPageData] Enrollment Status Analysis:', {
        ...statusInfo,
        timestamp: new Date().toISOString()
      });
    }
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
                  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://vte.com.ng'))
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
    // * Log enrollment creation API request
    console.log('[EnrollmentPage] API Request - createForUser:', {
      userId: user.id,
      skillId: skillParam,
      timestamp: new Date().toISOString()
    });
    
    const created = await enrollmentsApi.createForUser(user.id, { skill_id: skillParam });
    
    // * Log enrollment creation API response
    console.log('[EnrollmentPage] API Response - createForUser:', {
      success: created.success,
      message: created.message || null,
      hasData: !!created.data,
      data: created.data,
      enrollmentId: created.data?.id || null,
      timestamp: new Date().toISOString()
    });
    
    if (!created.success) {
      console.error('[EnrollmentPage] Failed to create enrollment for skill:', skillParam);
    } else {
      // * Log payment API request
      console.log('[EnrollmentPage] API Request - payForUser:', {
        userId: user.id,
        enrollmentId: created.data.id,
        timestamp: new Date().toISOString()
      });
      
      const pay = await enrollmentsApi.payForUser(user.id, { enrollment_id: created.data.id });
      
      // * Log payment API response
      console.log('[EnrollmentPage] API Response - payForUser:', {
        success: pay.success,
        message: pay.message || null,
        hasData: !!pay.data,
        data: pay.data,
        hasPaymentUrl: !!pay.data?.payment_url,
        paymentUrl: pay.data?.payment_url || null,
        timestamp: new Date().toISOString()
      });
      
      if (pay.success && pay.data?.payment_url) {
        console.log('[EnrollmentPage] Redirecting to payment URL:', pay.data.payment_url);
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
      {data.enrollment ? (
        <div className="space-y-6">
          {/* Status Timeline */}
          {(() => {
            const timelineData = {
              status: data.enrollment.status,
              payment_status: data.enrollment.payment_status || (() => {
                // * Fallback logic: determine payment status from enrollment status and reference
                if (data.enrollment.status === 'assigned' || data.enrollment.status === 'paid') {
                  return 'paid'; // If assigned/active, payment must be complete
                }
                if (data.enrollment.reference) {
                  return 'pending'; // Has reference but not assigned yet = payment in progress
                }
                return 'pending'; // No reference = payment not started
              })(),
              created_at: data.enrollment.created_at,
              updated_at: data.enrollment.updated_at
            };
            
            // * Log what's being passed to StatusTimeline
            console.log('[EnrollmentPage] StatusTimeline Props:', {
              enrollment: timelineData,
              hasPaymentStatus: 'payment_status' in data.enrollment,
              originalPaymentStatus: data.enrollment.payment_status,
              fallbackPaymentStatus: timelineData.payment_status,
              usedFallback: !data.enrollment.payment_status,
              timestamp: new Date().toISOString()
            });
            
            return (
              <StatusTimeline
                enrollment={timelineData}
                skill={data.enrollment.skill ? { title: data.enrollment.skill.title } : undefined}
              />
            );
          })()}

          {/* Enrollment Status Card */}
          <EnrollmentStatus
            enrollment={{
              id: data.enrollment.id.toString(),
              skillName: data.enrollment.skill?.title || 'Unknown Skill',
              status: data.enrollment.status.toUpperCase() as any,
              paymentStatus: data.enrollment.payment_status,
              group: data.enrollment.group_id?.toString()
            }}
            showTimeline={false}
          />

          {/* Payment Section */}
          {(() => {
            const status = (data.enrollment.status || '').toString().toLowerCase();
            const payStatus = (data.enrollment.payment_status || '').toString().toLowerCase();
            
            // * If user is assigned, don't show payment section regardless of payment_status
            if (status === 'assigned' || status === 'paid') {
              return false;
            }
            
            // * Show payment section only if status is pending_payment or payment_status is pending/failed
            const isPaymentPending = status === 'pending_payment' 
              || payStatus === 'pending' 
              || payStatus === 'failed'
              || status === 'unpaid'
              || payStatus === 'unpaid';
            
            return isPaymentPending;
          })() && (
            <Card shadow="sm" className="w-full">
              <CardHeader className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <p className="text-xl font-medium leading-normal">Complete Payment</p>
              </CardHeader>
              <CardBody className="p-6">
                <PaymentRedirect
                  enrollment={{ id: data.enrollment.id.toString() }}
                  userId={user.id}
                />
              </CardBody>
            </Card>
          )}

          {/* Group Assignment */}
          {(() => {
            const shouldShowGroup = ['assigned','active'].includes((data.enrollment.status || '').toString().toLowerCase()) || data.enrollment.group;
            const groupNumber = data.enrollment.group?.group_number || 0;
            
            // * Log group assignment data
            console.log('[EnrollmentPage] Group Assignment Data:', {
              shouldShowGroup,
              enrollmentStatus: data.enrollment.status,
              hasGroup: !!data.enrollment.group,
              groupNumber,
              groupData: data.enrollment.group,
              timestamp: new Date().toISOString()
            });
            
            return shouldShowGroup && (
              <GroupAssignmentCard
                enrollment={{
                  id: data.enrollment.id.toString(),
                  status: data.enrollment.status
                }}
                group={{
                  number: groupNumber,
                  mentorName: 'Loading...', // This would come from group details API
                }}
              />
            );
          })()}

          {/* Cancellation Notice */}
          {data.enrollment.status === 'cancelled' && (
            <Card shadow="sm" className="w-full border-warning-200 bg-warning-50">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning-100 rounded-full">
                    <BookOpen className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warning-800">
                      Enrollment Cancelled
                    </p>
                    <p className="text-xs text-warning-700">
                      You can browse skills and enroll again at any time.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      ) : (
        <Card shadow="sm" className="w-full">
          <CardBody className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No Active Enrollment</h3>
            <p className="text-neutral-600 mb-6">
              You haven't enrolled in any skills yet. Browse available skills to get started.
            </p>
            {/* Guidance when skill is pre-selected */}
            {(data.selectedSkill || skillParam) && (
              <Card className="mb-6 border-neutral-200 bg-neutral-50">
                <CardBody className="p-4">
                  <p className="text-sm text-neutral-700">
                    You selected <span className="font-medium">{data.selectedSkill?.title || skillParam}</span>. Click "Enroll and Pay" to create your enrollment and proceed to payment.
                  </p>
                </CardBody>
              </Card>
            )}
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
      )}
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
