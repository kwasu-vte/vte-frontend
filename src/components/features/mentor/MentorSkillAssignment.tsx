"use client"
import React from "react"
import { Card, CardHeader, CardBody, Button, Chip, Select, SelectItem, Skeleton, Divider } from "@heroui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mentorsApi, skillsApi } from "@/lib/api"
import type { Skill } from "@/lib/types"
import { Plus, X, Users, BookOpen, CheckCircle, AlertCircle } from "lucide-react"

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
  const [selectedSkillId, setSelectedSkillId] = React.useState<string | null>(null)

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
      setSelectedSkillId(null)
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

  const assignedList: Skill[] = Array.isArray(assigned) ? (assigned as Skill[]) : []
  const allSkillsList: Skill[] = Array.isArray(allSkills) ? (allSkills as Skill[]) : []
  const assignedSet = new Set(assignedList.map((s) => s.id))
  const available = allSkillsList.filter((s) => !assignedSet.has(s.id))

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Skill Assignment</h3>
            <p className="text-sm text-neutral-600">Manage mentor skills and expertise areas</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{assignedList.length}</div>
            <div className="text-xs text-neutral-600">Assigned Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{available.length}</div>
            <div className="text-xs text-neutral-600">Available Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{allSkillsList.length}</div>
            <div className="text-xs text-neutral-600">Total Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {allSkillsList.length > 0 ? Math.round((assignedList.length / allSkillsList.length) * 100) : 0}%
            </div>
            <div className="text-xs text-neutral-600">Coverage</div>
          </div>
        </div>
      </div>

      {/* Skills Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Skills */}
        <Card shadow="sm" className="border border-green-200">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-base font-semibold text-green-900">Assigned Skills</p>
              </div>
              <Chip color="success" variant="flat" size="sm">{assignedList.length}</Chip>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            {assignedList.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm text-neutral-500 mb-2">No skills assigned yet</p>
                <p className="text-xs text-neutral-400">Use the panel on the right to add skills</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedList.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900">{skill.title}</p>
                      {skill.description && (
                        <p className="text-xs text-green-700 mt-1 line-clamp-2">{skill.description}</p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      color="danger" 
                      variant="light"
                      isDisabled={removeMutation.isPending} 
                      onPress={() => removeMutation.mutate(skill.id)}
                      startContent={<X className="w-3 h-3" />}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Add Skills */}
        <Card shadow="sm" className="border border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <p className="text-base font-semibold text-blue-900">Add New Skill</p>
              </div>
              <Chip color="primary" variant="flat" size="sm">{available.length}</Chip>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            {available.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm text-neutral-500 mb-2">All skills are assigned</p>
                <p className="text-xs text-neutral-400">This mentor has access to all available skills</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Select Skill to Assign</label>
                  <Select
                    aria-label="Select skill"
                    selectedKeys={selectedSkillId ? new Set([selectedSkillId]) : new Set([])}
                    onSelectionChange={(keys) => {
                      if (keys === "all") return
                      const first = Array.from(keys as Set<any>)[0]
                      setSelectedSkillId(first ?? null)
                    }}
                    placeholder="Choose a skill to assign"
                    variant="bordered"
                    size="lg"
                  >
                    {available.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{skill.title}</span>
                          {skill.description && (
                            <span className="text-xs text-neutral-500">{skill.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <Button
                  color="primary"
                  size="lg"
                  className="w-full"
                  isDisabled={assignMutation.isPending || !selectedSkillId}
                  onPress={() => {
                    if (selectedSkillId) assignMutation.mutate(selectedSkillId)
                  }}
                  startContent={<Plus className="w-4 h-4" />}
                  isLoading={assignMutation.isPending}
                >
                  {assignMutation.isPending ? 'Assigning...' : 'Assign Skill'}
                </Button>
                
                {selectedSkillId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      <strong>Selected:</strong> {available.find(s => s.id === selectedSkillId)?.title}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}


