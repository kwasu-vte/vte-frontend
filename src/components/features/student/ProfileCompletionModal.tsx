"use client"
import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export type ProfileCompletionModalProps = {
  profile: Partial<{ 
    matric_number: string
    student_level: string
    department: string
    faculty: string | null
    phone: string | null
    gender: string | null 
  }>
}

function ProfileCompletionModal({ profile }: ProfileCompletionModalProps) {
  const missingFields = React.useMemo(() => {
    const fields: string[] = []
    const hasMatric = Boolean((profile.matric_number || '').toString().trim())
    const hasLevel = Boolean((profile.student_level || '').toString().trim())
    const hasDepartment = Boolean((profile.department || '').toString().trim())
    const hasPhone = Boolean((profile.phone || '').toString().trim())
    const hasGender = Boolean((profile.gender || '').toString().trim())

    if (!hasMatric) fields.push("Matric Number")
    if (!hasLevel) fields.push("Level")
    if (!hasDepartment) fields.push("Department")
    if (!hasPhone) fields.push("Phone Number")
    if (!hasGender) fields.push("Gender")

    return fields
  }, [profile])

  const isIncomplete = missingFields.length > 0

  return (
    <Modal 
      isOpen={isIncomplete}
      isDismissable={false}
      hideCloseButton
      size="md"
      backdrop="opaque"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 pb-2">
          <AlertCircle className="h-5 w-5 text-warning-600" />
          <span>Complete Your Profile</span>
        </ModalHeader>
        
        <ModalBody className="pt-2">
          <p className="text-sm text-default-600 mb-4">
            Please complete your student profile to access all dashboard features and enroll in skills.
          </p>
          
          {isIncomplete && (
            <div className="rounded-lg border-2 border-warning-300 bg-warning-50 p-4">
              <p className="text-sm font-medium text-warning-900 mb-2">
                Missing Information:
              </p>
              <ul className="space-y-1">
                {missingFields.map((field) => (
                  <li key={field} className="text-sm text-warning-800 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning-600" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter className="pt-2">
          <Button 
            as={Link} 
            href="/student/profile" 
            color="warning"
            className="w-full font-medium"
          >
            Go to Profile Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProfileCompletionModal }
export default ProfileCompletionModal