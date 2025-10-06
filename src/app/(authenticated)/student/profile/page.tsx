// * Student Profile Page
// * View profile with ProfileView, EnrollmentHistory, and AttendanceSummary
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { studentsApi, enrollmentsApi, qrCodesApi } from '@/lib/api';
import { ProfileView } from '@/components/features/student/ProfileView';
import { AttendanceReport } from '@/components/features/student/AttendanceReport';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button } from '@nextui-org/react';
import { ArrowLeft, History, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface ProfilePageData {
  profile: any;
  enrollments: any[];
  attendanceSummary: any;
}

async function getProfilePageData(userId: string): Promise<ProfilePageData> {
  try {
    // Fetch profile and enrollment data in parallel
    const [profileResponse, enrollmentsResponse] = await Promise.allSettled([
      studentsApi.getProfile(userId),
      enrollmentsApi.getAll({ per_page: 50 }) // Get recent enrollments
    ]);

    const profile = profileResponse.status === 'fulfilled' ? profileResponse.value.data : null;
    const allEnrollments = enrollmentsResponse.status === 'fulfilled' ? enrollmentsResponse.value.data.items : [];
    
    // Filter enrollments for this user
    const userEnrollments = allEnrollments.filter((enrollment: any) => enrollment.user_id === userId);

    // Derive attendance summary from QR scan data if user has an active enrollment
    let attendanceSummary = null;
    if (profile && userEnrollments.length > 0) {
      const activeEnrollment = userEnrollments.find((enrollment: any) => 
        enrollment.status === 'assigned' || enrollment.status === 'active'
      );
      
      if (activeEnrollment && activeEnrollment.group_id) {
        try {
          // Get attendance report for the group
          const attendanceResponse = await qrCodesApi.getGroupAttendanceReport(Number(activeEnrollment.group_id));
          const attendanceData = attendanceResponse.data;
          
          if (attendanceData) {
            // Calculate attendance stats from the report
            const totalEnrolled = parseInt(String(attendanceData.group_info?.total_enrolled || '0'));
            const attendedStudents = attendanceData.students?.length || 0;
            
            attendanceSummary = {
              totalSessions: totalEnrolled,
              attendedSessions: attendedStudents,
              attendanceRate: totalEnrolled > 0 ? Math.round((attendedStudents / totalEnrolled) * 100) : 0,
              lastAttendance: attendanceData.group_info?.practical_date || new Date().toISOString()
            };
          }
        } catch (error) {
          console.warn('Could not fetch attendance data:', error);
          // Fallback to null - will show empty state
        }
      }
    }

    return {
      profile,
      enrollments: userEnrollments,
      attendanceSummary
    };
  } catch (error) {
    console.error('Error fetching profile page data:', error);
    return {
      profile: null,
      enrollments: [],
      attendanceSummary: null
    };
  }
}

export default async function StudentProfile() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getProfilePageData(user.id);

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
            My Profile
          </h1>
          <p className="text-neutral-600">
            View your profile information and academic history.
          </p>
        </div>
      </div>

      {/* Profile View */}
      <StateRenderer
        isLoading={false}
        error={null}
        data={data.profile}
        loadingComponent={
          <Card shadow="sm" className="w-full">
            <CardBody className="p-6">
              <Skeleton className="h-40 w-full" />
            </CardBody>
          </Card>
        }
        emptyComponent={
          <Card shadow="sm" className="w-full">
            <CardHeader>
              <p className="text-xl font-medium leading-normal">No Profile Found</p>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-neutral-600 mb-4">
                You haven&apos;t created your profile yet.
              </p>
              <Button
                as={Link}
                href="/student/profile/create"
                color="primary"
              >
                Create Profile
              </Button>
            </CardBody>
          </Card>
        }
      >
        {(profile) => (
          <ProfileView 
            profile={profile}
            showCompletionBadge={true}
          />
        )}
      </StateRenderer>

      {/* Enrollment History */}
      <Card shadow="sm" className="w-full">
        <CardHeader className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <p className="text-xl font-medium leading-normal">Enrollment History</p>
        </CardHeader>
        <CardBody className="p-6">
          <StateRenderer
        isLoading={false}
        error={null}
            data={data.enrollments}
            loadingComponent={<Skeleton className="h-20 w-full" />}
            emptyComponent={
              <div className="text-center py-8">
                <p className="text-sm text-neutral-600">No enrollment history found.</p>
              </div>
            }
          >
            {(enrollments) => (
              <div className="space-y-3">
                {enrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{enrollment.skill?.title || 'Unknown Skill'}</p>
                      <p className="text-sm text-neutral-600">
                        Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900 capitalize">{enrollment.status}</p>
                      <p className="text-xs text-neutral-600 capitalize">{enrollment.payment_status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </StateRenderer>
        </CardBody>
      </Card>

      {/* Attendance Summary */}
      <StateRenderer
        isLoading={false}
        error={null}
        data={data.attendanceSummary}
        loadingComponent={
          <Card shadow="sm" className="w-full">
            <CardBody className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardBody>
          </Card>
        }
        emptyComponent={null}
      >
        {(summary) => (
          <Card shadow="sm" className="w-full">
            <CardHeader className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <p className="text-xl font-medium leading-normal">Attendance Summary</p>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{summary.totalSessions}</p>
                  <p className="text-sm text-primary-700">Total Sessions</p>
                </div>
                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <p className="text-2xl font-bold text-success">{summary.attendedSessions}</p>
                  <p className="text-sm text-success-700">Attended Sessions</p>
                </div>
                <div className="text-center p-4 bg-warning-50 rounded-lg">
                  <p className="text-2xl font-bold text-warning">{summary.attendanceRate}%</p>
                  <p className="text-sm text-warning-700">Attendance Rate</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-600">
                  Last attendance: {new Date(summary.lastAttendance).toLocaleDateString()}
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </StateRenderer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
