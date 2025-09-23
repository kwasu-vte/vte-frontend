"use client"
import React from "react"

/**
 * * ProfileForm
 * One-time profile creation form.
 * TODO: Build form with fields: matric_number, level, department, faculty, phone, gender; validate all required and matric format.
 * Shows warning: "Check carefully - cannot edit later".
 *
 * Props:
 * - onSubmit: (data: any) => void // TODO: Replace any with concrete type
 * - initialData?: Partial<{ matric_number: string; level: number; department: string; faculty: string; phone: string; gender: string }>
 */
export type ProfileFormProps = {
  onSubmit: (data: unknown) => void
  initialData?: Partial<{ matric_number: string; level: number; department: string; faculty: string; phone: string; gender: string }>
}

export default function ProfileForm(_props: ProfileFormProps) {
  // TODO: Render profile form and validation
  return <div>{/* TODO: ProfileForm UI */}</div>
}


