"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react"

/**
 * * GroupAssignmentCard
 * Shows assigned group details or waiting state if paid but unassigned.
 *
 * Props:
 * - enrollment: { id: string; status: string }
 * - group?: { number: number; mentorName?: string }
 */
export type GroupAssignmentCardProps = {
  enrollment: { id: string; status: string }
  group?: { number: number; mentorName?: string }
}

function GroupAssignmentCard({ enrollment, group }: GroupAssignmentCardProps) {
  const isAssigned = Boolean(group)

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Enrollment</p>
          <p className="text-xl font-medium leading-normal">{enrollment.id}</p>
        </div>
        <Chip color={isAssigned ? "success" : "warning"} variant="solid">
          {isAssigned ? "Assigned" : "Pending Assignment"}
        </Chip>
      </CardHeader>
      <CardBody className="space-y-2">
        {isAssigned ? (
          <>
            <p className="text-sm text-neutral-600">Group Number: <span className="text-neutral-900 font-medium">{group!.number}</span></p>
            {group?.mentorName && (
              <p className="text-sm text-neutral-600">Mentor: <span className="text-neutral-900 font-medium">{group.mentorName}</span></p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-neutral-600">We are finalizing your group assignment. You will receive a notification shortly.</p>
          </>
        )}
      </CardBody>
    </Card>
  )
}

export { GroupAssignmentCard }
export default GroupAssignmentCard
