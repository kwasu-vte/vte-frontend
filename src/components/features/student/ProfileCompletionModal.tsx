"use client"
import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@heroui/react"
import Link from "next/link"

export type ProfileCompletionModalProps = {
  profile: Partial<{ matric_number: string; student_level: string; department: string; faculty: string | null; phone: string | null; gender: string | null }>
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
    // Faculty optional
    if (!hasPhone) fields.push("Phone Number")
    if (!hasGender) fields.push("Gender")

    console.log('[ProfileCompletionModal] completeness-check', {
      values: {
        matric_number: profile.matric_number,
        student_level: profile.student_level,
        department: profile.department,
        faculty: profile.faculty,
        phone: profile.phone,
        gender: profile.gender,
      },
      flags: { hasMatric, hasLevel, hasDepartment, hasPhone, hasGender },
      missingFields: [...fields],
    })

    return fields
  }, [profile])

  const isIncomplete = missingFields.length > 0

  // * Modal stays open and non-dismissible until user completes profile
  return (
    <Dialog open={isIncomplete}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>
            Please complete your student profile to continue using the dashboard features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isIncomplete && (
            <div className="rounded-md border border-warning-200 bg-warning-50 p-3 text-sm text-warning-800">
              Missing: {missingFields.join(", ")}
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button as={Link} href="/student/profile" color="warning" variant="solid">
              Go to Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ProfileCompletionModal }
export default ProfileCompletionModal


