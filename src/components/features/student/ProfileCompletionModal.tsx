"use client"
import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@nextui-org/react"
import Link from "next/link"

export type ProfileCompletionModalProps = {
  profile: Partial<{ matric_number: string; student_level: string; department: string; faculty: string | null; phone: string | null; gender: string | null }>
}

function ProfileCompletionModal({ profile }: ProfileCompletionModalProps) {
  const missingFields = React.useMemo(() => {
    const hasMatric = Boolean((profile.matric_number || '').toString().trim())
    return hasMatric ? [] : ["Matric Number"]
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


