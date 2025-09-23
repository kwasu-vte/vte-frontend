"use client"
import React from "react"

/**
 * * MentorSkillAssignment
 * Two-column transfer list to assign/remove skills for a mentor.
 * TODO: Build available ↔ assigned lists, counts per skill, primary/secondary indicators.
 *
 * Props:
 * - mentorId: string
 * - assignedSkills: Array<{ id: string; name: string; isPrimary?: boolean; studentCount?: number }>
 * - availableSkills: Array<{ id: string; name: string; studentCount?: number }>
 * - onChange: (nextAssigned: string[]) => void
 */
export type MentorSkillAssignmentProps = {
  mentorId: string
  assignedSkills: Array<{ id: string; name: string; isPrimary?: boolean; studentCount?: number }>
  availableSkills: Array<{ id: string; name: string; studentCount?: number }>
  onChange: (nextAssigned: string[]) => void
}

export default function MentorSkillAssignment(_props: MentorSkillAssignmentProps) {
  // TODO: Implement transfer list UI and handlers
  return <div>{/* TODO: MentorSkillAssignment UI */}</div>
}


