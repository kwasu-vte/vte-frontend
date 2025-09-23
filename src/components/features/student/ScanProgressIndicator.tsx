"use client"
import React from "react"

/**
 * * ScanProgressIndicator
 * Shows scanning progress for the day.
 * TODO: Implement progress bar and text like "Scanned 2 of 3 required QR codes".
 *
 * Props:
 * - requiredScans: number
 * - completedScans: number
 * - date: string
 */
export type ScanProgressIndicatorProps = {
  requiredScans: number
  completedScans: number
  date: string
}

export default function ScanProgressIndicator(_props: ScanProgressIndicatorProps) {
  // TODO: Render progress bar and counts
  return <div>{/* TODO: ScanProgressIndicator UI */}</div>
}


