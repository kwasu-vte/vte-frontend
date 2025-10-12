"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react"
import { Users, UserCircle, Clock, CheckCircle2 } from "lucide-react"

export type GroupAssignmentCardProps = {
  enrollment: { id: string; status: string }
  group?: { number: number; mentorName?: string }
}

function GroupAssignmentCard({ enrollment, group }: GroupAssignmentCardProps) {
  const isAssigned = Boolean(group)

  return (
    <Card shadow="sm" className="w-full border border-neutral-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${isAssigned ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'}
            `}>
              {isAssigned ? (
                <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Clock className="h-5 w-5" strokeWidth={2} />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">Group Assignment</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Enrollment #{enrollment.id}
              </p>
            </div>
          </div>
          <Chip
            size="sm"
            variant="flat"
            color={isAssigned ? "success" : "warning"}
            classNames={{
              base: 'h-7',
              content: 'text-xs font-semibold px-2'
            }}
          >
            {isAssigned ? 'Assigned' : 'Pending'}
          </Chip>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="pt-5 pb-5">
        {isAssigned ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <Users className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-1">Group Number</p>
                  <p className="text-base font-semibold text-neutral-900">{group!.number}</p>
                </div>
              </div>
              
              {group?.mentorName && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <UserCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-1">Mentor</p>
                    <p className="text-base font-semibold text-neutral-900">{group.mentorName}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <p className="text-sm text-neutral-600 leading-relaxed">
                View your full roster and schedule on the My Group page to connect with your mentor and peers.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-50 border border-warning-100">
              <Clock className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-sm font-medium text-warning-900 mb-1">
                  Assignment in Progress
                </p>
                <p className="text-sm text-warning-700 leading-relaxed">
                  We're finalizing your group assignment. You'll receive a notification once you've been assigned.
                </p>
              </div>
            </div>
            
            <p className="text-xs text-neutral-500 px-1">
              Your group number and mentor details will appear here once the assignment is complete.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export { GroupAssignmentCard }
export default GroupAssignmentCard