"use client"
import React from "react"
import { useMemo, useState } from "react"
import { Button, Card, CardBody, CardHeader, Chip, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { useClientQuery } from "@/lib/hooks/useClientQuery"
import { api } from "@/lib/api"

/**
 * * GroupStudentsList
 * Expandable list of students in a group with management actions.
 * TODO: Implement collapsible list, remove action, and profile view trigger.
 *
 * Props:
 * - groupId: string | number
 * - students: Array<{ id: string; matric: string; name: string; status: string }>
 * - canManage: boolean
 * - onRemoveStudent?: (studentId: string) => void
 */
export type GroupStudentsListProps = {
  groupId: string | number
  students: Array<{ id: string; matric: string; name: string; status: string }>
  canManage: boolean
  onRemoveStudent?: (studentId: string) => void
}

export default function GroupStudentsList(props: GroupStudentsListProps) {
  const { groupId, students, canManage, onRemoveStudent } = props
  const [query, setQuery] = useState("")

  // * If parent did not pass students, fetch via enrollments and filter by groupId when possible
  const shouldFetch = !students || students.length === 0
  const { data, isLoading, isError } = useClientQuery({
    queryKey: ["group-students", groupId],
    queryFn: async () => {
      const res = await api.getAllEnrollments({ per_page: 1000 })
      return res.data
    },
    enabled: shouldFetch,
  })

  const list = useMemo(() => {
    const base = shouldFetch
      ? (data?.results || [])
          .filter((e: any) => String(e.group?.id ?? e.skill_group_id) === String(groupId))
          .map((e: any) => ({
            id: String(e.student?.id || e.student_id),
            matric: e.student?.matric_number || e.student?.matric || e.student?.matric_no || "",
            name: e.student?.full_name || `${e.student?.last_name ?? ''} ${e.student?.first_name ?? ''}`.trim(),
            status: e.status || "unknown",
          }))
      : students

    if (!query) return base
    const q = query.toLowerCase()
    return base.filter((s) =>
      s.name.toLowerCase().includes(q) || s.matric.toLowerCase().includes(q)
    )
  }, [shouldFetch, data, students, groupId, query])

  return (
    <Card shadow="sm">
      <CardHeader className="flex items-center justify-between">
        <p className="text-sm font-medium">Group Students</p>
        <Input
          size="sm"
          placeholder="Search by name or matric"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-60"
        />
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner label="Loading students..." />
          </div>
        ) : isError ? (
          <div className="py-6 text-sm text-red-500">Failed to load students.</div>
        ) : list.length === 0 ? (
          <div className="py-6 text-sm text-neutral-500">No students found.</div>
        ) : (
          <Table aria-label="Group students list">
            <TableHeader>
              <TableColumn>Matric</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn className="w-[120px]">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {list.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.matric || "-"}</TableCell>
                  <TableCell>{s.name || "-"}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={s.status === "active" ? "success" : s.status === "pending" ? "warning" : "default"}>
                      {s.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {canManage ? (
                      <div className="flex gap-2">
                        <Tooltip content="View profile">
                          <Button size="sm" variant="ghost">View</Button>
                        </Tooltip>
                        {onRemoveStudent && (
                          <Tooltip content="Remove from group">
                            <Button size="sm" color="danger" variant="bordered" onPress={() => onRemoveStudent(s.id)}>
                              Remove
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  )
}


