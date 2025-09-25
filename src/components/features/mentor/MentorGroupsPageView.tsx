"use client"
import React from "react"
import { Card, CardHeader, CardBody, Input, Select, SelectItem, Button, Tabs, Tab, Chip, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { mentorsApi, qrCodesApi } from "@/lib/api"
import type { Skill, SkillGroup, AttendanceReport } from "@/lib/types"
import MentorGroupsList from "@/components/features/mentor/MentorGroupsList"
import GroupStudentsRoster from "@/components/features/mentor/GroupStudentsRoster"
import { StateRenderer, DefaultLoadingComponent, DefaultEmptyComponent } from "@/components/shared/StateRenderer"

export default function MentorGroupsPageView(props: { userId: string }) {
  const { userId } = props

  const [skillFilter, setSkillFilter] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")
  const [selectedGroupId, setSelectedGroupId] = React.useState<number | null>(null)

  const { data: skills, isLoading: loadingSkills } = useQuery({
    queryKey: ["mentor-assigned-skills", userId],
    queryFn: async () => {
      const res = await mentorsApi.getAssignedSkills(userId)
      return (res?.data ?? []) as Skill[]
    },
    enabled: !!userId,
  })

  const { data: groups, isLoading: loadingGroups, isError: groupsError } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      const res = await mentorsApi.getSkillGroups(userId)
      return (res?.data ?? []) as SkillGroup[]
    },
    enabled: !!userId,
  })

  const filteredGroups = React.useMemo(() => {
    const list = (groups ?? []) as SkillGroup[]
    const bySkill = skillFilter ? list.filter((g) => String(g.skill?.id) === String(skillFilter)) : list
    if (!search.trim()) return bySkill
    const q = search.trim().toLowerCase()
    return bySkill.filter((g) => {
      const name = (g.group_display_name ?? `Group ${g.group_number ?? g.id}`).toLowerCase()
      const skillName = (g.skill?.title ?? "").toLowerCase()
      return name.includes(q) || skillName.includes(q)
    })
  }, [groups, skillFilter, search])

  // Attendance report for selected group (for quick stats)
  const { data: report, isLoading: loadingReport } = useQuery({
    queryKey: ["group-attendance-report", selectedGroupId],
    queryFn: async () => {
      if (!selectedGroupId) return null as AttendanceReport | null
      const res = await qrCodesApi.getAttendanceReport(Number(selectedGroupId))
      return (res?.data ?? null) as AttendanceReport | null
    },
    enabled: !!selectedGroupId,
  })

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <Input
            aria-label="Search groups"
            placeholder="Search by group or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="min-w-[220px]">
          {loadingSkills ? (
            <Skeleton className="h-10 w-full rounded-md" />
          ) : (
            <Select
              aria-label="Filter by skill"
              selectedKeys={skillFilter ? new Set([String(skillFilter)]) : new Set([])}
              onSelectionChange={(keys) => {
                const key = Array.from(keys as Set<string>)[0]
                setSkillFilter(key ?? null)
              }}
              placeholder="All skills"
            >
              {(skills ?? []).map((s) => (
                <SelectItem key={String(s.id)} value={String(s.id)}>{s.title}</SelectItem>
              ))}
            </Select>
          )}
        </div>
        <Button variant="ghost" onPress={() => { setSkillFilter(null); setSearch("") }}>Reset</Button>
      </div>

      <Card shadow="sm" className="p-4">
        <CardHeader className="flex items-center justify-between">
          <p className="text-base font-medium text-neutral-900">Groups</p>
          <Chip variant="flat">{filteredGroups.length}</Chip>
        </CardHeader>
        <CardBody>
          <StateRenderer
            data={filteredGroups as SkillGroup[]}
            isLoading={loadingGroups}
            error={groupsError ? new Error("Failed to load groups") : null}
            loadingComponent={<DefaultLoadingComponent />}
            emptyComponent={<DefaultEmptyComponent message="No groups match your filters" />}
          >
            {(data) => (
              <MentorGroupsList
                groups={data}
                viewMode="list"
                onSelectGroup={(id) => setSelectedGroupId(id)}
              />
            )}
          </StateRenderer>
        </CardBody>
      </Card>

      <Card shadow="sm" className="p-4">
        <CardHeader className="flex items-center justify-between">
          <p className="text-base font-medium text-neutral-900">Group Details</p>
          {selectedGroupId && <Chip variant="flat">Group #{selectedGroupId}</Chip>}
        </CardHeader>
        <CardBody>
          {!selectedGroupId ? (
            <div className="text-sm text-neutral-500">Select a group to view roster and attendance.</div>
          ) : (
            <Tabs aria-label="Group Details" variant="underlined">
              <Tab key="roster" title="Roster">
                <GroupStudentsRoster groupId={selectedGroupId} />
              </Tab>
              <Tab key="attendance" title="Attendance">
                {loadingReport ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-48 rounded-md" />
                    <Skeleton className="h-64 w-full rounded-md" />
                  </div>
                ) : report ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card shadow="sm" className="p-4">
                      <CardHeader className="text-sm text-neutral-600">Skill</CardHeader>
                      <CardBody className="text-base font-medium text-neutral-900">{report.group_info.skill_title}</CardBody>
                    </Card>
                    <Card shadow="sm" className="p-4">
                      <CardHeader className="text-sm text-neutral-600">Total Enrolled</CardHeader>
                      <CardBody className="text-base font-medium text-neutral-900">{report.group_info.total_enrolled}</CardBody>
                    </Card>
                    <Card shadow="sm" className="p-4">
                      <CardHeader className="text-sm text-neutral-600">Practical Date</CardHeader>
                      <CardBody className="text-base font-medium text-neutral-900">{report.group_info.practical_date ? new Date(report.group_info.practical_date).toLocaleDateString() : "—"}</CardBody>
                    </Card>
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500">No attendance report available.</div>
                )}
              </Tab>
            </Tabs>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
