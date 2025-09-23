"use client"
import React from "react"

/**
 * * SkillSelectionGrid
 * Grid of available skills for student's level.
 * TODO: Render cards with title, description, enrolled count; disabled state with reason.
 *
 * Props:
 * - availableSkills: Array<{ id: string; title: string; description?: string; enrolledCount?: number; disabledReason?: string }>
 * - studentLevel: number
 * - onSelectSkill: (skillId: string) => void
 */
export type SkillSelectionGridProps = {
  availableSkills: Array<{ id: string; title: string; description?: string; enrolledCount?: number; disabledReason?: string }>
  studentLevel: number
  onSelectSkill: (skillId: string) => void
}

export default function SkillSelectionGrid(_props: SkillSelectionGridProps) {
  // TODO: Render grid of skill cards and selection
  return <div>{/* TODO: SkillSelectionGrid UI */}</div>
}


