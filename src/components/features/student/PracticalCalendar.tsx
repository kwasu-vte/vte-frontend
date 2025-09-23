"use client"
import React from "react"

/**
 * * PracticalCalendar
 * Calendar view of practical sessions highlighting student's practical dates.
 * TODO: Implement month/week view; show venue/time on hover/click.
 *
 * Props:
 * - practicalDates: Array<{ date: string; venue?: string; time?: string }>
 * - viewMode?: 'month' | 'week'
 */
export type PracticalCalendarProps = {
  practicalDates: Array<{ date: string; venue?: string; time?: string }>
  viewMode?: 'month' | 'week'
}

export default function PracticalCalendar(_props: PracticalCalendarProps) {
  // TODO: Render calendar UI
  return <div>{/* TODO: PracticalCalendar UI */}</div>
}


