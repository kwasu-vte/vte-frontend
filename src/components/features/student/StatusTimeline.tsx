"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react"
import { CheckCircle2, Clock, Circle, CreditCard, Users, Calendar } from "lucide-react"

export type StatusTimelineProps = {
  enrollment: {
    status: string
    payment_status: string
    created_at: string
    updated_at: string
  }
  skill?: {
    title: string
  }
}

function StatusTimeline({ enrollment, skill }: StatusTimelineProps) {
  const steps = [
    {
      id: 'selected',
      title: 'Skill Selected',
      description: 'You have selected a skill for enrollment',
      icon: Calendar,
      status: 'completed'
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Complete payment to secure your enrollment',
      icon: CreditCard,
      status: enrollment.payment_status === 'paid' ? 'completed' : 
              enrollment.payment_status === 'pending' ? 'current' : 'pending'
    },
    {
      id: 'assigned',
      title: 'Group Assignment',
      description: 'You will be assigned to a group after payment',
      icon: Users,
      status: enrollment.status === 'assigned' || enrollment.status === 'paid' ? 'completed' :
              enrollment.status === 'paid' ? 'current' : 'pending'
    },
    {
      id: 'active',
      title: 'Active Enrollment',
      description: 'Start attending practical sessions',
      icon: CheckCircle2,
      status: enrollment.status === 'assigned' ? 'completed' : 'pending'
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card shadow="sm" className="w-full border border-neutral-100">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-lg font-semibold text-neutral-900">Enrollment Progress</h2>
          {skill && (
            <p className="text-sm text-neutral-500">{skill.title}</p>
          )}
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="pt-6 pb-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-8 bottom-8 w-[2px] bg-neutral-200" />
          
          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isCompleted = step.status === 'completed'
              const isCurrent = step.status === 'current'
              const isPending = step.status === 'pending'
              
              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* Icon container */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-success-100 text-success-600' : 
                        isCurrent ? 'bg-primary-100 text-primary-600' : 
                        'bg-neutral-100 text-neutral-400'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <Clock className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <Circle className="h-4 w-4" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className={`text-sm font-semibold ${
                        isCompleted || isCurrent ? 'text-neutral-900' : 'text-neutral-500'
                      }`}>
                        {step.title}
                      </h3>
                      {(isCompleted || isCurrent) && (
                        <Chip
                          size="sm"
                          variant="flat"
                          color={isCompleted ? 'success' : 'primary'}
                          classNames={{
                            base: 'h-6',
                            content: 'text-xs font-medium px-1'
                          }}
                        >
                          {isCompleted ? 'Done' : 'In Progress'}
                        </Chip>
                      )}
                    </div>
                    
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Footer summary */}
        <Divider className="my-6" />
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-neutral-500">Status: </span>
            <span className="font-medium text-neutral-900 capitalize">
              {enrollment.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-neutral-500">
            Started {formatDate(enrollment.created_at)}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { StatusTimeline }
export default StatusTimeline