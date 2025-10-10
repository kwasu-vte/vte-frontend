"use client"
import React, { useMemo } from "react"
import { Button, Chip } from "@heroui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { academicSessionsApi } from "@/lib/api"
import type { AcademicSession } from "@/lib/types"
import { DataTable } from "@/components/shared/DataTable"
import SessionStatusBadge from "./SessionStatusBadge"

/**
 * * SessionsTable
 * Displays all academic sessions in a table with status badges and actions.
 *
 * Props (all optional):
 * - onEdit: (session: AcademicSession) => void
 */
export type SessionsTableProps = {
  onEdit?: (session: AcademicSession) => void
}

export default function SessionsTable({ onEdit }: SessionsTableProps) {
  // * Fetch sessions
  const { data, isLoading, error } = useQuery({
    queryKey: ["academic-sessions", "list"],
    queryFn: async () => {
      const res = await academicSessionsApi.getAll()
      return res.data
    },
  })

  const queryClient = useQueryClient()

  // * Mutations: start/end session
  const startMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await academicSessionsApi.start(id)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions", "list"] })
    },
  })

  const endMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await academicSessionsApi.end(id)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions", "list"] })
    },
  })

  const columns = useMemo(() => [
    { key: "name", label: "Name" },
    { key: "starts_at", label: "Start Date", render: (s: AcademicSession) => <span>{s.starts_at ? new Date(s.starts_at).toLocaleDateString() : "—"}</span> },
    { key: "ends_at", label: "End Date", render: (s: AcademicSession) => <span>{s.ends_at ? new Date(s.ends_at).toLocaleDateString() : "—"}</span> },
    { key: "status", label: "Status", render: (s: AcademicSession) => <SessionStatusBadge session={s} /> },
    { key: "actions", label: "Actions", render: (s: AcademicSession) => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          color="primary"
          variant="bordered"
          isDisabled={!!s.active || startMutation.isPending}
          isLoading={startMutation.isPending}
          onPress={() => startMutation.mutate(s.id)}
        >
          Start
        </Button>
        <Button
          size="sm"
          color="warning"
          variant="bordered"
          isDisabled={!s.active || endMutation.isPending}
          isLoading={endMutation.isPending}
          onPress={() => endMutation.mutate(s.id)}
        >
          End
        </Button>
        {onEdit && (
          <Button size="sm" variant="ghost" onPress={() => onEdit(s)}>Edit</Button>
        )}
      </div>
    ) },
  ], [endMutation, onEdit, startMutation])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Academic Sessions</h2>
        {data?.some((s) => s.active) && (
          <Chip color="success" variant="flat">Active session running</Chip>
        )}
      </div>
      <DataTable<AcademicSession>
        data={data}
        isLoading={isLoading}
        error={error as Error | null}
        columns={columns}
        emptyMessage="No academic sessions yet"
      />
    </div>
  )
}


