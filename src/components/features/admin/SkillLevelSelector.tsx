"use client"
import React from "react"

/**
 * * SkillLevelSelector
 * Multi-select checkbox group for allowed student levels.
 * TODO: Build checkbox group for levels [100,200,300,400,500]; show counts if available.
 *
 * Props:
 * - selectedLevels: number[]
 * - onChange: (levels: number[]) => void
 * - showCounts?: boolean
 */
export type SkillLevelSelectorProps = {
  selectedLevels: number[]
  onChange: (levels: number[]) => void
  showCounts?: boolean
}

export default function SkillLevelSelector(_props: SkillLevelSelectorProps) {
  // TODO: Render checkbox list and manage selection state
  return <div>{/* TODO: SkillLevelSelector UI */}</div>
}


