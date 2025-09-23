"use client"
import React from "react"

/**
 * * MentorGroupsList
 * Grid/list of groups in mentor's assigned skills.
 * TODO: Implement grid/list toggle; show group number, student count, next practical; onSelectGroup.
 *
 * Props:
 * - groups: Array<{ id: string; groupNumber: number; studentCount: number; nextPractical?: string }>
 * - viewMode?: 'grid' | 'list'
 * - onSelectGroup: (groupId: string) => void
 */
export type MentorGroupsListProps = {
  groups: Array<{ id: string; groupNumber: number; studentCount: number; nextPractical?: string }>
  viewMode?: "grid" | "list"
  onSelectGroup: (groupId: string) => void
}

export default function MentorGroupsList(_props: MentorGroupsListProps) {
  // TODO: Render groups in chosen view mode
  return <div>{/* TODO: MentorGroupsList UI */}</div>
}


