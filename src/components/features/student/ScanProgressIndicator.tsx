"use client"
import React from "react"
import { Chip } from "@nextui-org/react"

/**
 * * ScanProgressIndicator
 * Shows scanning progress for the day.
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

export default function ScanProgressIndicator({ requiredScans, completedScans, date }: ScanProgressIndicatorProps) {
  const clampedCompleted = Math.max(0, Math.min(completedScans, requiredScans))
  const percent = requiredScans > 0 ? Math.round((clampedCompleted / requiredScans) * 100) : 0
  const remaining = Math.max(0, requiredScans - clampedCompleted)

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">{new Date(date).toLocaleDateString()}</p>
        <Chip color={remaining === 0 ? "success" : "warning"} variant="flat">
          {clampedCompleted} / {requiredScans}
        </Chip>
      </div>
      <div className="w-full h-2 rounded-lg bg-neutral-200">
        <div
          className="h-2 rounded-lg bg-primary"
          style={{ width: `${percent}%`, transition: "width 200ms ease" }}
        />
      </div>
      <p className="text-xs text-neutral-500">{remaining === 0 ? "All scans completed" : `${remaining} scans remaining`}</p>
    </div>
  )
}


