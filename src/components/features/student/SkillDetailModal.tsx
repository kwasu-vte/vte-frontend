"use client"
import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react"
import { BookOpen, AlertCircle, CheckCircle } from "lucide-react"

/**
 * * SkillDetailModal
 * Modal showing skill details with enrollment status and action buttons.
 * Handles enrolled state and disables enrollment for other skills when user is already enrolled.
 */

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

export default function SkillDetailModal({ isOpen, onClose, onEnroll, skill, studentLevel, enrollment }: SkillDetailModalProps) {
  if (!skill) return null

  const isLevelAllowed = !skill.allowed_levels || skill.allowed_levels.includes(studentLevel)
  const now = new Date()
  const startDate = skill.date_range_start ? new Date(skill.date_range_start) : null
  const endDate = skill.date_range_end ? new Date(skill.date_range_end) : null
  const isEnrollmentActive = (!startDate || now >= startDate) && (!endDate || now <= endDate)
  
  // Check if user is enrolled in this skill
  // The enrollment object has a nested skill object with id
  const enrolledSkillId = enrollment?.skill?.id;
  const isEnrolled = enrollment && enrolledSkillId === skill.id;
  // Check if user has any enrollment (to disable other skills)
  const hasEnrollment = !!enrollment;

  const statusColor = isEnrolled ? "success" : 
                     isLevelAllowed && isEnrollmentActive && !hasEnrollment ? "success" : 
                     !isLevelAllowed ? "danger" : 
                     hasEnrollment ? "default" : "warning"
                     
  const statusText = isEnrolled ? "You are enrolled in this skill" :
                    isLevelAllowed && isEnrollmentActive && !hasEnrollment ? "Available for enrollment" :
                    !isLevelAllowed ? `Not available for ${studentLevel}` :
                    hasEnrollment ? "You can only enroll in one skill at a time" :
                    "Enrollment closed"

  const formatDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : null)

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium">{skill.title}</span>
          </div>
        </ModalHeader>
        <ModalBody>
          {skill.description && (
            <p className="text-sm text-neutral-700">{skill.description}</p>
          )}

          <div className="mt-2">
            <Chip
              color={statusColor as any}
              variant="flat"
              size="sm"
              startContent={statusColor === 'success' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            >
              {statusText}
            </Chip>
          </div>

          {(formatDate(skill.date_range_start) && formatDate(skill.date_range_end)) && (
            <div className="text-xs text-neutral-500 mt-2">
              Enrollment: {formatDate(skill.date_range_start)} - {formatDate(skill.date_range_end)}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onPress={onClose}>Close</Button>
          <Button 
            color={isEnrolled ? "success" : "primary"} 
            isDisabled={!isEnrolled && (!isLevelAllowed || !isEnrollmentActive || hasEnrollment)} 
            onPress={() => onEnroll(skill.id)}
          >
            {isEnrolled ? 'View Enrollment' : 
             (!isLevelAllowed || !isEnrollmentActive || hasEnrollment) ? 'Not Available' : 'Enroll'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


