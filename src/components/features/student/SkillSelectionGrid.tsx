'use client'

import React from 'react'
import { Card, CardBody, Badge, Button, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import { BookOpen, CheckCircle, Clock, XCircle, Lock, AlertCircle, Calendar } from 'lucide-react'

interface Skill {
  id: string
  title: string
  description?: string | null
  allowed_levels?: string[] | null
  date_range_start?: string | null
  date_range_end?: string | null
}

interface SkillSelectionGridProps {
  availableSkills: Skill[]
  studentLevel: string
  enrollment: any
  onSelectSkill: (skillId: string) => void
  isLoading?: boolean
}

export function SkillSelectionGrid({
  availableSkills,
  studentLevel,
  enrollment,
  onSelectSkill,
  isLoading = false
}: SkillSelectionGridProps) {
  const enrolledSkillId = enrollment?.skill?.id
  const hasEnrollment = !!enrollment

  const getSkillStatus = (skill: Skill) => {
    const isEnrolled = enrolledSkillId === skill.id
    const isLevelAllowed = !skill.allowed_levels || skill.allowed_levels.includes(studentLevel)
    
    const now = new Date()
    const startDate = skill.date_range_start ? new Date(skill.date_range_start) : null
    const endDate = skill.date_range_end ? new Date(skill.date_range_end) : null
    const isEnrollmentActive = (!startDate || now >= startDate) && (!endDate || now <= endDate)

    if (isEnrolled) return 'enrolled'
    if (!isLevelAllowed) return 'level-restricted'
    if (!isEnrollmentActive) return 'closed'
    if (hasEnrollment) return 'blocked'
    return 'available'
  }

  const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start || !end) return null
    const startDate = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endDate = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${startDate} - ${endDate}`
  }

  // Separate and sort skills
  const enrolledSkill = availableSkills.find(s => s.id === enrolledSkillId)
  const otherSkills = availableSkills.filter(s => s.id !== enrolledSkillId)

  const StatusBadge = ({ status }: { status: string }) => {
    const configs = {
      enrolled: { icon: CheckCircle, text: 'Enrolled', color: 'success' },
      available: { icon: CheckCircle, text: 'Available', color: 'success' },
      closed: { icon: Clock, text: 'Closed', color: 'warning' },
      'level-restricted': { icon: Lock, text: 'Level Restricted', color: 'danger' },
      blocked: { icon: XCircle, text: 'Unavailable', color: 'default' }
    }

    const config = configs[status as keyof typeof configs] || configs.blocked
    const Icon = config.icon

    return (
      <Badge 
        color={config.color as any} 
        variant="flat" 
        size="sm"
        className="flex items-center gap-1 px-2 py-1"
      >
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{config.text}</span>
      </Badge>
    )
  }

  const SkillCard = ({ skill, status }: { skill: Skill; status: string }) => {
    const isInteractive = status === 'enrolled' || status === 'available'
    const dateRange = formatDateRange(skill.date_range_start, skill.date_range_end)

    return (
      <Card
        isPressable={isInteractive}
        isHoverable={isInteractive}
        onPress={() => isInteractive && onSelectSkill(skill.id)}
        className={`
          transition-all duration-200 border
          ${status === 'enrolled' ? 'border-success-300 bg-success-50' : 'border-neutral-200'}
          ${status === 'available' ? 'hover:border-primary-300 hover:shadow-md' : ''}
          ${!isInteractive ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <CardBody className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`
                p-2 rounded-lg flex-shrink-0
                ${status === 'enrolled' ? 'bg-success-100' : 'bg-primary-100'}
              `}>
                <BookOpen className={`h-5 w-5 ${status === 'enrolled' ? 'text-success-600' : 'text-primary-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1">
                  {skill.title}
                </h3>
                {skill.description && (
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {skill.description}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          {dateRange && (
            <div className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{dateRange}</span>
            </div>
          )}

          {isInteractive && (
            <Button
              size="sm"
              variant="flat"
              color={status === 'enrolled' ? 'success' : 'primary'}
              className="w-full mt-3"
              onPress={() => onSelectSkill(skill.id)}
            >
              {status === 'enrolled' ? 'View Details' : 'Learn More'}
            </Button>
          )}
        </CardBody>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-neutral-200">
            <CardBody className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Enrollment Section */}
      {enrolledSkill && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-neutral-900">Your Current Enrollment</h2>
            <Badge color="success" variant="flat" size="sm">Active</Badge>
          </div>
          <SkillCard skill={enrolledSkill} status="enrolled" />
        </div>
      )}

      {/* Available Skills Section */}
      {otherSkills.length > 0 && (
        <div>
          {enrolledSkill && <Divider className="my-6" />}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">
              {enrolledSkill ? 'Other Skills' : 'Available Skills'}
            </h2>
            {hasEnrollment && (
              <p className="text-sm text-neutral-600">
                You can only enroll in one skill at a time. Complete or withdraw from your current enrollment to choose another.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherSkills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                status={getSkillStatus(skill)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SkillDetailModal Component
// ============================================================================

export type SkillDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  onEnroll: (skillId: string) => void
  skill: {
    id: string
    title: string
    description?: string | null
    allowed_levels?: string[] | null
    date_range_start?: string | null
    date_range_end?: string | null
  } | null
  studentLevel: string
  enrollment: any
}

export function SkillDetailModal({ 
  isOpen, 
  onClose, 
  onEnroll, 
  skill, 
  studentLevel, 
  enrollment 
}: SkillDetailModalProps) {
  if (!skill) return null

  const enrolledSkillId = enrollment?.skill?.id
  const hasEnrollment = !!enrollment
  const isEnrolled = enrolledSkillId === skill.id
  const isLevelAllowed = !skill.allowed_levels || skill.allowed_levels.includes(studentLevel)
  
  const now = new Date()
  const startDate = skill.date_range_start ? new Date(skill.date_range_start) : null
  const endDate = skill.date_range_end ? new Date(skill.date_range_end) : null
  const isEnrollmentActive = (!startDate || now >= startDate) && (!endDate || now <= endDate)

  const canEnroll = !isEnrolled && isLevelAllowed && isEnrollmentActive && !hasEnrollment

  const formatDate = (d?: string | null) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const StatusAlert = () => {
    if (isEnrolled) {
      return (
        <Card className="border-success-300 bg-success-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-success-100 rounded-lg flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-success-900 mb-1">You're Enrolled</h4>
                <p className="text-sm text-success-700">
                  You are currently enrolled in this skill. View your enrollment page to track progress.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )
    }

    if (!isLevelAllowed) {
      return (
        <Card className="border-danger-300 bg-danger-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-danger-100 rounded-lg flex-shrink-0">
                <Lock className="h-5 w-5 text-danger-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-danger-900 mb-1">Level Restricted</h4>
                <p className="text-sm text-danger-700">
                  This skill is not available for {studentLevel} level students.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )
    }

    if (!isEnrollmentActive) {
      return (
        <Card className="border-warning-300 bg-warning-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-warning-100 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-warning-900 mb-1">Enrollment Closed</h4>
                <p className="text-sm text-warning-700">
                  The enrollment period for this skill is not currently active.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )
    }

    if (hasEnrollment) {
      return (
        <Card className="border-neutral-300 bg-neutral-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-neutral-200 rounded-lg flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900 mb-1">Already Enrolled</h4>
                <p className="text-sm text-neutral-700">
                  You can only enroll in one skill at a time. Complete or withdraw from your current enrollment first.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )
    }

    return (
      <Card className="border-success-300 bg-success-50">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-success-100 rounded-lg flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-success-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-success-900 mb-1">Ready to Enroll</h4>
              <p className="text-sm text-success-700">
                This skill is available for enrollment. Click the button below to get started.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-neutral-900">{skill.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  color={isEnrolled ? 'success' : canEnroll ? 'success' : 'default'} 
                  variant="flat"
                  size="sm"
                >
                  {isEnrolled ? 'Enrolled' : canEnroll ? 'Available' : 'Unavailable'}
                </Badge>
                {skill.allowed_levels && skill.allowed_levels.length > 0 && (
                  <Badge variant="flat" size="sm" color="default">
                    {skill.allowed_levels.join(', ')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="space-y-4">
            {/* Description */}
            {skill.description && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">About This Skill</h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            )}

            {/* Enrollment Period */}
            {(skill.date_range_start || skill.date_range_end) && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Enrollment Period</h3>
                <Card className="border border-neutral-200">
                  <CardBody className="p-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      <span>
                        {formatDate(skill.date_range_start)} - {formatDate(skill.date_range_end)}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            <Divider />

            {/* Status Alert */}
            <StatusAlert />
          </div>
        </ModalBody>

        <ModalFooter className="pt-2">
          <Button 
            variant="ghost" 
            onPress={onClose}
            className="text-neutral-600"
          >
            Close
          </Button>
          <Button 
            color={isEnrolled ? 'success' : 'primary'}
            isDisabled={!isEnrolled && !canEnroll}
            onPress={() => {
              onEnroll(skill.id)
              onClose()
            }}
          >
            {isEnrolled ? 'View Enrollment' : canEnroll ? 'Enroll Now' : 'Not Available'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}