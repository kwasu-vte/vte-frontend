"use client"
import React from "react"
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { mentorsApi } from "@/lib/api"
import type { MentorProfile, SkillGroup } from "@/lib/types"
import MentorSkillAssignment from "@/components/features/mentor/MentorSkillAssignment"
import MentorGroupsList from "@/components/features/mentor/MentorGroupsList"
import { StateRenderer, DefaultLoadingComponent, DefaultEmptyComponent } from "@/components/shared/StateRenderer"

export type MentorMySkillsViewProps = {
  userId: string
}

export default function MentorMySkillsView(props: MentorMySkillsViewProps) {
  const { userId } = props

  const { data: profile, isLoading: loadingProfile, isError: errorProfile } = useQuery({
    queryKey: ["mentor-profile", userId],
    queryFn: async () => {
      const res = await mentorsApi.getProfile(userId)
      return (res?.data ?? null) as MentorProfile | null
    },
    enabled: !!userId,
  })

  const { data: groups, isLoading: loadingGroups, isError: errorGroups } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      const res = await mentorsApi.getSkillGroups(userId)
      return (res?.data ?? []) as SkillGroup[]
    },
    enabled: !!userId,
  })

  return (
    <div className="p-4 md:p-6">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm mb-4">
        Tip: Use the assignment panel to add or remove skills you mentor. The groups panel shows groups linked to your assigned skills.
      </div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">My Skills</h1>
        <p className="text-default-500">Manage your assigned skills and view associated groups.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Skill Assignment */}
        {loadingProfile ? (
          <Card shadow="sm" className="p-4">
            <CardHeader>
              <Skeleton className="h-6 w-40 rounded-md" />
            </CardHeader>
            <CardBody className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))}
            </CardBody>
          </Card>
        ) : errorProfile || !profile ? (
          <Card shadow="sm" className="p-4">
            <CardBody>
              <div className="text-sm text-neutral-500">Unable to load mentor profile.</div>
            </CardBody>
          </Card>
        ) : (
          <MentorSkillAssignment userId={userId} mentorProfileId={Number(profile.id)} />
        )}

        {/* Groups list */}
        <StateRenderer
          data={groups as SkillGroup[]}
          isLoading={loadingGroups}
          error={errorGroups ? new Error("Failed to load groups") : null}
          loadingComponent={<DefaultLoadingComponent />}
          emptyComponent={<DefaultEmptyComponent message="No groups assigned" />}
        >
          {(data) => <MentorGroupsList groups={data} viewMode="grid" />}
        </StateRenderer>
      </div>
    </div>
  )
}
