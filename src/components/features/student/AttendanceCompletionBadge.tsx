"use client"
import React from "react"

/**
 * * AttendanceCompletionBadge
 * Visual indicator of daily attendance completion.
 * TODO: Style states: Not started, In progress (x/y), Completed.
 *
 * Props:
 * - date: string
 * - scanProgress: { required: number; completed: number }
 */
export type AttendanceCompletionBadgeProps = {
  date: string
  scanProgress: { required: number; completed: number }
}

export default function AttendanceCompletionBadge(_props: AttendanceCompletionBadgeProps) {
  // TODO: Render status badge content
  return <span>{/* TODO: AttendanceCompletionBadge UI */}</span>
}


