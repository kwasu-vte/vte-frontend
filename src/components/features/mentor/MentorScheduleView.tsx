"use client"
import React from "react"
import { Tabs, Tab, Card, CardHeader, CardBody, Chip, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { SkillGroup } from "@/lib/types"
import PracticalCalendar from "@/components/features/student/PracticalCalendar"
import GroupScheduleCard from "@/components/features/mentor/GroupScheduleCard"
import { DefaultEmptyComponent, DefaultLoadingComponent } from "@/components/shared/StateRenderer"

export default function MentorScheduleView(props: { userId: string }) {
  const { userId } = props

  const { data: groups, isLoading: loadingGroups } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      const res = await api.getMentorSkillGroups(userId)
      return (res?.data ?? []) as SkillGroup[]
    },
    enabled: !!userId,
  })

  // Sort by next practical (if available) or by skill title
  const ordered = React.useMemo(() => {
    const list = (groups ?? []).slice()
    list.sort((a: any, b: any) => {
      const aDate = a?.next_practical_at ? new Date(a.next_practical_at).getTime() : Number.MAX_SAFE_INTEGER
      const bDate = b?.next_practical_at ? new Date(b.next_practical_at).getTime() : Number.MAX_SAFE_INTEGER
      if (aDate !== bDate) return aDate - bDate
      const aName = (a?.skill?.name ?? a?.skill?.title ?? "").toLowerCase()
      const bName = (b?.skill?.name ?? b?.skill?.title ?? "").toLowerCase()
      return aName.localeCompare(bName)
    })
    return list
  }, [groups])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Schedule</h1>
        <p className="text-default-500">Your upcoming practical sessions and calendar.</p>
      </div>

      <Tabs aria-label="Schedule" variant="underlined">
        <Tab key="calendar" title="Practical Calendar">
          <Card shadow="sm" className="p-4">
            <CardBody>
              <PracticalCalendar
                practicalDates={(groups ?? []).flatMap((g) => (g.practical_dates ?? []).map((d) => ({ date: d })))}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="list" title="Schedule List">
          <Card shadow="sm" className="p-4">
            <CardHeader className="flex items-center justify-between">
              <div className="text-base font-medium text-neutral-900">Upcoming Practicals</div>
              <Chip variant="flat">{ordered.length}</Chip>
            </CardHeader>
            <CardBody>
              {loadingGroups ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-md" />
                  ))}
                </div>
              ) : ordered.length === 0 ? (
                <DefaultEmptyComponent message="No upcoming practicals." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ordered.map((g) => (
                    <GroupScheduleCard key={g.id} skillId={String(g.skill?.id)} groupLabel={(g as any).group_display_name ?? `Group ${g.group_number ?? g.id}`} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}
