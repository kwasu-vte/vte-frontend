"use client"
import React from "react"
import { Card, CardBody, Button } from "@heroui/react"
import { AlertCircle, X } from "lucide-react"
import Link from "next/link"

export type ProfileCompletionAlertProps = {
  profile: Partial<{ 
    matric_number: string
    student_level: string
    department: string
    faculty: string | null
    phone: string | null
    gender: string | null 
  }>
  dismissible?: boolean
  onDismiss?: () => void
}

function ProfileCompletionAlert({ profile, dismissible = true, onDismiss }: ProfileCompletionAlertProps) {
  const [isDismissed, setIsDismissed] = React.useState(false)

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
    if (!hasPhone) fields.push("Phone Number")
    if (!hasGender) fields.push("Gender")
    
    return fields
  }, [profile])

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed || missingFields.length === 0) {
    return null
  }

  return (
    <Card 
      shadow="none"
      className="border-2 border-warning-300 bg-warning-50"
    >
      <CardBody className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5 text-warning-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-warning-900 mb-1">
              Complete Your Profile
            </h3>
            <p className="text-sm text-warning-800">
              Please add the following information: <span className="font-medium">{missingFields.join(", ")}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              as={Link}
              href="/student/profile"
              color="warning"
              size="sm"
              className="font-medium"
            >
              Complete Now
            </Button>
            {dismissible && (
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={handleDismiss}
                className="text-warning-700 hover:bg-warning-100"
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { ProfileCompletionAlert }
export default ProfileCompletionAlert