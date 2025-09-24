"use client"
import React from "react"

/**
 * * ProfileView
 * Read-only display of student profile with completion status indicator.
 * TODO: Render all profile fields and a completion badge.
 *
 * Props:
 * - profile: { matric_number: string; level: number; department: string; faculty: string; phone: string; gender: string }
 * - showCompletionBadge?: boolean
 */
export type ProfileViewProps = {
  profile: { matric_number: string; level: number; department: string; faculty: string; phone: string; gender: string }
  showCompletionBadge?: boolean
}

export default function ProfileView({ profile, showCompletionBadge = true }: ProfileViewProps) {
  const fields = [
    { label: 'Matric Number', value: profile.matric_number },
    { label: 'Level', value: String(profile.level) },
    { label: 'Department', value: profile.department },
    { label: 'Faculty', value: profile.faculty },
    { label: 'Phone', value: profile.phone },
    { label: 'Gender', value: profile.gender },
  ]

  const completed = fields.every((f) => f.value && String(f.value).trim().length > 0)

  return (
    <div className="space-y-4">
      {showCompletionBadge && (
        <div className="flex items-center gap-2">
          <span className={`text-sm px-2 py-1 rounded ${completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {completed ? 'Profile Complete' : 'Profile Incomplete'}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label} className="p-3 rounded border border-neutral-200 bg-white">
            <div className="text-sm text-neutral-500">{f.label}</div>
            <div className="text-neutral-900 font-medium mt-1">{f.value || <span className="italic text-neutral-400">Not provided</span>}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


