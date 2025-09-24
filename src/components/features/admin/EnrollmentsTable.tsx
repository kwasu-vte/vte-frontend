"use client"
import React from "react"
import { Pagination } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { enrollmentsApi } from "@/src/lib/api"
import type { Enrollment, PaginatedResponse, ApiResponse } from "@/src/lib/types"
import EnrollmentStatusBadge from "./EnrollmentStatusBadge"
import { DataTable } from "@/src/components/shared/DataTable"

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
  filters: Record<string, unknown>
  perPage?: number
  onAssignGroup?: (enrollmentId: number) => void
}

export default function EnrollmentsTable({ filters, perPage = 25, onAssignGroup }: EnrollmentsTableProps) {
  const [page, setPage] = React.useState(1)

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<PaginatedResponse<Enrollment>>>({
    queryKey: ["enrollments", filters, perPage, page],
    queryFn: () => enrollmentsApi.getAll({
      academic_session_id: filters.academic_session_id as number | undefined,
      skill_id: filters.skill_id as string | undefined,
      per_page: perPage,
    }),
  })

  const rows = data?.data.results || []
  const total = data?.data.count || 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))

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
        isLoading={isLoading}
        error={error as any}
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


