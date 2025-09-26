"use client"
import React from "react"
import { Chip, Progress, Tooltip } from "@nextui-org/react"

/**
 * * GroupCapacityIndicator
 * Visual progress bar showing group fill status with color coding.
 * TODO: Implement progress bar and sizing variants.
 *
 * Props:
 * - current: number
 * - max: number
 * - showPercentage?: boolean
 * - size?: 'sm' | 'md' | 'lg'
 */
export type GroupCapacityIndicatorProps = {
  current: number
  max: number
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
}

export default function GroupCapacityIndicator(props: GroupCapacityIndicatorProps) {
  const { current, max, showPercentage = true, size = "md" } = props

  // * Guard: prevent divide-by-zero and negative numbers
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1
  const safeCurrent = Math.max(0, Math.min(current, safeMax))
  const ratio = safeCurrent / safeMax
  const percentage = Math.round(ratio * 100)

  // * Semantic color thresholds per design guide (success/warning/danger)
  const color: "success" | "warning" | "danger" =
    ratio < 0.7 ? "success" : ratio < 0.9 ? "warning" : "danger"

  // * Map size to Progress size
  const progressSize: "sm" | "md" | "lg" = size

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <Tooltip content={`${safeCurrent}/${safeMax}`} placement="top" closeDelay={0}>
          <Progress
            aria-label="Group capacity"
            value={percentage}
            color={color}
            size={progressSize}
            className="w-full"
          />
        </Tooltip>
      </div>
      <Chip color={color} variant="flat" size={size === "lg" ? "md" : "sm"}>
        {showPercentage ? `${percentage}%` : `${safeCurrent}/${safeMax}`}
      </Chip>
    </div>
  )
}


