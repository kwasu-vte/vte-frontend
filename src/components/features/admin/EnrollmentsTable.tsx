"use client"
import React from "react"
import { Pagination } from "@nextui-org/react"
import type { Enrollment } from "@/lib/types"
import EnrollmentStatusBadge from "./EnrollmentStatusBadge"
import { DataTable } from "@/components/shared/DataTable"

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
  enrollments: Enrollment[]
  perPage?: number
  onAssignGroup?: (enrollmentId: number) => void
}

export default function EnrollmentsTable({ enrollments, perPage = 25, onAssignGroup }: EnrollmentsTableProps) {
  const [page, setPage] = React.useState(1)
  const total = enrollments.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const rows = React.useMemo(() => enrollments.slice((page - 1) * perPage, page * perPage), [enrollments, page, perPage])

  const columns = [
    { key: "student", label: "Student", render: (e: Enrollment) => `${e.user?.last_name ?? ''} ${e.user?.first_name ?? ''}`.trim() || e.user_id },
    { key: "skill", label: "Skill", render: (e: Enrollment) => e.skill?.title ?? e.skill_id },
    { key: "status", label: "Status", render: (e: Enrollment) => <EnrollmentStatusBadge status={e.status.toUpperCase() as any} /> },
    { key: "payment_status", label: "Payment", render: (e: Enrollment) => e.payment_status === 'paid' ? 'Paid' : e.payment_status === 'failed' ? 'Failed' : 'Pending' },
    { key: "created_at", label: "Enrolled On", render: (e: Enrollment) => new Date(e.created_at).toLocaleString() },
  ]

  return (
    <div className="space-y-4">
      <DataTable<Enrollment>
        data={rows}
        isLoading={false}
        error={null as any}
        columns={columns}
        emptyMessage="No enrollments found"
      />

      <div className="flex justify-between items-center">
        <div className="text-sm text-neutral-600">
          {total.toLocaleString()} total
        </div>
        <Pagination
          page={page}
          total={totalPages}
          onChange={(p) => setPage(p)}
          showControls
          size="sm"
        />
      </div>
    </div>
  )
}


