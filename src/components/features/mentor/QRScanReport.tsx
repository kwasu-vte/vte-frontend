"use client"
import React from "react"
import { Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { qrCodesApi } from "@/lib/api"
import type { AttendanceReport, QrScanHistory } from "@/lib/types"

export type QRScanReportProps = {
  qrToken: string
  groupId: number
  perPage?: number
}

export default function QRScanReport(props: QRScanReportProps) {
  const { qrToken, groupId, perPage = 25 } = props

  const { data: history, isLoading: loadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["qr-scan-history", qrToken, perPage],
    queryFn: async () => {
      const res = await qrCodesApi.getScanHistory(qrToken, perPage)
      return res?.data as QrScanHistory
    },
    refetchInterval: 5000,
  })

  const { data: report, isLoading: loadingReport, refetch: refetchReport } = useQuery({
    queryKey: ["group-attendance-report", groupId],
    queryFn: async () => {
      const res = await qrCodesApi.getAttendanceReport(groupId)
      return res?.data as AttendanceReport
    },
    refetchInterval: 10000,
  })

  const loading = loadingHistory || loadingReport

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    )
  }

  return (
    <Tabs aria-label="QR Scan Report" variant="underlined">
      <Tab key="history" title="History">
        <div className="flex justify-end mb-3">
          <Button size="sm" variant="ghost" onPress={() => refetchHistory()}>Refresh</Button>
        </div>
        <Table aria-label="QR scan history">
          <TableHeader>
            <TableColumn>Student</TableColumn>
            <TableColumn>Scanned At</TableColumn>
            <TableColumn>Points</TableColumn>
          </TableHeader>
          <TableBody emptyContent={<div className="text-sm text-neutral-500 py-6">No scans yet.</div>}>
            {(history?.scans ?? []).map((scan) => (
              <TableRow key={scan.id}>
                <TableCell>{scan.student.first_name} {scan.student.last_name}</TableCell>
                <TableCell>{new Date(scan.created_at).toLocaleString()}</TableCell>
                <TableCell>{(scan as any)?.points_awarded ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Tab>
      <Tab key="report" title="Report">
        <div className="flex justify-end mb-3">
          <Button size="sm" variant="ghost" onPress={() => refetchReport()}>Refresh</Button>
        </div>
        <Table aria-label="Group attendance report">
          <TableHeader>
            <TableColumn>Group</TableColumn>
            <TableColumn>Skill</TableColumn>
            <TableColumn>Total Enrolled</TableColumn>
            <TableColumn>Practical Date</TableColumn>
          </TableHeader>
          <TableBody>
            {report ? [
              (
                <TableRow key={report.group_info.id}>
                  <TableCell>#{report.group_info.group_number}</TableCell>
                  <TableCell>{report.group_info.skill_title}</TableCell>
                  <TableCell>{report.group_info.total_enrolled}</TableCell>
                  <TableCell>{report.group_info.practical_date ? new Date(report.group_info.practical_date).toLocaleDateString() : '—'}</TableCell>
                </TableRow>
              )
            ] : []}
          </TableBody>
        </Table>
      </Tab>
    </Tabs>
  )
}


