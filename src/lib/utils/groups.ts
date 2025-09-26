/**
 * * groups.ts utilities (placeholders)
 * TODO: Implement group capacity, utilization, and assignment checks.
 */

export type SkillGroup = { id: string; current: number; max: number }
export type CapacityInfo = { current: number; max: number; percent: number }
export type UtilizationStats = { total: number; capacity: number; percent: number }
export type Enrollment = { id: string; paid?: boolean }

export function calculateGroupCapacity(group: SkillGroup): CapacityInfo {
  const percent = group.max > 0 ? Math.min(100, Math.round((group.current / group.max) * 100)) : 0
  return { current: group.current, max: group.max, percent }
}

export function getGroupUtilization(groups: SkillGroup[]): UtilizationStats {
  const total = groups.reduce((sum, g) => sum + g.current, 0)
  const capacity = groups.reduce((sum, g) => sum + g.max, 0)
  const percent = capacity > 0 ? Math.min(100, Math.round((total / capacity) * 100)) : 0
  return { total, capacity, percent }
}

export function canAssignToGroup(group: SkillGroup, enrollment: Enrollment): boolean {
  // TODO: Check paid status and capacity
  return (enrollment.paid ?? false) && group.current < group.max
}


