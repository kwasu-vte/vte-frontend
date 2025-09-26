"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react"
import { User, GraduationCap, Building, Phone, Users, CheckCircle, AlertTriangle } from "lucide-react"

/**
 * * ProfileView
 * Read-only display of student profile with completion status indicator.
 * Follows design guide with NextUI components and proper styling.
 *
 * Props:
 * - profile: StudentProfile
 * - showCompletionBadge?: boolean
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

function ProfileView({ profile, showCompletionBadge = true }: ProfileViewProps) {
  const fields = [
    { 
      label: 'Matric Number', 
      value: profile.matric_number,
      icon: GraduationCap
    },
    { 
      label: 'Student Level', 
      value: profile.student_level,
      icon: GraduationCap
    },
    { 
      label: 'Department', 
      value: profile.department,
      icon: Building
    },
    { 
      label: 'Faculty', 
      value: profile.faculty || 'Not specified',
      icon: Building
    },
    { 
      label: 'Phone Number', 
      value: profile.phone || 'Not provided',
      icon: Phone
    },
    { 
      label: 'Gender', 
      value: profile.gender || 'Not specified',
      icon: Users
    },
  ]

  const completed = fields.every((f) => f.value && f.value !== 'Not provided' && f.value !== 'Not specified')

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <p className="text-xl font-medium leading-normal">Profile Information</p>
        </div>
        {showCompletionBadge && (
          <Chip
            color={completed ? "success" : "warning"}
            variant="flat"
            startContent={completed ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
          >
            {completed ? 'Profile Complete' : 'Profile Incomplete'}
          </Chip>
        )}
      </CardHeader>
      
      <Divider />
      
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-3">
              <div className="text-neutral-400 mt-1">
                <field.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-600 mb-1">{field.label}</p>
                <p className="text-neutral-900 font-medium">
                  {field.value || <span className="italic text-neutral-400">Not provided</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        {(profile.attendances_count || profile.enrollments_count) && (
          <>
            <Divider className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.enrollments_count && (
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{profile.enrollments_count}</p>
                  <p className="text-sm text-primary-700">Total Enrollments</p>
                </div>
              )}
              {profile.attendances_count && (
                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <p className="text-2xl font-bold text-success">{profile.attendances_count}</p>
                  <p className="text-sm text-success-700">Attendance Records</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}

export { ProfileView }
export default ProfileView
