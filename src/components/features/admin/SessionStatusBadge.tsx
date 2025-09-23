"use client"
import React from "react"

/**
 * * SessionStatusBadge
 * Visual indicator for session status.
 * TODO: Style badge with green (active), gray (inactive), orange (expired). Optionally show dates.
 *
 * Props:
 * - session: { status: 'active' | 'inactive' | 'expired'; starts_at?: string; ends_at?: string }
 * - showDates?: boolean
 */
export type SessionStatusBadgeProps = {
  session: { status: "active" | "inactive" | "expired"; starts_at?: string; ends_at?: string }
  showDates?: boolean
}

export default function SessionStatusBadge(_props: SessionStatusBadgeProps) {
  // TODO: Render styled badge and optional dates
  return <span>{/* TODO: Status badge */}</span>
}


