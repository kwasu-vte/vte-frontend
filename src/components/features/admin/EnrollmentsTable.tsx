"use client"
import React from "react"

/**
 * * EnrollmentsTable
 * Lists all enrollments with filters and actions.
 * TODO: Implement table with columns and filter controls; wire onAssignGroup.
 *
 * Props:
 * - enrollments: Array<{
 *     id: string; student: string; skill: string; status: string; payment: string; group?: string; date: string
 *   }>
 * - filters: Record<string, any>
 * - onAssignGroup: (enrollmentId: string) => void
 */
export type EnrollmentsTableProps = {
  enrollments: Array<{ id: string; student: string; skill: string; status: string; payment: string; group?: string; date: string }>
  filters: Record<string, unknown>
  onAssignGroup: (enrollmentId: string) => void
}

export default function EnrollmentsTable(_props: EnrollmentsTableProps) {
  // TODO: Render table and filters
  return <div>{/* TODO: EnrollmentsTable UI */}</div>
}


