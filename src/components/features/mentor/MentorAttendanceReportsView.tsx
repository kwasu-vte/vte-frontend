"use client"
import React from "react"
import { Card, CardHeader, CardBody, Select, SelectItem, Input, Button, Chip, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { mentorsApi, qrCodesApi } from "@/lib/api"
import type { SkillGroup, AttendanceReport } from "@/lib/types"
import AttendanceReportComp from "@/components/features/student/AttendanceReport"
import { DefaultEmptyComponent, DefaultLoadingComponent } from "@/components/shared/StateRenderer"

export default function MentorAttendanceReportsView(props: { userId: string }) {
  const { userId } = props

  const { data: groups, isLoading: loadingGroups } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      const res = await mentorsApi.getSkillGroups(userId)
      return (res?.data ?? []) as SkillGroup[]
    },
    enabled: !!userId,
  })

  const [groupId, setGroupId] = React.useState<number | null>(null)
  const [from, setFrom] = React.useState<string>("")
  const [to, setTo] = React.useState<string>("")
  const [submitted, setSubmitted] = React.useState(false)

  React.useEffect(() => {
    if (!groupId && groups && groups.length > 0) setGroupId(Number(groups[0].id))
  }, [groups, groupId])

  // Backend API provides group-level report; date filter not implemented server-side yet, so client filters are informational
  const { data: report, isLoading: loadingReport, refetch } = useQuery({
    queryKey: ["group-attendance-report", groupId],
    queryFn: async () => {
      if (!groupId) return null as AttendanceReport | null
      const res = await qrCodesApi.getGroupAttendanceReport(groupId)
      return (res?.data ?? null) as AttendanceReport | null
    },
    enabled: !!groupId && submitted,
    refetchInterval: 0,
  })

  const onGenerate = () => {
    setSubmitted(true)
    refetch()
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card shadow="sm" className="p-4">
        <CardHeader className="text-base font-medium text-neutral-900">Controls</CardHeader>
        <CardBody className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            {loadingGroups ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : groups && groups.length > 0 ? (
              <Select
                aria-label="Select group"
                selectedKeys={groupId ? new Set([String(groupId)]) : new Set([])}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys as Set<string>)[0]
                  setGroupId(key ? Number(key) : null)
                }}
              >
                {groups.map((g) => (
                  <SelectItem key={String(g.id)} value={String(g.id)}>
                    {g.group_display_name ?? `Group ${g.group_number ?? g.id}`} — {g.skill?.title}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <DefaultEmptyComponent message="No groups" />
            )}
          </div>
          <Input type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} />
          <div className="md:col-span-4">
            <Button color="primary" onPress={onGenerate} isDisabled={!groupId}>Generate</Button>
          </div>
        </CardBody>
      </Card>

      <Card shadow="sm" className="p-4">
        <CardHeader className="flex items-center justify-between">
          <div className="text-base font-medium text-neutral-900">Report</div>
          {groupId && <Chip variant="flat">Group #{groupId}</Chip>}
        </CardHeader>
        <CardBody>
          {!submitted ? (
            <div className="text-sm text-neutral-500">Choose a group and date range, then click Generate.</div>
          ) : loadingReport ? (
            <DefaultLoadingComponent />
          ) : !report ? (
            <DefaultEmptyComponent message="No report data." />
          ) : (
            <AttendanceReportComp
              groupId={String(report.group_info.id)}
              dateRange={{
                start: from || report.group_info.practical_date || new Date().toISOString(),
                end: to || report.group_info.practical_date || new Date().toISOString(),
              }}
              attendanceData={(report.students || []).map((student) => ({
                student: student.full_name,
                scans: student.total_attendance,
                points: student.total_points,
                percentage: 0,
              }))}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
