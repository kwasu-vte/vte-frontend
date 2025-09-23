"use client"
import React from "react"

/**
 * * ScanConfirmationModal
 * Shown after successful scan with points earned and remaining scans.
 * TODO: Implement modal with details and close action.
 *
 * Props:
 * - scanResult: { points: number; mentorName?: string }
 * - remainingScans: number
 * - onClose: () => void
 */
export type ScanConfirmationModalProps = {
  scanResult: { points: number; mentorName?: string }
  remainingScans: number
  onClose: () => void
}

export default function ScanConfirmationModal(_props: ScanConfirmationModalProps) {
  // TODO: Render confirmation details
  return <div>{/* TODO: ScanConfirmationModal UI */}</div>
}


