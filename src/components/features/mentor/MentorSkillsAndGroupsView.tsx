'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { mentorsApi } from '@/lib/api'
import { Card, CardHeader, CardBody, Chip, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import { StateRenderer } from '@/components/shared/StateRenderer'
import { Eye, Users, Calendar } from 'lucide-react'
import type { Skill, SkillGroup } from '@/lib/types'

export type MentorSkillsAndGroupsViewProps = {
  userId: string
}

export default function MentorSkillsAndGroupsView(props: MentorSkillsAndGroupsViewProps) {
  const { userId } = props

  // * State management
  const [selectedSkillId, setSelectedSkillId] = React.useState<string>('all')
  const [selectedGroup, setSelectedGroup] = React.useState<SkillGroup | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // * Data fetching
  const { data: skills, isLoading: loadingSkills } = useQuery({
    queryKey: ["mentor-assigned-skills", userId],
    queryFn: async () => {
      const res = await mentorsApi.getAssignedSkills(userId)
      return res?.data ?? []
    },
  })

  const { data: groups, isLoading: loadingGroups } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      const res = await mentorsApi.getSkillGroups(userId)
      return res?.data ?? []
    },
  })

  // * Filter groups by selected skill
  const filteredGroups = React.useMemo(() => {
    if (!groups) return []
    if (selectedSkillId === 'all') return groups
    return groups.filter(group => String(group.skill?.id) === selectedSkillId)
  }, [groups, selectedSkillId])

  // * Get unique skills for filter
  const uniqueSkills = React.useMemo(() => {
    if (!groups) return []
    const skills = groups.map(group => group.skill).filter(Boolean)
    const unique = skills.filter((skill, index, self) => 
      skill && index === self.findIndex(s => s && skill && s.id === skill.id)
    )
    return unique
  }, [groups])

  // * Calculate skill statistics from groups data
  const skillStats = React.useMemo(() => {
    if (!groups || !skills) return new Map()
    
    const stats = new Map()
    
    // * Initialize all skills with zero counts
    skills.forEach(skill => {
      stats.set(skill.id, {
        groupsCount: 0,
        studentsCount: 0
      })
    })
    
    // * Calculate counts from groups data
    groups.forEach(group => {
      if (group.skill?.id) {
        const skillId = String(group.skill.id)
        const currentStats = stats.get(skillId) || { groupsCount: 0, studentsCount: 0 }
        
        stats.set(skillId, {
          groupsCount: currentStats.groupsCount + 1,
          studentsCount: currentStats.studentsCount + (group.enrollments?.length ?? Number(group.current_student_count ?? 0))
        })
      }
    })
    
    return stats
  }, [groups, skills])

  // * Calculate overall statistics
  const stats = React.useMemo(() => {
    const skillsList = (skills ?? []) as Skill[]
    const groupsList = (groups ?? []) as SkillGroup[]
    
    return {
      totalSkills: skillsList.length,
      totalGroups: groupsList.length,
      totalStudents: groupsList.reduce((sum, group) => 
        sum + (group.enrollments?.length ?? Number(group.current_student_count ?? 0)), 0
      ),
      fullGroups: groupsList.filter(group => 
        (group.enrollments?.length ?? Number(group.current_student_count ?? 0)) >= Number(group.max_student_capacity ?? 0)
      ).length
    }
  }, [skills, groups])

  const handleViewGroup = (group: SkillGroup) => {
    setSelectedGroup(group)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedGroup(null)
  }

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Skills & Groups</h1>
            <p className="text-neutral-600">View your assigned skills and manage groups.</p>
          </div>
        </div>
      </div>

      {/* * Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSkills}</div>
            <div className="text-sm text-neutral-600">Assigned Skills</div>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.totalGroups}</div>
            <div className="text-sm text-neutral-600">Total Groups</div>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
            <div className="text-sm text-neutral-600">Total Students</div>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.fullGroups}</div>
            <div className="text-sm text-neutral-600">Full Groups</div>
          </CardBody>
        </Card>
      </div>

      {/* * Skills Table */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Assigned Skills</p>
            <Chip variant="flat">{stats.totalSkills}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <StateRenderer
            data={skills}
            isLoading={loadingSkills}
            error={null}
            emptyComponent={<div className="py-6 text-center text-neutral-500">No skills assigned. Contact the admin to get a skill assigned to you.</div>}
          >
            {(data) => (
              <Table aria-label="Skills table">
                <TableHeader>
                  <TableColumn>Skill</TableColumn>
                  <TableColumn>Description</TableColumn>
                  <TableColumn>Groups</TableColumn>
                  <TableColumn>Students</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>
                        <div className="font-semibold text-neutral-900">{skill.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-600 line-clamp-2">
                          {skill.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip variant="flat" color="primary">
                          {skillStats.get(skill.id)?.groupsCount || 0}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip variant="flat" color="success">
                          {skillStats.get(skill.id)?.studentsCount || 0}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </StateRenderer>
        </CardBody>
      </Card>

      {/* * Filters */}
      <Card shadow="sm">
        <CardHeader className="px-4 pt-4">
          <div className="flex items-center gap-2">
            <p className="text-base font-medium text-neutral-900">Filters</p>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <div className="flex gap-4 items-center">
            <div className="w-full md:w-80">
              <Select
                label="Filter by Skill"
                placeholder="Select a skill"
                selectedKeys={selectedSkillId !== 'all' ? [selectedSkillId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  setSelectedSkillId(selected || 'all')
                }}
                variant="bordered"
                items={[{ key: 'all', title: 'All Skills' }, ...uniqueSkills.filter(skill => skill).map(skill => ({ key: String(skill!.id), title: skill!.title }))]}
              >
                {(skill) => <SelectItem key={skill.key}>{skill.title}</SelectItem>}
              </Select>
            </div>
            <Chip variant="flat" color="primary">
              {filteredGroups?.length || 0} groups
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* * Groups Table */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Groups</p>
            <Chip variant="flat">{filteredGroups?.length || 0}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <StateRenderer
            data={filteredGroups}
            isLoading={loadingGroups}
            error={null}
            emptyComponent={<div className="py-6 text-center text-neutral-500">No groups available. Groups will be updated when students enroll for your assigned skills.</div>}
          >
            {(data) => (
              <Table aria-label="Groups table">
                <TableHeader>
                  <TableColumn>Group</TableColumn>
                  <TableColumn>Skill</TableColumn>
                  <TableColumn>Students</TableColumn>
                  <TableColumn>Capacity</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((group) => {
                    const currentStudents = group.enrollments?.length ?? Number(group.current_student_count ?? 0)
                    const maxCapacity = Number(group.max_student_capacity ?? 0)
                    const isFull = currentStudents >= maxCapacity
                    const capacityPercentage = maxCapacity > 0 ? Math.round((currentStudents / maxCapacity) * 100) : 0
                    
                    return (
                      <TableRow key={group.id}>
                        <TableCell>
                          <div className="font-semibold text-neutral-900">
                            {group.group_display_name ?? `Group ${group.group_number ?? group.id}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-neutral-600">
                            {group.skill?.title ?? "Unknown Skill"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-neutral-400" />
                            <span className="font-medium">{currentStudents}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-neutral-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${isFull ? 'bg-red-500' : capacityPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs text-neutral-500">{capacityPercentage}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={isFull ? 'danger' : capacityPercentage > 80 ? 'warning' : 'success'}
                            variant="flat"
                            size="sm"
                          >
                            {isFull ? 'Full' : capacityPercentage > 80 ? 'Almost Full' : 'Available'}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="bordered"
                            startContent={<Eye className="w-4 h-4" />}
                            onPress={() => handleViewGroup(group)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </StateRenderer>
        </CardBody>
      </Card>

      {/* * Group Details Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Group Details</h2>
                <p className="text-sm text-neutral-500">Comprehensive information about this group</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="px-6 py-4">
            {selectedGroup && (
              <div className="space-y-6">
                {/* * Group Overview */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {selectedGroup.group_display_name || `Group ${selectedGroup.group_number}`}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {selectedGroup.skill?.title || "Unknown Skill"}
                      </p>
                    </div>
                    <Chip 
                      color={(selectedGroup.enrollments?.length ?? 0) >= Number(selectedGroup.max_student_capacity ?? 0) ? 'danger' : 'success'}
                      variant="flat"
                      size="sm"
                    >
                      {(selectedGroup.enrollments?.length ?? 0) >= Number(selectedGroup.max_student_capacity ?? 0) ? 'Full' : 'Available'}
                    </Chip>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedGroup.enrollments?.length ?? Number(selectedGroup.current_student_count ?? 0)}
                      </div>
                      <div className="text-xs text-neutral-600">Current Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-700">
                        {Number(selectedGroup.max_student_capacity ?? 0)}
                      </div>
                      <div className="text-xs text-neutral-600">Max Capacity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Number(selectedGroup.max_student_capacity ?? 0) > 0 
                          ? Math.round(((selectedGroup.enrollments?.length ?? Number(selectedGroup.current_student_count ?? 0)) / Number(selectedGroup.max_student_capacity ?? 1)) * 100)
                          : 0}%
                      </div>
                      <div className="text-xs text-neutral-600">Utilization</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(0, Number(selectedGroup.max_student_capacity ?? 0) - (selectedGroup.enrollments?.length ?? Number(selectedGroup.current_student_count ?? 0)))}
                      </div>
                      <div className="text-xs text-neutral-600">Spots Left</div>
                    </div>
                  </div>
                </div>

                {/* * Students List */}
                {selectedGroup.enrollments && selectedGroup.enrollments.length > 0 && (
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Enrolled Students
                    </h4>
                    <div className="space-y-2">
                      {selectedGroup.enrollments.map((enrollment, index) => (
                        <div key={enrollment.id || index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <div>
                            <div className="font-medium text-neutral-900">
                              {enrollment.user?.first_name} {enrollment.user?.last_name}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {enrollment.user?.email}
                            </div>
                          </div>
                          <Chip variant="flat" size="sm" color="success">
                            Enrolled
                          </Chip>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter className="px-6 py-4">
            <Button 
              color="primary" 
              variant="light" 
              onClick={closeModal}
              className="font-medium"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}