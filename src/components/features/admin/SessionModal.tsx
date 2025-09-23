"use client"
import React from "react"

/**
 * * SessionModal
 * Form for creating/editing academic session.
 * TODO: Build form with fields: name, starts_at, ends_at; add validation (future dates, end > start).
 *
 * Props:
 * - mode: 'create' | 'edit'
 * - session?: { id: string; name: string; starts_at: string; ends_at: string }
 * - onSubmit: (data: { name: string; starts_at: string; ends_at: string }) => void
 * - onClose: () => void
 */
export type SessionModalProps = {
  mode: "create" | "edit"
  session?: { id: string; name: string; starts_at: string; ends_at: string }
  onSubmit: (data: { name: string; starts_at: string; ends_at: string }) => void
  onClose: () => void
}

export default function SessionModal(_props: SessionModalProps) {
  // TODO: Implement modal UI and form logic
  return <div>{/* TODO: SessionModal UI */}</div>
}


