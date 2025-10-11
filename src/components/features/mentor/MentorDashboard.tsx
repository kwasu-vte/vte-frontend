"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Button, Skeleton, Tabs, Tab } from "@heroui/react"
import { useMentorDashboardData } from "@/lib/hooks/use-mentor-dashboard-data"
import MentorGroupsList from "@/components/features/mentor/MentorGroupsList"
import PracticalCalendar from "@/components/features/student/PracticalCalendar"
import { StateRenderer, DefaultLoadingComponent, DefaultEmptyComponent } from "@/components/shared/StateRenderer"
import { useQueryClient } from "@tanstack/react-query"

export type MentorDashboardProps = {
  userId: string
}

export default function MentorDashboard(props: MentorDashboardProps) {
  const { userId } = props
  const { profile, skills, groups, todaysGroups, attendanceReport, isLoading, error } = useMentorDashboardData(userId)
  const queryClient = useQueryClient()
  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['mentor-profile', userId] }),
      queryClient.invalidateQueries({ queryKey: ['mentor-assigned-skills', userId] }),
      queryClient.invalidateQueries({ queryKey: ['mentor-skill-groups', userId] }),
      queryClient.invalidateQueries({ queryKey: ['group-attendance-report'] }),
    ])
  }

  // Pick a primary group for right-panel reports (fallback logic)
  const primaryGroup = React.useMemo(() => (groups && groups.length > 0 ? groups[0] : null), [groups])

  // Today schedule: derive by group.next_practical_at (if present) or within skill date range (basic heuristic)
  const today = React.useMemo(() => new Date(), [])

  function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between" id="mentor-welcome">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mentor Dashboard</h1>
          <p className="text-neutral-600">Daily overview of your groups and attendance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            color="primary"
            variant="bordered"
            aria-label="Refresh dashboard data"
            isDisabled={isLoading}
            onPress={refetchAll}
          >
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Guidance */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm">
        Tip: Today’s Schedule shows upcoming practicals for your assigned groups. Use My Groups to view rosters and attendance summaries.
      </div>

      {/* No groups hint */}
      {!isLoading && !error && (Array.isArray(groups) && groups.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 text-sm">
          You have no groups assigned yet. Contact an administrator to assign you to a skill group.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: TodaySchedule + RecentScans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Schedule */}
          <Card shadow="sm" id="mentor-today-schedule">
            <CardHeader className="flex items-center justify-between px-4 pt-4">
              <div>
                <p className="text-base font-medium text-neutral-900">Today's Schedule</p>
                <p className="text-sm text-neutral-500">Derived from your assigned groups</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip variant="flat">{today.toLocaleDateString()}</Chip>
                <Chip size="sm" variant="flat">{(todaysGroups ?? []).length}</Chip>
              </div>
            </CardHeader>
            <CardBody className="px-4 pb-4">
              <StateRenderer
                data={todaysGroups}
                isLoading={isLoading}
                error={error}
                onRetry={refetchAll}
                loadingComponent={<DefaultLoadingComponent />}
                emptyComponent={<DefaultEmptyComponent message="No practicals scheduled for today." />}
              >
                {(data) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map((g) => (
                      <Card key={g.id} shadow="sm" className="transition-colors hover:bg-neutral-50">
                        <CardHeader className="flex items-center justify-between px-4 pt-4">
                          <div>
                            <p className="text-base font-medium text-neutral-900">{(g as any).group_display_name ?? `Group ${g.group_number ?? g.id}`}</p>
                            <p className="text-sm text-neutral-500">{g.skill?.title ?? "Unknown Skill"}</p>
                          </div>
                          <Chip size="sm" color="primary" variant="flat">#{g.group_number ?? g.id}</Chip>
                        </CardHeader>
                        <CardBody className="px-4 pb-4">
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

          {/* Attendance Summary */}
          <Card shadow="sm" id="mentor-workload">
            <CardHeader className="flex items-center justify-between px-4 pt-4">
              <p className="text-base font-medium text-neutral-900">Attendance Summary</p>
              {primaryGroup && <Chip variant="flat">Group #{primaryGroup.group_number ?? primaryGroup.id}</Chip>}
            </CardHeader>
            <CardBody className="px-4 pb-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 rounded-md" />
                  <Skeleton className="h-64 w-full rounded-md" />
                </div>
              ) : attendanceReport ? (
                <div>
                  <div className="text-sm text-neutral-600 mb-3">Attendance summary for your primary group.</div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card shadow="sm">
                      <CardHeader className="text-sm text-neutral-600 px-4 pt-4">Skill</CardHeader>
                      <CardBody className="text-base font-medium text-neutral-900 px-4 pb-4">{attendanceReport.group_info.skill_title}</CardBody>
                    </Card>
                    <Card shadow="sm">
                      <CardHeader className="text-sm text-neutral-600 px-4 pt-4">Total Enrolled</CardHeader>
                      <CardBody className="text-base font-medium text-neutral-900 px-4 pb-4">{attendanceReport.group_info.total_enrolled}</CardBody>
                    </Card>
                    <Card shadow="sm">
                      <CardHeader className="text-sm text-neutral-600 px-4 pt-4">Practical Date</CardHeader>
                      <CardBody className="text-base font-medium text-neutral-900 px-4 pb-4">{attendanceReport.group_info.practical_date ? new Date(attendanceReport.group_info.practical_date).toLocaleDateString() : "—"}</CardBody>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-neutral-500">No attendance report available.</div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right: Upcoming Calendar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Access (QR & Reports) */}
          <Card shadow="sm" id="mentor-qr-quick">
            <CardHeader className="px-4 pt-4">
              <p className="text-base font-medium text-neutral-900">Quick Access</p>
            </CardHeader>
            <CardBody className="px-4 pb-4">
              <div className="space-y-3">
                <Button as="a" href="/mentor/my-qr-codes" color="primary" className="w-full justify-start" aria-label="My QR Codes">
                  My QR Codes
                </Button>
                <Button as="a" href="/mentor/attendance/reports" variant="bordered" className="w-full justify-start" aria-label="Attendance Reports">
                  Attendance Reports
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Upcoming Calendar */}
          <Card shadow="sm" id="mentor-calendar">
            <CardHeader className="px-4 pt-4">
              <p className="text-base font-medium text-neutral-900">Upcoming Calendar</p>
            </CardHeader>
            <CardBody className="px-4 pb-4">
              <PracticalCalendar
                practicalDates={(groups ?? []).flatMap((g) =>
                  (g.practical_dates ?? []).map((d) => ({ date: d }))
                )}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* All Groups quick glance (optional summary) */}
      <Card shadow="sm" id="mentor-groups">
        <CardHeader className="px-4 pt-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-base font-medium text-neutral-900">My Groups</p>
            <Chip size="sm" variant="flat">{(groups ?? []).length}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <StateRenderer
            data={groups}
            isLoading={isLoading}
            error={error}
            onRetry={refetchAll}
            loadingComponent={<DefaultLoadingComponent />}
            emptyComponent={<DefaultEmptyComponent message="No groups assigned yet." />}
          >
            {(data) => (
              <div>
                <div id="mentor-reports" className="sr-only" aria-hidden="true" />
                <MentorGroupsList groups={data} viewMode="grid" />
              </div>
            )}
          </StateRenderer>
        </CardBody>
      </Card>
    </div>
  )
}
