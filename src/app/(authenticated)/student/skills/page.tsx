// * Student Skills Page
// * Browse/enroll in skills with SkillSelectionGrid and SkillDetailModal
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { studentsApi } from '@/lib/api';
import { SkillSelectionGrid } from '@/components/features/student/SkillSelectionGrid';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button } from '@nextui-org/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SkillsPageData {
  profile: any;
  availableSkills: any[];
}

async function getSkillsPageData(userId: string): Promise<SkillsPageData> {
  try {
    // Fetch profile and available skills in parallel
    const [profileResponse, skillsResponse] = await Promise.allSettled([
      studentsApi.getProfile(userId),
      studentsApi.getAvailableSkills(userId)
    ]);

    const profile = profileResponse.status === 'fulfilled' ? profileResponse.value.data : null;
    const availableSkills = skillsResponse.status === 'fulfilled' ? skillsResponse.value.data : [];

    return {
      profile,
      availableSkills
    };
  } catch (error) {
    console.error('Error fetching skills page data:', error);
    return {
      profile: null,
      availableSkills: []
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
              Available Skills
            </h1>
            <p className="text-neutral-600">
              Browse and enroll in skills available for your level.
            </p>
          </div>
        </div>

        {/* Profile Required Alert */}
        <Card className="border-warning bg-warning-50">
          <CardBody className="p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-warning" />
              <div>
                <h3 className="text-lg font-medium text-warning-800">
                  Profile Required
                </h3>
                <p className="text-sm text-warning-700 mb-4">
                  You need to create your profile before you can enroll in skills.
                </p>
                <Button
                  as={Link}
                  href="/student/profile/create"
                  color="warning"
                  variant="solid"
                >
                  Create Profile
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <NotificationContainer />
      </div>
    );
  }

  const handleSelectSkill = (skillId: string) => {
    // This would typically open a skill detail modal or navigate to enrollment
    console.log('Selected skill:', skillId);
    // For now, we'll just log it - in a real implementation, this would:
    // 1. Open a SkillDetailModal with enrollment options
    // 2. Or navigate to /student/enrollment with the skill pre-selected
  };

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
            Available Skills
          </h1>
          <p className="text-neutral-600">
            Browse and enroll in skills available for your level.
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <StateRenderer
        data={data.availableSkills}
        loadingComponent={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} shadow="sm" className="w-full">
                <CardBody className="p-6">
                  <Skeleton className="h-40 w-full" />
                </CardBody>
              </Card>
            ))}
          </div>
        }
        emptyComponent={
          <Card shadow="sm" className="w-full">
            <CardBody className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Skills Available</h3>
              <p className="text-neutral-600">
                There are no skills available for your level at this time. Check back later or contact your administrator.
              </p>
            </CardBody>
          </Card>
        }
      >
        {(skills) => (
          <SkillSelectionGrid
            availableSkills={skills}
            studentLevel={data.profile.student_level}
            onSelectSkill={handleSelectSkill}
            isLoading={false}
          />
        )}
      </StateRenderer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
