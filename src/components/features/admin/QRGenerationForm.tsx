"use client"
import React from "react"

/**
 * * QRGenerationForm
 * Generate QR codes for mentor/group combinations.
 * TODO: Build form for mode (single/multiple), group, mentor, date, number of codes, points per scan.
 *
 * Props:
 * - groups: Array<{ id: string; name: string }>
 * - mentors: Array<{ id: string; name: string }>
 * - onGenerate: (payload: any) => void // TODO: Replace any with concrete type when backend contracts are finalized
 */
export type QRGenerationFormProps = {
  groups: Array<{ id: string; name: string }>
  mentors: Array<{ id: string; name: string }>
  onGenerate: (payload: unknown) => void
}

export default function QRGenerationForm(_props: QRGenerationFormProps) {
  // TODO: Implement form UI, validation, and submission
  return <div>{/* TODO: QRGenerationForm UI */}</div>
}


