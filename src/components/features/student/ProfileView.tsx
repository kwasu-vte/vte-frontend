"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Divider } from "@heroui/react"
import { User, GraduationCap, Building, Phone, Users } from "lucide-react"

/**
 * * ProfileView
 * Read-only display of student profile information.
 * Improved UI with better information hierarchy and cleaner layout.
 *
 * Props:
 * - profile: StudentProfile
 * - showCompletionBadge?: boolean (deprecated - kept for backward compatibility)
 */
export type ProfileViewProps = {
  profile: {
    matric_number: string
    student_level: string
    department: string
    faculty: string | null
    phone: string | null
    gender: string | null
    full_name?: string
    attendances_count?: string
    enrollments_count?: string
  }
  showCompletionBadge?: boolean
}

function ProfileView({ profile }: ProfileViewProps) {
  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-neutral-900">
              Personal Information
            </h2>
          </div>
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <InfoField 
            icon={User}
            label="Full Name"
            value={profile.full_name || "Not provided"}
            isComplete={!!profile.full_name}
          />
          <InfoField 
            icon={GraduationCap}
            label="Matric Number"
            value={profile.matric_number}
            isComplete={true}
          />
          <InfoField 
            icon={GraduationCap}
            label="Level"
            value={profile.student_level}
            isComplete={true}
          />
          <InfoField 
            icon={Building}
            label="Department"
            value={profile.department}
            isComplete={true}
          />
          <InfoField 
            icon={Building}
            label="Faculty"
            value={profile.faculty || "Not specified"}
            isComplete={!!profile.faculty}
          />
          <InfoField 
            icon={Phone}
            label="Phone Number"
            value={profile.phone || "Not provided"}
            isComplete={!!profile.phone}
          />
          <InfoField 
            icon={Users}
            label="Gender"
            value={profile.gender || "Not specified"}
            isComplete={!!profile.gender}
          />
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * * InfoField
 * Individual field display component with icon, label, and value
 */
function InfoField({ 
  icon: Icon, 
  label, 
  value, 
  isComplete 
}: { 
  icon: any
  label: string
  value: string
  isComplete: boolean 
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-neutral-400 mt-0.5">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-600 mb-0.5">{label}</p>
        <p className={`text-sm font-medium ${isComplete ? 'text-neutral-900' : 'text-neutral-400 italic'} truncate`}>
          {value}
        </p>
      </div>
    </div>
  )
}

export { ProfileView }
export default ProfileView