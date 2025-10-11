// * Student My Group Page
// * Shows student's group assignment, schedule, and group details
// * Uses real data from enrollment and group APIs

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi, skillGroupsApi } from '@/lib/api';
import { Card, CardHeader, CardBody, Divider, Chip, Button, Spinner } from '@heroui/react';
import { Calendar, Clock, AlertCircle, Info, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { GroupAssignmentCard } from '@/components/features/student/GroupAssignmentCard';

export const dynamic = 'force-dynamic';

interface GroupDetails {
  skill?: {
    date_range_start?: string;
    date_range_end?: string;
  };
  schedule: {
    excludeWeekends: boolean;
    assignedPracticalDate?: string;
  };
}

interface PracticalScheduleCardProps {
  groupDetails: GroupDetails;
}

export function PracticalScheduleCard({ groupDetails }: PracticalScheduleCardProps) {
  const hasSchedule = groupDetails.schedule.assignedPracticalDate || 
    (groupDetails.skill?.date_range_start && groupDetails.skill?.date_range_end);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const importantNotes = [
    'Bring your student ID and QR code scanner',
    'Notify your mentor if you\'ll be late or absent',
    'Check for schedule updates from your mentor',
    'Specific session times will be announced by your mentor'
  ];

  return (
    <Card shadow="sm">
      <CardHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-neutral-900">Practical Schedule</h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="px-6 py-5">
        <div className="space-y-6">
          {/* Schedule Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
              Schedule Details
            </h3>
            
            {hasSchedule ? (
              <div className="space-y-3">
                {groupDetails.schedule.assignedPracticalDate ? (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Assigned Date</p>
                      <p className="text-base font-semibold text-neutral-900 mt-1">
                        {formatDate(groupDetails.schedule.assignedPracticalDate)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                    <Calendar className="h-5 w-5 text-neutral-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Period</p>
                      <p className="text-base font-semibold text-neutral-900 mt-1">
                        {new Date(groupDetails.skill!.date_range_start!).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })} - {new Date(groupDetails.skill!.date_range_end!).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50">
                  <Clock className="h-5 w-5 text-neutral-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">Schedule Type</p>
                    <p className="text-base text-neutral-900 mt-1">
                      {groupDetails.schedule.excludeWeekends ? 'Weekdays only' : 'All days'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-neutral-900">Schedule Pending</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    Your practical schedule will be announced by your mentor soon.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Important Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                Important Notes
              </h3>
            </div>
            
            <ul className="space-y-2">
              {importantNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="text-primary mt-1">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

async function getMyGroupData(userId: string) {
  try {
    // Fetch enrollment data to get group information
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    const enrollment = enrollmentResponse.data;

    console.log('[getMyGroupData] Enrollment response:', enrollmentResponse);
    console.log('[getMyGroupData] Enrollment data:', enrollment);

    if (!enrollment) {
      return {
        enrollment: null,
        groupDetails: null,
        error: 'No enrollment found'
      };
    }

    // Check if student has been assigned to a group
    if (!enrollment.group || !enrollment.group.id) {
      console.log('[getMyGroupData] No group assignment found in enrollment:', enrollment);
      return {
        enrollment,
        groupDetails: null,
        error: null // This is not an error - student just hasn't been assigned yet
      };
    }

    console.log('[getMyGroupData] Group assignment found:', enrollment.group);
    
    // Use the group information from the enrollment response
    // Students don't have permission to access skill groups API directly
    const groupDetails = {
      id: enrollment.group.id,
      group_number: enrollment.group.group_number,
      group_display_name: enrollment.group.group_display_name,
      skill: enrollment.skill, // Skill info is already in enrollment
      schedule: {
        exclude_weekends: enrollment.skill?.exclude_weekends || false,
        assigned_practical_date: null // This would need to come from a different API
      }
    };

    console.log('[getMyGroupData] Group details constructed:', groupDetails);

    return {
      enrollment,
      groupDetails,
      error: null
    };
  } catch (error) {
    console.error('Error fetching group data:', error);
    return {
      enrollment: null,
      groupDetails: null,
      error: error instanceof Error ? error.message : 'Failed to load group data'
    };
  }
}

export default async function StudentMyGroup() {
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-default-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-default-900 mb-2">Authentication Error</h3>
          <p className="text-default-600 mb-4">Please log in to view your group information.</p>
          <Button as={Link} href="/auth/sign_in" color="primary">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const { enrollment, groupDetails, error } = await getMyGroupData(user.id);

  if (error) {
    return (
      <div className="min-h-screen bg-default-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
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
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Group</h1>
              <p className="text-neutral-600">View your group assignment and schedule</p>
            </div>
          </div>

          {/* Error State */}
          <Card shadow="sm" className="border-danger-200 bg-danger-50">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-danger" />
                <div>
                  <h3 className="text-lg font-medium text-danger-800">Error Loading Group Data</h3>
                  <p className="text-sm text-danger-700 mt-1">{error}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-default-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
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
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Group</h1>
              <p className="text-neutral-600">View your group assignment and schedule</p>
            </div>
          </div>

          {/* No Enrollment */}
          <Card shadow="sm" className="border-warning-200 bg-warning-50">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-warning" />
                <div>
                  <h3 className="text-lg font-medium text-warning-800">No Enrollment Found</h3>
                  <p className="text-sm text-warning-700 mt-1">
                    You need to enroll in a skill first before you can be assigned to a group.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Group</h1>
            <p className="text-neutral-600">View your group assignment and schedule</p>
          </div>
        </div>

        {/* Group Assignment Card */}
        <GroupAssignmentCard
          enrollment={{
            id: enrollment.id.toString(),
            status: enrollment.status
          }}
          group={enrollment.group ? {
            number: parseInt(enrollment.group.group_number),
            mentorName: 'Mentor Name' // This would need to come from a different API or be included in enrollment
          } : undefined}
        />

        {/* Practical Schedule Card - Only show if student has been assigned to a group */}
        {enrollment.group && groupDetails && (
          <PracticalScheduleCard
            groupDetails={{
              skill: groupDetails.skill,
              schedule: {
                excludeWeekends: groupDetails.schedule?.exclude_weekends || false,
                assignedPracticalDate: groupDetails.schedule?.assigned_practical_date
              }
            }}
          />
        )}

        {/* No Group Assignment Message */}
        {!enrollment.group && (
          <Card shadow="sm" className="border-primary-200 bg-primary-50">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-medium text-primary-800">Awaiting Group Assignment</h3>
                  <p className="text-sm text-primary-700 mt-1">
                    You have successfully enrolled in {enrollment.skill?.title || 'your skill'}. 
                    Your group assignment will be announced soon by your administrator.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}