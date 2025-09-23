"use client"
import React from "react"

/**
 * * SessionsTable
 * Displays all academic sessions in a table with status badges and actions.
 * TODO: Implement table UI, integrate with data fetching, and wire up actions.
 *
 * Props:
 * - sessions: Array of sessions
 * - onStartSession: (id: string) => void
 * - onEndSession: (id: string) => void
 * - onEdit: (sessionId: string) => void
 */
export type AdminSession = {
  id: string
  name: string
  starts_at: string
  ends_at: string
  status: "active" | "inactive" | "expired"
}

export type SessionsTableProps = {
  sessions: AdminSession[]
  onStartSession: (id: string) => void
  onEndSession: (id: string) => void
  onEdit: (id: string) => void
}

export default function SessionsTable(_props: SessionsTableProps) {
  // TODO: Render table with columns: Name, Start Date, End Date, Status, Actions
  // TODO: Show badge for currently active session
  // TODO: Use shared DataTable if available
  return (
    <div>{/* TODO: SessionsTable UI */}</div>
  )
}


