"use client"
import React from "react"

/**
 * * EnrollmentStatusBadge
 * Shows enrollment progression status with color coding and icons.
 * TODO: Style states PENDING → PAID → ASSIGNED → COMPLETED and optional tooltip.
 *
 * Props:
 * - status: 'PENDING' | 'PAID' | 'ASSIGNED' | 'COMPLETED'
 * - showTooltip?: boolean
 */
export type EnrollmentStatusBadgeProps = {
  status: "PENDING" | "PAID" | "ASSIGNED" | "COMPLETED"
  showTooltip?: boolean
}

export default function EnrollmentStatusBadge(_props: EnrollmentStatusBadgeProps) {
  // TODO: Render styled badge and optional tooltip
  return <span>{/* TODO: Enrollment status badge */}</span>
}


