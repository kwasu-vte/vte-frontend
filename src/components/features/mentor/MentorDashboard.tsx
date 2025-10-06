"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Button, Skeleton, Tabs, Tab } from "@nextui-org/react"
import { useMentorDashboardData } from "@/lib/hooks/use-mentor-dashboard-data"
import MentorGroupsList from "@/components/features/mentor/MentorGroupsList"
import PracticalCalendar from "@/components/features/student/PracticalCalendar"
import { StateRenderer, DefaultLoadingComponent, DefaultEmptyComponent } from "@/components/shared/StateRenderer"
import { StartTourButton } from "@/components/shared/StartTourButton"

export type MentorDashboardProps = {
  userId: string
}

export default function MentorDashboard(props: MentorDashboardProps) {
  const { userId } = props
  const { profile, skills, groups, todaysGroups, attendanceReport, isLoading, error } = useMentorDashboardData(userId)

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
          <StartTourButton tour="mentor-dashboard" label="Start Tour" />
          <Button color="primary" variant="bordered" onPress={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: TodaySchedule + RecentScans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Schedule */}
          <Card shadow="sm" className="p-4" id="mentor-today-schedule">
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-neutral-900">Today&apos;s Schedule</p>
                <p className="text-sm text-neutral-500">Derived from your assigned groups</p>
              </div>
              <Chip variant="flat">{today.toLocaleDateString()}</Chip>
            </CardHeader>
            <CardBody>
              <StateRenderer
                data={todaysGroups}
                isLoading={isLoading}
                error={error}
                onRetry={() => window.location.reload()}
                loadingComponent={<DefaultLoadingComponent />}
                emptyComponent={<DefaultEmptyComponent message="No practicals scheduled for today." />}
              >
                {(data) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map((g) => (
                      <Card key={g.id} shadow="sm" className="p-4">
                        <CardHeader className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-medium text-neutral-900">{(g as any).group_display_name ?? `Group ${g.group_number ?? g.id}`}</p>
                            <p className="text-sm text-neutral-500">{g.skill?.title ?? "Unknown Skill"}</p>
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

          {/* Attendance Summary */}
          <Card shadow="sm" className="p-4" id="mentor-attendance-summary">
            <CardHeader className="flex items-center justify-between">
              <p className="text-base font-medium text-neutral-900">Attendance Summary</p>
              {primaryGroup && <Chip variant="flat">Group #{primaryGroup.group_number ?? primaryGroup.id}</Chip>}
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 rounded-md" />
                  <Skeleton className="h-64 w-full rounded-md" />
                </div>
              ) : attendanceReport ? (
                <Tabs aria-label="Attendance Summary" variant="underlined">
                  <Tab key="report" title="Report">
                    <div className="text-sm text-neutral-600 mb-3">Attendance summary for your primary group.</div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card shadow="sm" className="p-4">
                        <CardHeader className="text-sm text-neutral-600">Skill</CardHeader>
                        <CardBody className="text-base font-medium text-neutral-900">{attendanceReport.group_info.skill_title}</CardBody>
                      </Card>
                      <Card shadow="sm" className="p-4">
                        <CardHeader className="text-sm text-neutral-600">Total Enrolled</CardHeader>
                        <CardBody className="text-base font-medium text-neutral-900">{attendanceReport.group_info.total_enrolled}</CardBody>
                      </Card>
                      <Card shadow="sm" className="p-4">
                        <CardHeader className="text-sm text-neutral-600">Practical Date</CardHeader>
                        <CardBody className="text-base font-medium text-neutral-900">{attendanceReport.group_info.practical_date ? new Date(attendanceReport.group_info.practical_date).toLocaleDateString() : "—"}</CardBody>
                      </Card>
                    </div>
                  </Tab>
                </Tabs>
              ) : (
                <div className="text-sm text-neutral-500">No attendance report available.</div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right: Upcoming Calendar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upcoming Calendar */}
          <Card shadow="sm" className="p-4">
            <CardHeader>
              <p className="text-base font-medium text-neutral-900">Upcoming Calendar</p>
            </CardHeader>
            <CardBody>
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
      <Card shadow="sm" className="p-4">
        <CardHeader>
          <p className="text-base font-medium text-neutral-900">My Groups</p>
        </CardHeader>
        <CardBody>
          <StateRenderer
            data={groups}
            isLoading={isLoading}
            error={error}
            onRetry={() => window.location.reload()}
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
