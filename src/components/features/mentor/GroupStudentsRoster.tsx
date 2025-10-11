"use client"
import React from "react"
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar, Button } from "@heroui/react"
import type { SkillGroup, User } from "@/lib/types"

/**
 * * GroupStudentsRoster
 * Detailed student list for a specific group with search/filter.
 *
 * Props:
 * - group: SkillGroup (required group data)
 * - title?: string (optional title override)
 */
export type GroupStudentsRosterProps = {
  group: SkillGroup
  title?: string
}

export default function GroupStudentsRoster(props: GroupStudentsRosterProps) {
  const { group, title } = props

  // * Extract students from enrollments
  const students = React.useMemo(() => {
    return group.enrollments?.map(enrollment => enrollment.user).filter(Boolean) as User[] || []
  }, [group.enrollments])

  const [search, setSearch] = React.useState("")

  // * Filter students based on search
  const filteredStudents = React.useMemo(() => {
    if (!search.trim()) return students
    const q = search.trim().toLowerCase()
    return students.filter(student => 
      student.name?.toLowerCase().includes(q) ||
      student.email?.toLowerCase().includes(q) ||
      student.phone?.toLowerCase().includes(q)
    )
  }, [students, search])

  // * No loading state needed since we have the data


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-medium text-neutral-900">{title ?? group.group_display_name ?? `Group ${group.group_number ?? group.id}`}</p>
          <p className="text-sm text-neutral-500">{group.skill?.title ?? ""}</p>
        </div>
        <Chip variant="flat" color={students.length >= Number(group.max_student_capacity ?? 0) ? "danger" : "success"}>
          {filteredStudents.length} / {Number(group.max_student_capacity ?? 0)}
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
          {filteredStudents.map((s) => (
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


