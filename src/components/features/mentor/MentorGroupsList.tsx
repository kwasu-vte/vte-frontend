"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Button, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { SkillGroup } from "@/lib/types"
import GroupCapacityIndicator from "@/components/features/admin/GroupCapacityIndicator"

/**
 * * MentorGroupsList
 * Grid/list of groups in mentor's assigned skills.
 *
 * Props:
 * - userId?: string (when provided, component fetches mentor groups)
 * - groups?: SkillGroup[] (optional pre-fetched groups; bypasses fetching)
 * - viewMode?: 'grid' | 'list'
 * - onSelectGroup?: (groupId: number) => void
 */
export type MentorGroupsListProps = {
  userId?: string
  groups?: SkillGroup[]
  viewMode?: "grid" | "list"
  onSelectGroup?: (groupId: number) => void
}

export default function MentorGroupsList(props: MentorGroupsListProps) {
  const { userId, groups: providedGroups, viewMode = "grid", onSelectGroup } = props

  // * Fetch mentor groups if userId is provided and groups not passed in
  const {
    data: fetched,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      if (!userId) return [] as SkillGroup[]
      const res = await api.getMentorSkillGroups(userId)
      return res?.data ?? []
    },
    enabled: !!userId && !providedGroups,
  })

  const groups: SkillGroup[] = providedGroups ?? fetched ?? []

  // * Loading state per Design Guide (Skeletons)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} shadow="sm" className="p-4">
            <CardHeader className="flex items-center justify-between">
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </CardHeader>
            <CardBody className="space-y-4">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </CardBody>
          </Card>
        ))}
      </div>
    )
  }

  // * Error state with retry action
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-neutral-50">
        <p className="text-base font-medium text-neutral-900 mb-2">Failed to load groups</p>
        <p className="text-sm text-neutral-500 mb-4">{(error as any)?.message ?? "Please try again."}</p>
        <Button color="primary" onPress={() => refetch?.()}>Retry</Button>
      </div>
    )
  }

  // * Empty state
  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-neutral-50">
        <p className="text-base font-medium text-neutral-900 mb-2">No groups assigned</p>
        <p className="text-sm text-neutral-500">You currently do not have any assigned groups.</p>
      </div>
    )
  }

  // * Render grid or list layouts (grid as default per design)
  const isGrid = viewMode === "grid"

  return (
    <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
      {groups.map((group) => (
        <Card
          key={group.id}
          shadow="sm"
          className={isGrid ? "" : ""}
          isPressable={!!onSelectGroup}
          onPress={() => onSelectGroup?.(group.id)}
        >
          <CardHeader className="flex items-center justify-between">
            <div>
              <p className="text-xl font-medium text-neutral-900">{group.name ?? `Group ${group.group_number ?? group.id}`}</p>
              <p className="text-sm text-neutral-500">{group.skill?.name ?? "Unknown Skill"}</p>
            </div>
            <Chip color="primary" variant="flat" size="sm">
              {group.group_number ? `#${group.group_number}` : `ID: ${group.id}`}
            </Chip>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                Capacity
              </div>
              <div className="text-sm font-medium text-neutral-900">
                {Number(group.current_count ?? group.members_count ?? 0)}/{Number(group.capacity ?? group.max_members ?? 0) || 0}
              </div>
            </div>
            <GroupCapacityIndicator
              current={Number(group.current_count ?? group.members_count ?? 0)}
              max={Number(group.capacity ?? group.max_members ?? 0) || 0}
              size="md"
            />
            {group.next_practical_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Next practical</span>
                <span className="text-sm font-medium text-neutral-900">
                  {new Date(group.next_practical_at).toLocaleString()}
                </span>
              </div>
            )}
            {onSelectGroup && (
              <div className="flex justify-end">
                <Button color="primary" variant="bordered" onPress={() => onSelectGroup(group.id)}>
                  View Roster
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  )
}


