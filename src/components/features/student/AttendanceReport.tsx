"use client"
import React from "react"
import { Button, Chip } from "@nextui-org/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"

/**
 * * AttendanceReport
 * Tabular attendance report for a group with export options.
 *
 * Props:
 * - groupId: string
 * - dateRange: { start: string; end: string }
 * - attendanceData: Array<{ student: string; scans: number; points: number; percentage: number }>
 */
export type AttendanceReportProps = {
  groupId: string
  dateRange: { start: string; end: string }
  attendanceData: Array<{ student: string; scans: number; points: number; percentage: number }>
}

export default function AttendanceReport({ groupId, dateRange, attendanceData }: AttendanceReportProps) {
  const start = new Date(dateRange.start).toLocaleDateString()
  const end = new Date(dateRange.end).toLocaleDateString()

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Group</p>
          <p className="text-xl font-medium leading-normal">{groupId}</p>
          <p className="text-sm text-neutral-600">{start} – {end}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="bordered">Export CSV</Button>
          <Button variant="bordered">Export PDF</Button>
        </div>
      </div>

      <div className="w-full rounded-lg border border-neutral-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Scans</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Completion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <p className="text-sm text-neutral-600 text-center py-6">No attendance records found for the selected range.</p>
                </TableCell>
              </TableRow>
            ) : (
              attendanceData.map((row, idx) => (
                <TableRow key={`${row.student}-${idx}`}>
                  <TableCell>{row.student}</TableCell>
                  <TableCell className="text-right">{row.scans}</TableCell>
                  <TableCell className="text-right">{row.points}</TableCell>
                  <TableCell className="text-right">
                    <Chip color={row.percentage >= 75 ? "success" : row.percentage >= 50 ? "warning" : "danger"} variant="flat">
                      {row.percentage}%
                    </Chip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


