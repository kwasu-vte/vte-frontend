"use client"
import React from "react"
import { useMemo, useState } from "react"
import { Button, Card, CardBody, CardHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"

/**
 * * MentorQRAssignment
 * Assign generated QR codes to specific mentors.
 * TODO: Implement selection UI for mentor, list their groups, show needed QR counts, and assign action.
 *
 * Props:
 * - mentor: { id: string; name: string }
 * - groups: Array<{ id: string; name: string }>
 * - qrCodes: Array<{ id: string; token: string; date: string; groupId: string }>
 * - onAssign: (assignments: any) => void // TODO: Replace any with concrete type
 */
export type MentorQRAssignmentProps = {
  mentor: { id: string; name: string }
  groups: Array<{ id: string; name: string }>
  qrCodes: Array<{ id: string; token: string; date: string; groupId: string }>
  onAssign: (assignments: unknown) => void
}

export default function MentorQRAssignment(props: MentorQRAssignmentProps) {
  const { mentor, groups, qrCodes, onAssign } = props
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id ? String(groups[0].id) : "")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const groupOptions = useMemo(() => groups.map((g) => ({ id: String(g.id), name: g.name })), [groups])

  const filteredCodes = useMemo(
    () => qrCodes.filter((q) => (selectedGroupId ? String(q.groupId) === String(selectedGroupId) : true)),
    [qrCodes, selectedGroupId]
  )

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function assign() {
    const assignments = Array.from(selectedIds).map((id) => ({ mentorId: mentor.id, qrCodeId: id }))
    onAssign(assignments)
    setSelectedIds(new Set())
  }

  return (
    <Card shadow="sm">
      <CardHeader className="flex items-center justify-between">
        <p className="text-sm font-medium">Assign QR Codes to {mentor.name}</p>
        <div className="flex items-center gap-2">
          <Select size="sm" selectedKeys={selectedGroupId ? [selectedGroupId] : []} onChange={(e) => setSelectedGroupId(e.target.value)}>
            {groupOptions.map((g) => (
              <SelectItem key={g.id}>{g.name}</SelectItem>
            ))}
          </Select>
          <Button color="primary" isDisabled={selectedIds.size === 0} onPress={assign}>
            Assign Selected ({selectedIds.size})
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Table aria-label="QR codes available for assignment">
          <TableHeader>
            <TableColumn>Token</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Group</TableColumn>
            <TableColumn className="w-[120px]">Select</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredCodes.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-mono text-xs">{q.token}</TableCell>
                <TableCell>{q.date || "-"}</TableCell>
                <TableCell>{groups.find((g) => String(g.id) === String(q.groupId))?.name || "-"}</TableCell>
                <TableCell>
                  <Button size="sm" variant={selectedIds.has(q.id) ? "solid" : "bordered"} onPress={() => toggle(q.id)}>
                    {selectedIds.has(q.id) ? "Selected" : "Select"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}


