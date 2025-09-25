"use client"
import React from "react"
import { Chip } from "@nextui-org/react"
import { CheckCircle, Clock, XCircle } from "lucide-react"

/**
 * * AttendanceCompletionBadge
 * Visual indicator of daily attendance completion.
 * Follows design guide with NextUI components and proper styling.
 *
 * Props:
 * - date: string
 * - scanProgress: { required: number; completed: number }
 */
export type AttendanceCompletionBadgeProps = {
  date: string
  scanProgress: { required: number; completed: number }
}

function AttendanceCompletionBadge({ date, scanProgress }: AttendanceCompletionBadgeProps) {
  const { required, completed } = scanProgress
  const percentage = required > 0 ? Math.round((completed / required) * 100) : 0
  
  const getStatus = () => {
    if (completed === 0) {
      return {
        color: 'default' as const,
        variant: 'flat' as const,
        icon: XCircle,
        text: 'Not Started',
        description: 'No scans completed'
      }
    } else if (completed < required) {
      return {
        color: 'warning' as const,
        variant: 'flat' as const,
        icon: Clock,
        text: 'In Progress',
        description: `${completed}/${required} scans`
      }
    } else {
      return {
        color: 'success' as const,
        variant: 'flat' as const,
        icon: CheckCircle,
        text: 'Completed',
        description: 'All scans done'
      }
    }
  }

  const status = getStatus()
  const IconComponent = status.icon

  return (
    <div className="flex items-center gap-2">
      <Chip
        color={status.color}
        variant={status.variant}
        startContent={<IconComponent className="h-3 w-3" />}
        size="sm"
      >
        {status.text}
      </Chip>
      <span className="text-xs text-neutral-600">
        {status.description}
      </span>
    </div>
  )
}

export { AttendanceCompletionBadge }
export default AttendanceCompletionBadge
