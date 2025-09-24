"use client"
import React, { useMemo } from "react"
import { Chip } from "@nextui-org/react"
import type { AcademicSession } from "@/lib/types"

/**
 * * SessionStatusBadge
 * Visual indicator for session status derived from `AcademicSession.active` and dates.
 */
export type SessionStatusBadgeProps = {
  session: Pick<AcademicSession, 'active' | 'starts_at' | 'ends_at'>
  showDates?: boolean
}

export default function SessionStatusBadge({ session, showDates = false }: SessionStatusBadgeProps) {
  const { color, label, description } = useMemo(() => {
    const now = new Date()
    const start = session.starts_at ? new Date(session.starts_at) : null
    const end = session.ends_at ? new Date(session.ends_at) : null

    if (session.active) {
      return { color: "success" as const, label: "Active", description: start ? `since ${start.toLocaleDateString()}` : undefined }
    }

    if (end && end < now) {
      return { color: "warning" as const, label: "Expired", description: `ended ${end.toLocaleDateString()}` }
    }

    return { color: "default" as const, label: "Inactive", description: start ? `starts ${start.toLocaleDateString()}` : undefined }
  }, [session.active, session.ends_at, session.starts_at])

  return (
    <div className="flex items-center gap-2">
      <Chip color={color} variant="flat">
        {label}
      </Chip>
      {showDates && description && (
        <span className="text-sm text-neutral-600">{description}</span>
      )}
    </div>
  )
}


