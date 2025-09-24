"use client"
import React from "react"
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Skeleton, Chip, Avatar, Button } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { SkillGroup, User } from "@/lib/types"

/**
 * * GroupStudentsRoster
 * Detailed student list for a specific group with search/filter.
 *
 * Props:
 * - groupId: number (required when fetching)
 * - title?: string (optional title override)
 */
export type GroupStudentsRosterProps = {
  groupId: number
  title?: string
}

export default function GroupStudentsRoster(props: GroupStudentsRosterProps) {
  const { groupId, title } = props

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["group-details", groupId],
    queryFn: async () => {
      const res = await api.getSkillGroup(groupId)
      return res?.data as SkillGroup
    },
  })

  const [search, setSearch] = React.useState("")

  // * Loading state with table skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-48 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="border rounded-lg">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-4 border-b last:border-b-0">
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // * Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-neutral-50">
        <p className="text-base font-medium text-neutral-900 mb-2">Failed to load roster</p>
        <p className="text-sm text-neutral-500 mb-4">{(error as any)?.message ?? "Please try again."}</p>
        <Button color="primary" onPress={() => refetch()}>Retry</Button>
      </div>
    )
  }

  const students: User[] = (data?.students as any) ?? []

  const filtered = students.filter((s) => {
    const full = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim().toLowerCase()
    const matric = (s.matric_number ?? "").toLowerCase()
    const q = search.trim().toLowerCase()
    if (!q) return true
    return full.includes(q) || matric.includes(q)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-medium text-neutral-900">{title ?? data?.group_display_name ?? `Group ${data?.group_number ?? groupId}`}</p>
          <p className="text-sm text-neutral-500">{data?.skill?.title ?? ""}</p>
        </div>
        <Chip variant="flat" color={data?.is_full ? "danger" : "success"}>
          {filtered.length} / {Number(data?.max_student_capacity ?? 0)}
        </Chip>
      </div>

      <Input
        aria-label="Search students"
        placeholder="Search by name or matric number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xl"
      />

      <Table aria-label="Group students roster">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Matric</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-sm text-neutral-500 py-6">No students found.</div>
          }
        >
          {filtered.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={`${s.first_name} ${s.last_name}`} size="sm" />
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{s.first_name} {s.last_name}</div>
                    <div className="text-xs text-neutral-500">{s.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-neutral-900">{s.matric_number ?? "—"}</span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="ghost">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


