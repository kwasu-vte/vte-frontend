"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Button, Skeleton, Tabs, Tab } from "@nextui-org/react"
import { useQuery, useQueries } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { SkillGroup, PaginatedResponse, GroupQrCode, AttendanceReport } from "@/lib/types"
import MentorGroupsList from "@/components/features/mentor/MentorGroupsList"
import MyQRCodesDisplay from "@/components/features/mentor/MyQRCodesDisplay"
import QRScanReport from "@/components/features/mentor/QRScanReport"
import PracticalCalendar from "@/components/features/student/PracticalCalendar"
import { StateRenderer, DefaultLoadingComponent, DefaultEmptyComponent } from "@/components/shared/StateRenderer"

export type MentorDashboardProps = {
  userId: string
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function MentorDashboard(props: MentorDashboardProps) {
  const { userId } = props

  // * Fetch mentor groups
  const { data: groups, isLoading: loadingGroups, isError: groupsError, refetch: refetchGroups } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      const res = await api.getMentorSkillGroups(userId)
      return (res?.data ?? []) as SkillGroup[]
    },
    enabled: !!userId,
  })

  // * Pick a primary group for right-panel reports (fallback logic)
  const primaryGroup = React.useMemo(() => (groups && groups.length > 0 ? groups[0] : null), [groups])

  // * Today schedule: derive by group.next_practical_at (if present) or within skill date range (basic heuristic)
  const today = React.useMemo(() => new Date(), [])
  const todaysGroups = React.useMemo(() => {
    if (!groups || groups.length === 0) return [] as SkillGroup[]
    const withNextToday = groups.filter((g) => (g as any)?.next_practical_at && isSameDay(new Date((g as any).next_practical_at), today))
    return withNextToday
  }, [groups, today])

  // * Fetch active QR codes per group (limit to first 3 groups to avoid overfetching)
  const qrGroups = React.useMemo(() => (groups ?? []).slice(0, 3), [groups])
  const qrQueries = useQueries({
    queries: qrGroups.map((g) => ({
      queryKey: ["group-qr-codes", g.id, "active"],
      queryFn: async () => {
        const res = await api.listGroupQrCodes(g.id, { status: "active", per_page: 20 })
        return { groupId: g.id, data: (res?.data as PaginatedResponse<GroupQrCode>) ?? null }
      },
      enabled: !!g?.id,
    })),
  })

  // * Select a recent active token (first available) for QR scan history; else fallback to group report
  const selectedActiveToken = React.useMemo(() => {
    for (const q of qrQueries) {
      const items = (q.data?.data as PaginatedResponse<GroupQrCode> | undefined)?.results ?? []
      if (items.length > 0) {
        // prefer token expiring today
        const todayToken = items.find((c) => c.expires_at && isSameDay(new Date(c.expires_at), today))
        return (todayToken ?? items[0])?.token
      }
    }
    return null
  }, [qrQueries, today])

  // * Fallback group attendance report if no token
  const { data: fallbackReport, isLoading: loadingReport } = useQuery({
    queryKey: ["group-attendance-report", primaryGroup?.id],
    queryFn: async () => {
      if (!primaryGroup?.id) return null as AttendanceReport | null
      const res = await api.getGroupAttendanceReport(primaryGroup.id)
      return (res?.data ?? null) as AttendanceReport | null
    },
    enabled: !!primaryGroup?.id && !selectedActiveToken,
    refetchInterval: 10000,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mentor Dashboard</h1>
          <p className="text-neutral-600">Daily overview of your groups, QR codes, and recent scans.</p>
        </div>
        <Button color="primary" variant="bordered" onPress={() => refetchGroups()}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: TodaySchedule + RecentScans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Schedule */}
          <Card shadow="sm" className="p-4">
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-neutral-900">Today&apos;s Schedule</p>
                <p className="text-sm text-neutral-500">Derived from your assigned groups</p>
              </div>
              <Chip variant="flat">{today.toLocaleDateString()}</Chip>
            </CardHeader>
            <CardBody>
              <StateRenderer
                data={todaysGroups as SkillGroup[]}
                isLoading={loadingGroups}
                error={groupsError ? new Error("Failed to load groups") : null}
                loadingComponent={<DefaultLoadingComponent />}
                emptyComponent={<DefaultEmptyComponent message="No practicals scheduled for today." />}
              >
                {(data) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map((g) => (
                      <Card key={g.id} shadow="sm" className="p-4">
                        <CardHeader className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-medium text-neutral-900">{g.name ?? `Group ${g.group_number ?? g.id}`}</p>
                            <p className="text-sm text-neutral-500">{g.skill?.name ?? "Unknown Skill"}</p>
                          </div>
                          <Chip size="sm" color="primary" variant="flat">#{g.group_number ?? g.id}</Chip>
                        </CardHeader>
                        <CardBody>
                          <p className="text-sm text-neutral-600">Next practical</p>
                          <p className="text-sm font-medium text-neutral-900">{(g as any)?.next_practical_at ? new Date((g as any).next_practical_at as string).toLocaleString() : "—"}</p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </StateRenderer>
            </CardBody>
          </Card>

          {/* Recent Scans */}
          <Card shadow="sm" className="p-4">
            <CardHeader className="flex items-center justify-between">
              <p className="text-base font-medium text-neutral-900">Recent Scans</p>
              {primaryGroup && <Chip variant="flat">Group #{primaryGroup.group_number ?? primaryGroup.id}</Chip>}
            </CardHeader>
            <CardBody>
              {selectedActiveToken && primaryGroup ? (
                <QRScanReport qrToken={selectedActiveToken} groupId={primaryGroup.id} perPage={10} />
              ) : loadingReport ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 rounded-md" />
                  <Skeleton className="h-64 w-full rounded-md" />
                </div>
              ) : fallbackReport ? (
                <Tabs aria-label="Attendance Summary" variant="underlined">
                  <Tab key="report" title="Report">
                    <div className="text-sm text-neutral-600 mb-3">Attendance summary for your primary group.</div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card shadow="sm" className="p-4">
                        <CardHeader className="text-sm text-neutral-600">Skill</CardHeader>
                        <CardBody className="text-base font-medium text-neutral-900">{fallbackReport.group_info.skill_title}</CardBody>
                      </Card>
                      <Card shadow="sm" className="p-4">
                        <CardHeader className="text-sm text-neutral-600">Total Enrolled</CardHeader>
                        <CardBody className="text-base font-medium text-neutral-900">{fallbackReport.group_info.total_enrolled}</CardBody>
                      </Card>
                      <Card shadow="sm" className="p-4">
                        <CardHeader className="text-sm text-neutral-600">Practical Date</CardHeader>
                        <CardBody className="text-base font-medium text-neutral-900">{fallbackReport.group_info.practical_date ? new Date(fallbackReport.group_info.practical_date).toLocaleDateString() : "—"}</CardBody>
                      </Card>
                    </div>
                  </Tab>
                </Tabs>
              ) : (
                <div className="text-sm text-neutral-500">No scan history or report available.</div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right: QR Quick Access + Upcoming Calendar */}
        <div className="lg:col-span-1 space-y-6">
          {/* QR Quick Access */}
          <Card shadow="sm" className="p-4">
            <CardHeader className="flex items-center justify-between">
              <p className="text-base font-medium text-neutral-900">QR Quick Access</p>
              <Chip variant="flat">Active</Chip>
            </CardHeader>
            <CardBody>
              {loadingGroups ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-md" />
                  ))}
                </div>
              ) : qrGroups.length === 0 ? (
                <DefaultEmptyComponent message="No groups available for QR codes." />
              ) : (
                <div className="space-y-4">
                  {qrGroups.map((g) => (
                    <div key={g.id} className="border rounded-md p-3 bg-neutral-50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-neutral-900">Group #{g.group_number ?? g.id}</p>
                        <Chip size="sm" variant="flat">{g.skill?.name ?? "Skill"}</Chip>
                      </div>
                      {/* Reuse existing display component scoped by group */}
                      <MyQRCodesDisplay groupId={g.id} />
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Upcoming Calendar */}
          <Card shadow="sm" className="p-4">
            <CardHeader>
              <p className="text-base font-medium text-neutral-900">Upcoming Calendar</p>
            </CardHeader>
            <CardBody>
              <PracticalCalendar />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* All Groups quick glance (optional summary) */}
      <Card shadow="sm" className="p-4">
        <CardHeader>
          <p className="text-base font-medium text-neutral-900">My Groups</p>
        </CardHeader>
        <CardBody>
          <StateRenderer
            data={groups as SkillGroup[]}
            isLoading={loadingGroups}
            error={groupsError ? new Error("Failed to load groups") : null}
            loadingComponent={<DefaultLoadingComponent />}
            emptyComponent={<DefaultEmptyComponent message="No groups assigned yet." />}
          >
            {(data) => <MentorGroupsList groups={data} viewMode="grid" />}
          </StateRenderer>
        </CardBody>
      </Card>
    </div>
  )
}
