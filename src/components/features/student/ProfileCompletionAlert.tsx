"use client"
import React from "react"
import { Card, CardBody, Button } from "@heroui/react"
import { AlertTriangle, X } from "lucide-react"
import Link from "next/link"

/**
 * * ProfileCompletionAlert
 * Alert banner for incomplete profiles with link to complete profile.
 * Shows missing fields and provides quick access to profile completion.
 *
 * Props:
 * - profile: Partial<{ matric_number: string; level: number; department: string; faculty: string; phone: string; gender: string }>
 * - dismissible?: boolean
 * - onDismiss?: () => void
 */
export type ProfileCompletionAlertProps = {
  profile: Partial<{ matric_number: string; student_level: string; department: string; faculty: string | null; phone: string | null; gender: string | null }>
  dismissible?: boolean
  onDismiss?: () => void
}

function ProfileCompletionAlert({ profile, dismissible = true, onDismiss }: ProfileCompletionAlertProps) {
  const [isDismissed, setIsDismissed] = React.useState(false)

  // Determine missing fields
  const missingFields = React.useMemo(() => {
    const fields = [] as string[]
    const hasMatric = Boolean((profile.matric_number || '').toString().trim())
    const hasLevel = Boolean((profile.student_level || '').toString().trim())
    const hasDepartment = Boolean((profile.department || '').toString().trim())
    const hasPhone = Boolean((profile.phone || '').toString().trim())
    const hasGender = Boolean((profile.gender || '').toString().trim())

    if (!hasMatric) fields.push("Matric Number")
    if (!hasLevel) fields.push("Level")
    if (!hasDepartment) fields.push("Department")
    // Faculty is treated as optional; remove if business requires it
    if (!hasPhone) fields.push("Phone Number")
    if (!hasGender) fields.push("Gender")
    console.log('[ProfileCompletionAlert] completeness-check', {
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

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  // Don't render if dismissed or no missing fields
  if (isDismissed || missingFields.length === 0) {
    return null
  }

  return (
    <Card className="border-warning bg-warning-50" id="student-profile">
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div>
            <p className="text-sm font-medium text-warning-800">
              Complete Your Profile
            </p>
            <p className="text-xs text-warning-700">
              Missing: {missingFields.join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            href="/student/profile"
            color="warning"
            variant="solid"
            size="sm"
            className="text-xs"
          >
            Complete Profile
          </Button>
          {dismissible && (
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-warning-600 hover:text-warning-800"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export { ProfileCompletionAlert }
export default ProfileCompletionAlert
