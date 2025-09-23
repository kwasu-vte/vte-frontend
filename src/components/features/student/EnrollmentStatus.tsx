"use client"
import React from "react"

/**
 * * EnrollmentStatus
 * Current enrollment status display with timeline.
 * TODO: Render timeline: Selected → Paid → Assigned → Active with details.
 *
 * Props:
 * - enrollment: { id: string; skillName: string; status: 'SELECTED' | 'PAID' | 'ASSIGNED' | 'ACTIVE'; paymentStatus?: string; group?: string }
 * - showTimeline?: boolean
 */
export type EnrollmentStatusProps = {
  enrollment: { id: string; skillName: string; status: 'SELECTED' | 'PAID' | 'ASSIGNED' | 'ACTIVE'; paymentStatus?: string; group?: string }
  showTimeline?: boolean
}

export default function EnrollmentStatus(_props: EnrollmentStatusProps) {
  // TODO: Render status and optional timeline
  return <div>{/* TODO: EnrollmentStatus UI */}</div>
}


