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

export default function EnrollmentStatusBadge({ status, showTooltip = false }: EnrollmentStatusBadgeProps) {
  const lower = status.toLowerCase() as 'pending' | 'paid' | 'assigned' | 'completed'

  const color: 'default' | 'warning' | 'success' | 'primary' =
    lower === 'pending' ? 'warning' : lower === 'paid' ? 'primary' : lower === 'assigned' ? 'success' : 'success'

  const label =
    lower === 'pending' ? 'Pending' : lower === 'paid' ? 'Paid' : lower === 'assigned' ? 'Assigned' : 'Completed'

  const Chip = require('@heroui/react').Chip as React.ComponentType<any>
  const Tooltip = require('@heroui/react').Tooltip as React.ComponentType<any>

  const chip = <Chip color={color} variant="flat" size="sm">{label}</Chip>

  if (!showTooltip) return chip

  return (
    <Tooltip content={`Status: ${label}`}>{chip}</Tooltip>
  )
}


