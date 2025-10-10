"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Button, Skeleton } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { mentorsApi } from "@/lib/api"
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
 * - onSelectGroup?: (groupId: string) => void
 */
export type MentorGroupsListProps = {
  userId?: string
  groups?: SkillGroup[]
  viewMode?: "grid" | "list"
  onSelectGroup?: (groupId: string) => void
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
      const res = await mentorsApi.getSkillGroups(userId)
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
          className={`${isGrid ? "" : "w-full"} hover:shadow-md transition-shadow`}
          isPressable={!!onSelectGroup}
          onPress={() => onSelectGroup?.(Number(group.id))}
        >
          <CardBody className="p-4">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  {group.group_display_name ?? `Group ${group.group_number ?? group.id}`}
                </h3>
                <p className="text-sm text-neutral-600">{group.skill?.title ?? "Unknown Skill"}</p>
              </div>
              <Chip color="primary" variant="flat" size="sm">
                {group.group_number ? `#${group.group_number}` : `ID: ${group.id}`}
              </Chip>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 font-medium mb-1">Students</div>
                <div className="text-lg font-bold text-blue-900">
                  {group.enrollments?.length ?? Number(group.current_student_count ?? 0)}
                </div>
                <div className="text-xs text-blue-600">
                  of {Number(group.max_student_capacity ?? 0)}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-green-600 font-medium mb-1">Capacity</div>
                <div className="text-lg font-bold text-green-900">
                  {Math.round(((group.enrollments?.length ?? Number(group.current_student_count ?? 0)) / Number(group.max_student_capacity ?? 1)) * 100)}%
                </div>
                <div className="text-xs text-green-600">filled</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <GroupCapacityIndicator
                current={group.enrollments?.length ?? Number(group.current_student_count ?? 0)}
                max={Number(group.max_student_capacity ?? 0)}
                size="sm"
              />
            </div>

            {/* Next Practical */}
            {(group as any)?.next_practical_at && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-xs text-orange-600 font-medium">Next Practical</div>
                    <div className="text-sm font-medium text-orange-900">
                      {new Date((group as any).next_practical_at as string).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-orange-600">
                      {new Date((group as any).next_practical_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {onSelectGroup && (
              <div className="flex justify-end">
                <Button 
                  color="primary" 
                  variant="bordered" 
                  size="sm"
                  onPress={() => onSelectGroup(group.id)}
                >
                  View Details
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  )
}


