/**
 * * enrollment.ts utilities (placeholders)
 * TODO: Implement enrollment status calculation and rules.
 */

export type Enrollment = { id: string; status: string; paid?: boolean }
export type EnrollmentStatus = "PENDING" | "PAID" | "ASSIGNED" | "COMPLETED"
export type Student = { id: string; level?: number }
export type Skill = { id: string; title: string; allowedLevels?: number[] }

export function getEnrollmentStatus(enrollment: Enrollment): EnrollmentStatus {
  // TODO: Map internal status to display status
  if (enrollment.status === "completed") return "COMPLETED"
  if (enrollment.status === "assigned") return "ASSIGNED"
  if (enrollment.paid) return "PAID"
  return "PENDING"
}

export function canEnrollInSkill(_student: Student, _skill: Skill): { can: boolean; reason?: string } {
  // TODO: Validate level and capacity constraints
  return { can: true }
}

export function isPaymentRequired(enrollment: Enrollment): boolean {
  // TODO: Determine if payment is required based on status/rules
  return !enrollment.paid
}


