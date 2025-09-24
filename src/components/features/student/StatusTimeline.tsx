"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react"
import { CheckCircle, Clock, AlertCircle, CreditCard, Users, Calendar } from "lucide-react"

/**
 * * StatusTimeline
 * Visual timeline showing enrollment progress through different stages.
 * Follows design guide with NextUI components and proper styling.
 *
 * Props:
 * - enrollment: { status: string; payment_status: string; created_at: string; updated_at: string }
 * - skill?: { title: string }
 */
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

export default function StatusTimeline({ enrollment, skill }: StatusTimelineProps) {
  const steps = [
    {
      id: 'selected',
      title: 'Skill Selected',
      description: 'You have selected a skill for enrollment',
      icon: CheckCircle,
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
      status: enrollment.status === 'assigned' || enrollment.status === 'active' ? 'completed' :
              enrollment.status === 'paid' ? 'current' : 'pending'
    },
    {
      id: 'active',
      title: 'Active Enrollment',
      description: 'Start attending practical sessions',
      icon: Calendar,
      status: enrollment.status === 'active' ? 'completed' : 'pending'
    }
  ]

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'current': return 'primary'
      case 'pending': return 'default'
      default: return 'default'
    }
  }

  const getStepIcon = (step: typeof steps[0]) => {
    const IconComponent = step.icon
    const color = getStepColor(step.status)
    
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-success" />
    } else if (step.status === 'current') {
      return <Clock className="h-5 w-5 text-primary animate-pulse" />
    } else {
      return <IconComponent className="h-5 w-5 text-neutral-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <p className="text-xl font-medium leading-normal">Enrollment Timeline</p>
        </div>
        {skill && (
          <p className="text-sm text-neutral-600">For: {skill.title}</p>
        )}
      </CardHeader>
      
      <Divider />
      
      <CardBody className="p-6">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              {/* Timeline Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step)}
              </div>
              
              {/* Timeline Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium text-neutral-900">
                    {step.title}
                  </h3>
                  <Chip
                    color={getStepColor(step.status)}
                    variant="flat"
                    size="sm"
                  >
                    {step.status === 'completed' ? 'Completed' :
                     step.status === 'current' ? 'Current' : 'Pending'}
                  </Chip>
                </div>
                
                <p className="text-sm text-neutral-600">
                  {step.description}
                </p>
                
                {/* Show completion date for completed steps */}
                {step.status === 'completed' && (
                  <p className="text-xs text-neutral-500">
                    Completed on {formatDate(enrollment.updated_at)}
                  </p>
                )}
              </div>
              
              {/* Timeline Connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-neutral-200" />
              )}
            </div>
          ))}
        </div>
        
        {/* Overall Status Summary */}
        <Divider className="my-6" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">Current Status</p>
            <p className="text-lg font-medium text-neutral-900 capitalize">
              {enrollment.status} • {enrollment.payment_status}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Enrolled</p>
            <p className="text-sm text-neutral-900">
              {formatDate(enrollment.created_at)}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
