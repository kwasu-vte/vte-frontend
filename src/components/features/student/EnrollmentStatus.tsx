"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip } from "@heroui/react"

/**
 * * EnrollmentStatus
 * Current enrollment status display with optional timeline.
 *
 * Props:
 * - enrollment: { id: string; skillName: string; status: 'SELECTED' | 'PAID' | 'ASSIGNED' | 'ACTIVE'; paymentStatus?: string; group?: string }
 * - showTimeline?: boolean
 */
export type EnrollmentStatusProps = {
  enrollment: { id: string; skillName: string; status: 'SELECTED' | 'PAID' | 'ASSIGNED' | 'ACTIVE'; paymentStatus?: string; group?: string }
  showTimeline?: boolean
}

const statusColor: Record<EnrollmentStatusProps["enrollment"]["status"], "default" | "warning" | "success" | "primary"> = {
  SELECTED: "default",
  PAID: "warning",
  ASSIGNED: "primary",
  ACTIVE: "success",
}

function EnrollmentStatus({ enrollment, showTimeline = true }: EnrollmentStatusProps) {
  const currentIndex = ["SELECTED", "PAID", "ASSIGNED", "ACTIVE"].indexOf(enrollment.status)

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Enrollment</p>
          <p className="text-xl font-medium leading-normal">{enrollment.skillName}</p>
        </div>
        <Chip color={statusColor[enrollment.status]} variant="solid">{enrollment.status}</Chip>
      </CardHeader>
      <CardBody className="space-y-3">
        {enrollment.paymentStatus && (enrollment.status === 'SELECTED' || enrollment.status === 'PAID') && (
          <p className="text-sm text-neutral-600">Payment: {enrollment.paymentStatus}</p>
        )}
        {enrollment.group && (
          <p className="text-sm text-neutral-600">Group: {enrollment.group}</p>
        )}
        {showTimeline && (
          <div className="mt-1">
            <div className="flex items-center gap-3">
              {(["SELECTED", "PAID", "ASSIGNED", "ACTIVE"] as const).map((step, idx) => {
                const reached = idx <= currentIndex
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${reached ? "bg-primary" : "bg-neutral-300"}`} />
                    <span className={`text-xs ${reached ? "text-neutral-900" : "text-neutral-400"}`}>{step}</span>
                    {idx < 3 && <div className={`w-8 h-0.5 ${idx < currentIndex ? "bg-primary" : "bg-neutral-300"}`} />}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export { EnrollmentStatus }
export default EnrollmentStatus
