"use client"
import React from "react"
import { Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, CardHeader, Divider } from "@heroui/react"
import { Download, Calendar, FileSpreadsheet, FileText, FilePdf } from "lucide-react"
import * as XLSX from 'xlsx'

/**
 * * AttendanceReport
 * Tabular attendance report for a group with export options.
 * Improved UI with better visual hierarchy and cleaner export controls.
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
  const start = new Date(dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const end = new Date(dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // * Export attendance data to Excel
  const exportToExcel = () => {
    const excelData = attendanceData.map((row, index) => ({
      'S/N': index + 1,
      'Student Name': row.student,
      'Total Scans': row.scans,
      'Points Earned': row.points,
      'Completion %': `${row.percentage}%`,
      'Status': row.percentage >= 75 ? 'Excellent' : row.percentage >= 50 ? 'Good' : 'Needs Improvement'
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    ws['!cols'] = [
      { wch: 5 },   // S/N
      { wch: 25 },  // Student Name
      { wch: 12 },  // Total Scans
      { wch: 15 },  // Points Earned
      { wch: 15 },  // Completion %
      { wch: 20 }   // Status
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report')

    const startDate = new Date(dateRange.start).toLocaleDateString('en-GB').replace(/\//g, '-')
    const endDate = new Date(dateRange.end).toLocaleDateString('en-GB').replace(/\//g, '-')
    const filename = `Attendance_Report_Group_${groupId}_${startDate}_to_${endDate}.xlsx`

    XLSX.writeFile(wb, filename)
  }

  // * Export to CSV
  const exportToCSV = () => {
    const csvData = attendanceData.map((row, index) => ({
      'S/N': index + 1,
      'Student Name': row.student,
      'Total Scans': row.scans,
      'Points Earned': row.points,
      'Completion %': `${row.percentage}%`,
      'Status': row.percentage >= 75 ? 'Excellent' : row.percentage >= 50 ? 'Good' : 'Needs Improvement'
    }))

    const headers = Object.keys(csvData[0])
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const startDate = new Date(dateRange.start).toLocaleDateString('en-GB').replace(/\//g, '-')
    const endDate = new Date(dateRange.end).toLocaleDateString('en-GB').replace(/\//g, '-')
    
    link.setAttribute('href', url)
    link.setAttribute('download', `Attendance_Report_Group_${groupId}_${startDate}_to_${endDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate summary stats
  const totalStudents = attendanceData.length
  const avgCompletion = totalStudents > 0 
    ? Math.round(attendanceData.reduce((sum, row) => sum + row.percentage, 0) / totalStudents)
    : 0
  const excellentCount = attendanceData.filter(row => row.percentage >= 75).length

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex-col items-start gap-3 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Attendance Report</h2>
              <p className="text-sm text-neutral-600">Group {groupId} • {start} – {end}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-4 w-full pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Total Students:</span>
            <Chip size="sm" variant="flat" color="primary">{totalStudents}</Chip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Avg Completion:</span>
            <Chip size="sm" variant="flat" color={avgCompletion >= 75 ? "success" : avgCompletion >= 50 ? "warning" : "danger"}>
              {avgCompletion}%
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Excellent:</span>
            <Chip size="sm" variant="flat" color="success">{excellentCount}</Chip>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 w-full pt-2">
          <Button 
            variant="flat" 
            size="sm"
            color="primary"
            startContent={<FileSpreadsheet className="h-4 w-4" />}
            onPress={exportToExcel}
          >
            Excel
          </Button>
          <Button 
            variant="flat" 
            size="sm"
            color="default"
            startContent={<FileText className="h-4 w-4" />}
            onPress={exportToCSV}
          >
            CSV
          </Button>
          <Button 
            variant="flat" 
            size="sm"
            color="default"
            startContent={<FilePdf className="h-4 w-4" />}
            isDisabled
          >
            PDF
          </Button>
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="p-0">
        <Table 
          aria-label="Attendance report table"
          removeWrapper
        >
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn className="text-center">SCANS</TableColumn>
            <TableColumn className="text-center">POINTS</TableColumn>
            <TableColumn className="text-center">COMPLETION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No attendance records found for the selected range.">
            {attendanceData.map((row, idx) => (
              <TableRow key={`${row.student}-${idx}`}>
                <TableCell>
                  <span className="font-medium text-neutral-900">{row.student}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-neutral-600">{row.scans}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-neutral-600">{row.points}</span>
                </TableCell>
                <TableCell className="text-center">
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