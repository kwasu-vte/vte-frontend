// * Practical Schedule Card Component
// * Displays practical session schedule and important notes for students
// * Used in student my-group page

import React from 'react';
import { Card, CardHeader, CardBody, Divider } from '@heroui/react';
import { Calendar, Clock, AlertCircle, Info } from 'lucide-react';

interface GroupDetails {
  skill?: {
    date_range_start?: string | null;
    date_range_end?: string | null;
  };
  schedule: {
    excludeWeekends: boolean;
    assignedPracticalDate?: string | null;
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
                        {groupDetails.skill?.date_range_start && groupDetails.skill?.date_range_end ? (
                          <>
                            {new Date(groupDetails.skill.date_range_start).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })} - {new Date(groupDetails.skill.date_range_end).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </>
                        ) : 'TBD'}
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

export default PracticalScheduleCard;
