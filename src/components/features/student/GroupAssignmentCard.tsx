"use client"
import React from "react"

/**
 * * GroupAssignmentCard
 * Shows assigned group details or waiting state if paid but unassigned.
 * TODO: Render group number, mentor name, schedule; handle unassigned state.
 *
 * Props:
 * - enrollment: { id: string; status: string }
 * - group?: { number: number; mentorName: string; schedule?: string }
 * - mentor?: { name: string }
 */
export type GroupAssignmentCardProps = {
  enrollment: { id: string; status: string }
  group?: { number: number; mentorName: string; schedule?: string }
  mentor?: { name: string }
}

export default function GroupAssignmentCard(_props: GroupAssignmentCardProps) {
  // TODO: Render assignment details
  return <div>{/* TODO: GroupAssignmentCard UI */}</div>
}


