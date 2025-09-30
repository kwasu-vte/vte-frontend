"use client"
import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react"
import { BookOpen, AlertCircle, CheckCircle } from "lucide-react"

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
}

export default function SkillDetailModal({ isOpen, onClose, onEnroll, skill, studentLevel }: SkillDetailModalProps) {
  if (!skill) return null

  const isLevelAllowed = !skill.allowed_levels || skill.allowed_levels.includes(studentLevel)
  const now = new Date()
  const startDate = skill.date_range_start ? new Date(skill.date_range_start) : null
  const endDate = skill.date_range_end ? new Date(skill.date_range_end) : null
  const isEnrollmentActive = (!startDate || now >= startDate) && (!endDate || now <= endDate)

  const statusColor = isLevelAllowed && isEnrollmentActive ? "success" : (!isLevelAllowed ? "danger" : "warning")
  const statusText = isLevelAllowed && isEnrollmentActive ? "Available" : (!isLevelAllowed ? `Not available for ${studentLevel}` : "Enrollment closed")

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
          <Button color="primary" isDisabled={!isLevelAllowed || !isEnrollmentActive} onPress={() => onEnroll(skill.id)}>
            {(!isLevelAllowed || !isEnrollmentActive) ? 'Not Available' : 'Enroll'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


