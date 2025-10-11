// * Student Skills Page
// * Browse/enroll in skills with improved UI/UX and clear information hierarchy

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { studentsApi, enrollmentsApi } from '@/lib/api';
import StudentSkillsClient from './StudentSkillsClient';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import { ArrowLeft, BookOpen, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SkillsPageData {
  profile: any;
  availableSkills: any[];
  enrollment: any;
}

async function getSkillsPageData(userId: string): Promise<SkillsPageData> {
  try {
    const [profileResponse, skillsResponse, enrollmentResponse] = await Promise.allSettled([
      studentsApi.getProfile(userId),
      studentsApi.getAvailableSkills(userId),
      enrollmentsApi.getUserEnrollment(userId)
    ]);

    const profile = profileResponse.status === 'fulfilled' ? profileResponse.value.data : null;
    const availableSkills = skillsResponse.status === 'fulfilled' ? skillsResponse.value.data : [];
    const enrollment = enrollmentResponse.status === 'fulfilled' ? enrollmentResponse.value.data : null;

    return {
      profile,
      availableSkills,
      enrollment
    };
  } catch (error) {
    console.error('Error fetching skills page data:', error);
    return {
      profile: null,
      availableSkills: [],
      enrollment: null
    };
  }
}

export default async function StudentSkills() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getSkillsPageData(user.id);

  // Check if user has a profile
  if (!data.profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              as={Link}
              href="/student/dashboard"
              isIconOnly
              variant="light"
              className="text-neutral-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Skill Enrollment
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                Choose and enroll in skills to enhance your learning
              </p>
            </div>
          </div>

          {/* Profile Required Card */}
          <Card className="border-2 border-warning-300 bg-warning-50">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-warning-100 rounded-lg flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-warning-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-warning-900 mb-2">
                    Profile Setup Required
                  </h2>
                  <p className="text-sm text-warning-800 mb-4 leading-relaxed">
                    Before you can enroll in skills, you need to complete your student profile. 
                    This helps us recommend the right skills for your level and track your progress.
                  </p>
                  <Button
                    as={Link}
                    href="/student/profile/create"
                    color="warning"
                    variant="solid"
                    startContent={<BookOpen className="h-4 w-4" />}
                  >
                    Create Your Profile
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <NotificationContainer />
        </div>
      </div>
    );
  }

  // Check if there are any skills available
  const hasSkills = data.availableSkills && data.availableSkills.length > 0;
  const hasEnrollment = !!data.enrollment;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            as={Link}
            href="/student/dashboard"
            isIconOnly
            variant="light"
            className="text-neutral-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">
                Skill Enrollment
              </h1>
              {hasEnrollment && (
                <Chip 
                  color="success" 
                  variant="flat" 
                  size="sm"
                  startContent={<BookOpen className="h-3 w-3" />}
                >
                  Currently Enrolled
                </Chip>
              )}
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              {data.profile.student_level} • {hasSkills ? `${data.availableSkills.length} skills available` : 'No skills available'}
            </p>
          </div>
        </div>

        {hasEnrollment && (
          <Button
            as={Link}
            href="/student/enrollment"
            color="primary"
            variant="flat"
            size="sm"
          >
            View Enrollment
          </Button>
        )}
      </div>

      {/* Info Banner */}
      {hasSkills && (
        <Card className="border border-primary-200 bg-primary-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-primary-900">
                  <span className="font-medium">How it works:</span> Browse available skills and click on any skill to view details. 
                  {hasEnrollment 
                    ? ' You can only enroll in one skill at a time. Complete your current enrollment to select a new skill.'
                    : ' When you find one you like, click "Enroll Now" to get started.'
                  }
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Skills Content */}
      {hasSkills ? (
        <StudentSkillsClient
          availableSkills={data.availableSkills}
          studentLevel={data.profile.student_level}
          enrollment={data.enrollment}
        />
      ) : (
        <Card className="border border-neutral-200">
          <CardBody className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-neutral-100 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No Skills Available Yet
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                There are currently no skills available for {data.profile.student_level} level. 
                New skills are added regularly, so check back soon or contact your administrator for more information.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <NotificationContainer />
    </div>
  );
}