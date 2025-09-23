"use client"
import React from "react"

/**
 * * ManualAttendance
 * Backup form for taking attendance without QR; requires reason for manual entry.
 * TODO: Implement checklist of students with timestamp and submission.
 *
 * Props:
 * - students: Array<{ id: string; name: string; matric: string }>
 * - group: { id: string; name: string }
 * - onSubmit: (payload: { reason: string; entries: Array<{ studentId: string; timestamp: string }> }) => void
 */
export type ManualAttendanceProps = {
  students: Array<{ id: string; name: string; matric: string }>
  group: { id: string; name: string }
  onSubmit: (payload: { reason: string; entries: Array<{ studentId: string; timestamp: string }> }) => void
}

export default function ManualAttendance(_props: ManualAttendanceProps) {
  // TODO: Render manual attendance form and validation
  return <div>{/* TODO: ManualAttendance UI */}</div>
}


