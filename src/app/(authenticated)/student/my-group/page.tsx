// * Student My Group Page
// * View assigned group with GroupInfoCard, MentorCard, GroupMembersList, and PracticalSchedule
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi, skillGroupsApi } from '@/lib/api';
import { GroupAssignmentCard } from '@/components/features/student/GroupAssignmentCard';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button, Avatar, Chip, Divider } from '@heroui/react';
import { ArrowLeft, Users, User, Calendar, Mail, Phone, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getSpecializationLabel } from '@/lib/utils/specialization';

export const dynamic = 'force-dynamic';

interface MyGroupPageData {
  enrollment: any;
  groupDetails: any;
}

async function getMyGroupPageData(userId: string): Promise<MyGroupPageData> {
  try {
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    const enrollment = enrollmentResponse.success ? enrollmentResponse.data : null;

    // Fetch real group details if user has a group assignment
    let groupDetails = null;
    
    if (enrollment?.group?.id) {
      try {
        const groupResponse = await skillGroupsApi.getById(Number(enrollment.group.id));
        const group = groupResponse.data;
        
        if (group) {
          groupDetails = {
            id: group.id,
            name: group.group_display_name || `Group ${group.group_number}`,
            skill: group.skill,
            members: [], // Students cannot access member data
            schedule: {
              start: group.skill?.date_range_start || group.created_at,
              end: group.skill?.date_range_end || group.updated_at,
              excludeWeekends: group.skill?.exclude_weekends || false,
              practicalDates: group.practical_dates || [],
              // assignedPracticalDate removed: property not present on SkillGroup
            },
            capacity: 0, // Students cannot access capacity data
            currentSize: 0 // Students cannot access member count
          };
        }
      } catch (error) {
        console.warn('Could not fetch group details:', error);
        // Fallback to basic group info from enrollment
        groupDetails = {
          id: enrollment.group.id,
          name: enrollment.group.group_display_name || `Group ${enrollment.group.group_number}`,
          skill: enrollment.skill,
          members: [],
          schedule: {
            start: enrollment.skill?.date_range_start || enrollment.created_at,
            end: enrollment.skill?.date_range_end || enrollment.updated_at,
            excludeWeekends: enrollment.skill?.exclude_weekends || false,
            practicalDates: [],
            // assignedPracticalDate removed: property not present on group
          },
          capacity: 0, // Students cannot access capacity data
          currentSize: 0 // Students cannot access member count
        };
      }
    }

    return {
      enrollment,
      groupDetails
    };
  } catch (error) {
    console.error('Error fetching my group page data:', error);
    return {
      enrollment: null,
      groupDetails: null
    };
  }
}

export default async function StudentMyGroup() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getMyGroupPageData(user.id);

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
            My Group
          </h1>
          <p className="text-neutral-600">
            View your assigned group details and members.
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
              <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Group Assignment</h3>
              <p className="text-neutral-600 mb-6">
                You haven&apos;t been assigned to a group yet. Complete your enrollment and payment to get assigned.
              </p>
              <Button
                as={Link}
                href="/student/enrollment"
                color="primary"
                startContent={<Users className="h-4 w-4" />}
              >
                View Enrollment
              </Button>
            </CardBody>
          </Card>
        }
      >
        {(enrollment) => {
          // Check if student is assigned to a group
          const isAssigned = enrollment.status === 'assigned' || enrollment.status === 'active';
          
          if (!isAssigned || !data.groupDetails) {
            return (
              <Card shadow="sm" className="w-full">
                <CardBody className="p-8 text-center">
                  <Users className="h-12 w-12 text-warning-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Awaiting Group Assignment</h3>
                  <p className="text-neutral-600 mb-6">
                    Your enrollment is confirmed but you haven&apos;t been assigned to a group yet. This usually happens within 24-48 hours after payment confirmation.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-500">
                      Current status: <span className="font-medium capitalize">{enrollment.status}</span>
                    </p>
                    <p className="text-sm text-neutral-500">
                      Payment status: <span className="font-medium capitalize">{enrollment.payment_status}</span>
                    </p>
                  </div>
                </CardBody>
              </Card>
            );
          }

          return (
            <div className="space-y-6">
              {/* Group Assignment Card */}
              <GroupAssignmentCard
                enrollment={{
                  id: enrollment.id.toString(),
                  status: enrollment.status
                }}
                group={{
                  number: parseInt(data.groupDetails.id),
                  mentorName: 'TBD',
                  // schedule removed; not part of GroupAssignmentCardProps
                }}
              />

              {/* Group Information */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Group Information</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Group Name</span>
                      <span className="font-medium text-neutral-900">{data.groupDetails.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Skill</span>
                      <span className="font-medium text-neutral-900">{data.groupDetails.skill?.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Practical Period</span>
                      <span className="font-medium text-neutral-900">
                        {data.groupDetails.skill?.date_range_start && data.groupDetails.skill?.date_range_end
                          ? `${new Date(data.groupDetails.skill.date_range_start).toLocaleDateString()} - ${new Date(data.groupDetails.skill.date_range_end).toLocaleDateString()}`
                          : 'TBD'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Schedule Type</span>
                      <span className="font-medium text-neutral-900">
                        {data.groupDetails.schedule.excludeWeekends ? 'Weekdays only' : 'All days'}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>



              {/* Practical Schedule */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Practical Schedule</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-medium text-neutral-900">Schedule Information</h3>
                        <div className="space-y-2 text-sm">
                          {data.groupDetails.schedule.assignedPracticalDate ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-neutral-400" />
                                <span className="text-neutral-600">Assigned Date:</span>
                                <span className="font-medium">
                                  {new Date(data.groupDetails.schedule.assignedPracticalDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-neutral-400" />
                                <span className="text-neutral-600">Schedule:</span>
                                <span className="font-medium">
                                  {data.groupDetails.schedule.excludeWeekends ? 'Weekdays only' : 'All days'}
                                </span>
                              </div>
                            </>
                          ) : data.groupDetails.skill?.date_range_start && data.groupDetails.skill?.date_range_end ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-neutral-400" />
                                <span className="text-neutral-600">Period:</span>
                                <span className="font-medium">
                                  {new Date(data.groupDetails.skill.date_range_start).toLocaleDateString()} - {new Date(data.groupDetails.skill.date_range_end).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-neutral-400" />
                                <span className="text-neutral-600">Schedule:</span>
                                <span className="font-medium">
                                  {data.groupDetails.schedule.excludeWeekends ? 'Weekdays only' : 'All days'}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-neutral-400" />
                              <span className="text-neutral-600">Status:</span>
                              <span className="font-medium">Schedule will be announced by mentor</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-medium text-neutral-900">Important Notes</h3>
                        <div className="space-y-2 text-sm text-neutral-600">
                          <p>• Bring your student ID and QR code scanner</p>
                          <p>• Notify your mentor if you&apos;ll be late or absent</p>
                          <p>• Check for schedule updates from your mentor</p>
                          <p>• Specific session times will be announced by your mentor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        }}
      </StateRenderer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
