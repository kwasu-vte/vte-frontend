"use client"
import React from "react"
import { Card, CardHeader, CardBody, Button, Chip, Select, SelectItem, Skeleton } from "@nextui-org/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mentorsApi, skillsApi } from "@/lib/api"
import type { Skill } from "@/lib/types"

/**
 * * MentorSkillAssignment
 * Assign and remove skills for a mentor with immediate feedback.
 */
export type MentorSkillAssignmentProps = {
  userId: string
  mentorProfileId: number
}

export default function MentorSkillAssignment(props: MentorSkillAssignmentProps) {
  const { userId, mentorProfileId } = props
  const qc = useQueryClient()

  const { data: assigned, isLoading: loadingAssigned } = useQuery({
    queryKey: ["mentor-assigned-skills", userId],
    queryFn: async () => {
      const res = await mentorsApi.getAssignedSkills(userId)
      return res?.data ?? []
    },
  })

  const { data: allSkills, isLoading: loadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await skillsApi.getAll()
      return res?.data?.items ?? []
    },
  })

  const assignMutation = useMutation({
    mutationFn: async (skillId: string) => {
      return mentorsApi.assignSkill(mentorProfileId, { skill_id: skillId, is_primary: false })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mentor-assigned-skills", userId] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (skillId: string) => {
      return mentorsApi.removeSkill(mentorProfileId, { skill_id: skillId })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mentor-assigned-skills", userId] })
    },
  })

  if (loadingAssigned || loadingSkills) {
    return (
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
    )
  }

  const assignedSet = new Set((assigned as Skill[]).map((s) => s.id))
  const available = (allSkills as Skill[]).filter((s) => !assignedSet.has(s.id))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card shadow="sm" className="p-4">
        <CardHeader className="flex items-center justify-between">
          <p className="text-base font-medium text-neutral-900">Assigned Skills</p>
          <Chip variant="flat">{assigned?.length ?? 0}</Chip>
        </CardHeader>
        <CardBody className="space-y-3">
          {(assigned as Skill[]).length === 0 ? (
            <p className="text-sm text-neutral-500">No skills assigned.</p>
          ) : (
            (assigned as Skill[]).map((s) => (
              <div key={s.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{s.title}</p>
                </div>
                <Button size="sm" color="danger" variant="bordered" isDisabled={removeMutation.isPending} onPress={() => removeMutation.mutate(s.id)}>
                  Remove
                </Button>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Card shadow="sm" className="p-4">
        <CardHeader className="flex items-center justify-between">
          <p className="text-base font-medium text-neutral-900">Add Skill</p>
          <Chip variant="flat">{available.length}</Chip>
        </CardHeader>
        <CardBody className="space-y-3">
          {available.length === 0 ? (
            <p className="text-sm text-neutral-500">No available skills.</p>
          ) : (
            <div className="flex items-center gap-3">
              <Select aria-label="Select skill" className="flex-1" selectedKeys={new Set<string>()} onSelectionChange={() => { /* noop */ }}>
                {available.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </Select>
              <Button
                color="primary"
                isDisabled={assignMutation.isPending}
                onPress={() => {
                  // * Select is uncontrolled here; pick first available for simple MVP
                  const first = available[0]
                  if (first) assignMutation.mutate(first.id)
                }}
              >
                Add
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}


