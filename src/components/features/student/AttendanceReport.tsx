"use client"
import React from "react"
import { Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { Download, Calendar } from "lucide-react"

/**
 * * AttendanceReport
 * Tabular attendance report for a group with export options.
 * Follows design guide with NextUI components and proper styling.
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

function AttendanceReport({ groupId, dateRange, attendanceData }: AttendanceReportProps) {
  const start = new Date(dateRange.start).toLocaleDateString()
  const end = new Date(dateRange.end).toLocaleDateString()

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xl font-medium leading-normal">Attendance Report</p>
            <p className="text-sm text-neutral-600">Group {groupId} • {start} – {end}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="bordered" 
            size="sm"
            startContent={<Download className="h-4 w-4" />}
          >
            Export CSV
          </Button>
          <Button 
            variant="bordered" 
            size="sm"
            startContent={<Download className="h-4 w-4" />}
          >
            Export PDF
          </Button>
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="p-0">
        <Table aria-label="Attendance report table">
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn className="text-right">SCANS</TableColumn>
            <TableColumn className="text-right">POINTS</TableColumn>
            <TableColumn className="text-right">COMPLETION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No attendance records found for the selected range.">
            {attendanceData.map((row, idx) => (
              <TableRow key={`${row.student}-${idx}`}>
                <TableCell>
                  <span className="font-medium text-neutral-900">{row.student}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-neutral-600">{row.scans}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-neutral-600">{row.points}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Chip 
                    color={row.percentage >= 75 ? "success" : row.percentage >= 50 ? "warning" : "danger"} 
                    variant="flat"
                    size="sm"
                  >
                    {row.percentage}%
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}

export { AttendanceReport }
export default AttendanceReport
