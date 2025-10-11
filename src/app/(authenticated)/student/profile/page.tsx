// * Student Profile Page
// * View profile with ProfileView and current enrollment
// * Improved UI/UX with better hierarchy and organization

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { studentsApi, enrollmentsApi } from '@/lib/api';
import { ProfileView } from '@/components/features/student/ProfileView';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { Card, CardBody, CardHeader, Button, Chip, Progress, Divider } from '@heroui/react';
import { ArrowLeft, BookOpen, Calendar, CheckCircle, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface ProfilePageData {
  profile: any;
  enrollment: any; // Single current enrollment
}

async function getProfilePageData(userId: string): Promise<ProfilePageData> {
  try {
    const [profileResponse, enrollmentResponse] = await Promise.allSettled([
      studentsApi.getProfile(userId),
      enrollmentsApi.getUserEnrollment(userId)
    ]);

    const profile = profileResponse.status === 'fulfilled' ? profileResponse.value.data : null;
    const enrollment = enrollmentResponse.status === 'fulfilled' ? enrollmentResponse.value.data : null;

    return {
      profile,
      enrollment
    };
  } catch (error) {
    console.error('Error fetching profile page data:', error);
    return {
      profile: null,
      enrollment: null
    };
  }
}

export default async function StudentProfile() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getProfilePageData(user.id);

  // Calculate profile completion
  const requiredFields = [
    data.profile?.matric_number,
    data.profile?.student_level,
    data.profile?.department,
    data.profile?.faculty,
    data.profile?.phone,
    data.profile?.gender
  ];
  const completedFields = requiredFields.filter(f => f && f !== 'Not specified' && f !== 'Not provided').length;
  const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
  const isProfileComplete = completionPercentage === 100;

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
          <h1 className="text-3xl font-bold text-neutral-900">
            My Profile
          </h1>
          <p className="text-neutral-600">
            Manage your personal information and track your learning progress
          </p>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {!isProfileComplete && data.profile && (
        <Card className="border-l-4 border-warning bg-warning-50">
          <CardBody className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-neutral-900 mb-1">
                  Complete your profile
                </p>
                <p className="text-sm text-neutral-600 mb-3">
                  Your profile is {completionPercentage}% complete. Add missing information to unlock all features.
                </p>
                <Button 
                  as={Link}
                  href="/student/profile/edit"
                  size="sm" 
                  color="warning" 
                  variant="flat"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile & Enrollment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile View */}
          {data.profile ? (
            <ProfileView 
              profile={data.profile}
              showCompletionBadge={false}
            />
          ) : (
            <Card shadow="sm" className="w-full">
              <CardHeader>
                <p className="text-xl font-medium leading-normal">No Profile Found</p>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-neutral-600 mb-4">
                  You haven't created your profile yet.
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
          )}

          {/* Current Enrollment Card */}
          <Card shadow="sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-neutral-900">
                  Current Enrollment
                </h2>
              </div>
            </CardHeader>
            
            <Divider />
            
            <CardBody className="pt-6">
              {data.enrollment ? (
                <div className="space-y-4">
                  {/* Skill Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                        {data.enrollment.skill?.title || 'Unknown Skill'}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-neutral-600">
                        {data.enrollment.academic_session && (
                          <>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {data.enrollment.academic_session.name}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>
                          Enrolled {new Date(data.enrollment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Chip 
                        color="success" 
                        variant="flat" 
                        size="sm"
                        startContent={<CheckCircle className="h-3 w-3" />}
                      >
                        {data.enrollment.status}
                      </Chip>
                      <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm"
                      >
                        {data.enrollment.payment_status}
                      </Chip>
                    </div>
                  </div>

                  <Divider />

                  {/* Action Button */}
                  <Button 
                    as={Link}
                    href="/student/my-group"
                    color="primary" 
                    className="w-full"
                    endContent={<ArrowRight className="h-4 w-4" />}
                  >
                    View My Group
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-900 font-medium mb-2">
                    No Active Enrollment
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    You're not currently enrolled in any skill. Browse available skills to get started.
                  </p>
                  <Button 
                    as={Link}
                    href="/student/skills"
                    color="primary"
                    endContent={<ArrowRight className="h-4 w-4" />}
                  >
                    Browse Skills
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Quick Stats & Info */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          {data.profile && (
            <Card shadow="sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Quick Stats
                  </h2>
                </div>
              </CardHeader>
              
              <Divider />
              
              <CardBody className="pt-6">
                <div className="space-y-4">
                  {data.profile.enrollments_count && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600">Total Enrollments</span>
                        <span className="text-2xl font-bold text-primary">{data.profile.enrollments_count}</span>
                      </div>
                      <Divider />
                    </>
                  )}
                  {data.profile.attendances_count && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600">Attendance Records</span>
                        <span className="text-2xl font-bold text-success">{data.profile.attendances_count}</span>
                      </div>
                      <Divider />
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Profile Completion</span>
                    <span className={`text-2xl font-bold ${isProfileComplete ? 'text-success' : 'text-warning'}`}>
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Attendance Info Card */}
          <Card shadow="sm" className="bg-primary-50">
            <CardBody className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    Track Your Attendance
                  </h3>
                  <p className="text-sm text-neutral-700 mb-3">
                    View your attendance history and upcoming sessions through your group page.
                  </p>
                  <Button 
                    as={Link}
                    href="/student/my-group"
                    size="sm" 
                    color="primary" 
                    variant="flat"
                    endContent={<ArrowRight className="h-4 w-4" />}
                  >
                    View Attendance
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card shadow="sm">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold text-neutral-900">
                Quick Actions
              </h2>
            </CardHeader>
            
            <Divider />
            
            <CardBody className="pt-4">
              <div className="space-y-2">
                <Button 
                  as={Link}
                  href="/student/profile/edit"
                  variant="flat" 
                  className="w-full justify-start" 
                  color="default"
                >
                  Update Profile
                </Button>
                <Button 
                  as={Link}
                  href="/student/dashboard"
                  variant="flat" 
                  className="w-full justify-start" 
                  color="default"
                >
                  View Dashboard
                </Button>
                <Button 
                  as={Link}
                  href="/student/skills"
                  variant="flat" 
                  className="w-full justify-start" 
                  color="default"
                >
                  Browse Skills
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}