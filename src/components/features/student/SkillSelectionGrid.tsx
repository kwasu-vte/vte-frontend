"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Chip, Badge } from "@heroui/react"
import { BookOpen, AlertCircle, CheckCircle } from "lucide-react"

/**
 * * SkillSelectionGrid
 * Grid of available skills for student's level with enrollment status.
 * Follows design guide with NextUI components and proper styling.
 *
 * Props:
 * - availableSkills: Array<Skill>
 * - studentLevel: string
 * - enrollment: Enrollment | null - Current user enrollment data
 * - onSelectSkill: (skillId: string) => void
 * - isLoading?: boolean
 */
export type SkillSelectionGridProps = {
  availableSkills: Array<{
    id: string
    title: string
    description?: string | null
    max_groups: number
    min_students_per_group: number
    max_students_per_group: number | null
    enrollments_count: number
    groups_count: number
    allowed_levels: string[] | null
    date_range_start: string | null
    date_range_end: string | null
  }>
  studentLevel: string
  enrollment: any
  onSelectSkill: (skillId: string) => void
  isLoading?: boolean
}

function SkillSelectionGrid({ 
  availableSkills, 
  studentLevel, 
  enrollment,
  onSelectSkill, 
  isLoading = false 
}: SkillSelectionGridProps) {
  const getSkillStatus = (skill: SkillSelectionGridProps['availableSkills'][0]) => {
    // Check if user is already enrolled in this skill
    // The enrollment object has a nested skill object with id
    const enrolledSkillId = enrollment?.skill?.id;
    const isEnrolled = enrollment && enrolledSkillId === skill.id;
    
    // If enrolled, show enrolled state
    if (isEnrolled) {
      return { 
        status: 'enrolled', 
        reason: 'You are enrolled in this skill',
        color: 'success' as const
      }
    }
    
    // If user has any enrollment, disable other skills
    if (enrollment) {
      return { 
        status: 'disabled', 
        reason: 'You can only enroll in one skill at a time',
        color: 'default' as const
      }
    }
    
    // Check if student level is allowed
    const isLevelAllowed = !skill.allowed_levels || skill.allowed_levels.includes(studentLevel)
    
    // Check if enrollment period is active
    const now = new Date()
    const startDate = skill.date_range_start ? new Date(skill.date_range_start) : null
    const endDate = skill.date_range_end ? new Date(skill.date_range_end) : null
    
    const isEnrollmentActive = (!startDate || now >= startDate) && (!endDate || now <= endDate)
    
    if (!isLevelAllowed) {
      return { 
        status: 'disabled', 
        reason: `Not available for ${studentLevel} level students`,
        color: 'danger' as const
      }
    }
    
    if (!isEnrollmentActive) {
      return { 
        status: 'disabled', 
        reason: 'Enrollment period is closed',
        color: 'warning' as const
      }
    }
    
    return { 
      status: 'available', 
      reason: 'Available for enrollment',
      color: 'success' as const
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} shadow="sm" className="w-full">
            <CardBody className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded mb-4"></div>
                <div className="h-8 bg-neutral-200 rounded"></div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    )
  }

  if (availableSkills.length === 0) {
    return (
      <Card shadow="sm" className="w-full">
        <CardBody className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No Skills Available</h3>
          <p className="text-neutral-600">
            There are no skills available for your level at this time.
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableSkills.map((skill) => {
        const skillStatus = getSkillStatus(skill)
        const isDisabled = skillStatus.status === 'disabled'
        
        return (
          <Card 
            key={skill.id} 
            shadow="sm" 
            className={`w-full transition-all duration-200 ${
              isDisabled ? 'opacity-60' : 'hover:shadow-md'
            }`}
            isPressable={!isDisabled}
            onPress={() => !isDisabled && onSelectSkill(skill.id)}
          >
            <CardHeader className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 w-full">
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-lg font-medium leading-normal text-neutral-900 line-clamp-2">
                  {skill.title}
                </p>
              </div>
              <Chip
                color={skillStatus.color}
                variant="flat"
                size="sm"
                startContent={
                  skillStatus.status === 'available' || skillStatus.status === 'enrolled' ? 
                    <CheckCircle className="h-3 w-3" /> : 
                    <AlertCircle className="h-3 w-3" />
                }
              >
                {skillStatus.status === 'available' ? 'Available' : 
                 skillStatus.status === 'enrolled' ? 'Enrolled' : 'Unavailable'}
              </Chip>
            </CardHeader>
            
            <CardBody className="pt-0">
              <div className="space-y-3">
                {/* Description */}
                {skill.description && (
                  <p className="text-sm text-neutral-600 line-clamp-3">
                    {skill.description}
                  </p>
                )}
                
                {/* Stats removed per request */}
                
                {/* Enrollment Period */}
                {skill.date_range_start && skill.date_range_end && (
                  <div className="text-xs text-neutral-500">
                    <p>Enrollment: {formatDate(skill.date_range_start)} - {formatDate(skill.date_range_end)}</p>
                  </div>
                )}
                
                {/* Disabled Reason */}
                {isDisabled && (
                  <div className="flex items-center gap-1 text-xs text-warning-600 bg-warning-50 p-2 rounded">
                    <AlertCircle className="h-3 w-3" />
                    <span>{skillStatus.reason}</span>
                  </div>
                )}
                
                {/* Action Button */}
                <Button
                  color={skillStatus.status === 'enrolled' ? "success" : "primary"}
                  variant={isDisabled ? "ghost" : "solid"}
                  size="sm"
                  className="w-full"
                  isDisabled={isDisabled}
                  startContent={<BookOpen className="h-4 w-4" />}
                  onPress={() => !isDisabled && onSelectSkill(skill.id)}
                >
                  {skillStatus.status === 'enrolled' ? 'View Enrollment' : 
                   isDisabled ? 'Not Available' : 'View Details'}
                </Button>
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}

export { SkillSelectionGrid }
export default SkillSelectionGrid
