"use client"
import React from "react"

/**
 * * UpcomingPracticals
 * List of next 3-5 upcoming practicals with countdown.
 * TODO: Render list with venue and mentor info; show configurable limit.
 *
 * Props:
 * - practicals: Array<{ id: string; date: string; venue?: string; mentor?: string }>
 * - limit?: number
 */
export type UpcomingPracticalsProps = {
  practicals: Array<{ id: string; date: string; venue?: string; mentor?: string }>
  limit?: number
}

export default function UpcomingPracticals(_props: UpcomingPracticalsProps) {
  // TODO: Render upcoming list with countdown
  return <div>{/* TODO: UpcomingPracticals UI */}</div>
}


