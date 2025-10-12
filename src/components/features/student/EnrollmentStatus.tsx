"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react"
import { BookOpen, CreditCard, Users, CheckCircle2 } from "lucide-react"

export type EnrollmentStatusProps = {
  enrollment: { 
    id: string
    skillName: string
    status: 'SELECTED' | 'PAID' | 'ASSIGNED' | 'ACTIVE'
    paymentStatus?: string
    group?: string 
  }
  showTimeline?: boolean
}

const statusConfig = {
  SELECTED: { color: 'default' as const, label: 'Selected', icon: BookOpen },
  PAID: { color: 'warning' as const, label: 'Paid', icon: CreditCard },
  ASSIGNED: { color: 'primary' as const, label: 'Assigned', icon: Users },
  ACTIVE: { color: 'success' as const, label: 'Active', icon: CheckCircle2 }
}

function EnrollmentStatus({ enrollment, showTimeline = true }: EnrollmentStatusProps) {
  const config = statusConfig[enrollment.status]
  const Icon = config.icon
  const currentIndex = ["SELECTED", "PAID", "ASSIGNED", "ACTIVE"].indexOf(enrollment.status)

  return (
    <Card shadow="sm" className="w-full border border-neutral-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-start gap-3">
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
              ${config.color === 'success' ? 'bg-success-100 text-success-600' :
                config.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                config.color === 'warning' ? 'bg-warning-100 text-warning-600' :
                'bg-neutral-100 text-neutral-600'}
            `}>
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-medium mb-1">Current Enrollment</p>
              <h3 className="text-base font-semibold text-neutral-900 leading-tight">
                {enrollment.skillName}
              </h3>
            </div>
          </div>
          <Chip 
            color={config.color} 
            variant="flat"
            size="sm"
            classNames={{
              base: 'h-7',
              content: 'text-xs font-semibold px-2'
            }}
          >
            {config.label}
          </Chip>
        </div>
      </CardHeader>

      {(enrollment.paymentStatus || enrollment.group) && (
        <>
          <Divider />
          <CardBody className="py-4">
            <div className="flex flex-wrap gap-4 text-sm">
              {enrollment.paymentStatus && (
                <div>
                  <span className="text-neutral-500">Payment: </span>
                  <span className="font-medium text-neutral-900 capitalize">
                    {enrollment.paymentStatus}
                  </span>
                </div>
              )}
              {enrollment.group && (
                <div>
                  <span className="text-neutral-500">Group: </span>
                  <span className="font-medium text-neutral-900">
                    {enrollment.group}
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </>
      )}

      {showTimeline && (
        <>
          <Divider />
          <CardBody className="pt-4 pb-5">
            <div className="flex items-center justify-between gap-2">
              {(["SELECTED", "PAID", "ASSIGNED", "ACTIVE"] as const).map((step, idx) => {
                const isReached = idx <= currentIndex
                const isCurrent = idx === currentIndex
                
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className={`
                        w-2 h-2 rounded-full transition-all
                        ${isCurrent ? 'w-2.5 h-2.5' : ''}
                        ${isReached ? 'bg-primary-500' : 'bg-neutral-300'}
                      `} />
                      <span className={`
                        text-[10px] font-medium uppercase tracking-wide text-center
                        ${isReached ? 'text-neutral-900' : 'text-neutral-400'}
                      `}>
                        {step}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div className={`
                        h-[2px] flex-1 transition-all
                        ${idx < currentIndex ? 'bg-primary-500' : 'bg-neutral-200'}
                      `} />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </CardBody>
        </>
      )}
    </Card>
  )
}

export { EnrollmentStatus }
export default EnrollmentStatus