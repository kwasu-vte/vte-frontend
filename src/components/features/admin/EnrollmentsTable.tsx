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
    { key: "student", label: "Student", render: (e: Enrollment) => {
      const apiStudent = (e as any)?.student
      const user = (e as any)?.user
      const first = apiStudent?.first_name ?? user?.first_name
      const last = apiStudent?.last_name ?? user?.last_name
      const full = `${last ?? ''} ${first ?? ''}`.trim()
      return full || e.user_id
    }},
    { key: "skill", label: "Skill", render: (e: Enrollment) => e.skill?.title ?? e.skill_id },
    { key: "status", label: "Status", render: (e: Enrollment) => <EnrollmentStatusBadge status={e.status.toUpperCase() as any} /> },
    { key: "payment_status", label: "Payment", render: (e: Enrollment) => {
      const ref = (e as any)?.reference
      const status = String(e.status || '').toLowerCase()
      const paid = e.payment_status === 'paid' || (!!ref && (status === 'assigned' || status === 'paid'))
      return (
        <div className="flex items-center gap-2">
          <span>
            {paid ? 'Paid' : e.payment_status === 'failed' ? 'Failed' : 'Pending'}
          </span>
          {ref && (
            <span className="text-[11px] text-neutral-500 border border-neutral-200 rounded px-1 py-0.5" title={`Reference: ${ref}`}>
              {String(ref).slice(-6)}
            </span>
          )}
        </div>
      )
    }},
    { key: "created_at", label: "Enrolled On", render: (e: Enrollment) => new Date(e.created_at).toLocaleString() },
    ...(onAssignGroup ? [{ key: "actions", label: "Actions", render: (e: Enrollment) => {
      const alreadyAssigned = Boolean(e.group?.id) || String(e.status).toLowerCase() === 'assigned'
      if (alreadyAssigned) {
        return <span className="text-neutral-400 text-sm cursor-not-allowed">Assigned</span>
      }
      return (
        <button
          className="text-primary hover:underline text-sm"
          onClick={() => onAssignGroup?.(Number(e.id))}
        >
          Assign to Group
        </button>
      )
    } }] : [] as any),
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


