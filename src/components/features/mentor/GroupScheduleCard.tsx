"use client"
import React from "react"

/**
 * * GroupScheduleCard
 * Shows upcoming practical sessions for a group with countdown to next session.
 * TODO: Implement list of dates/times and countdown; highlight next session.
 *
 * Props:
 * - group: { id: string; name: string }
 * - practicalDates: Array<{ date: string; time?: string; venue?: string }>
 * - highlightNext?: boolean
 */
export type GroupScheduleCardProps = {
  group: { id: string; name: string }
  practicalDates: Array<{ date: string; time?: string; venue?: string }>
  highlightNext?: boolean
}

export default function GroupScheduleCard(_props: GroupScheduleCardProps) {
  // TODO: Render schedule and countdown
  return <div>{/* TODO: GroupScheduleCard UI */}</div>
}


