"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react"
import { BookOpen, Users, CreditCard, QrCode, Calendar, User } from "lucide-react"
import Link from "next/link"

/**
 * * QuickActions
 * Quick action buttons for common student tasks.
 * Provides easy navigation to key features.
 *
 * Props:
 * - enrollment?: { status: string; group?: { id: string } }
 * - hasProfile?: boolean
 */
export type QuickActionsProps = {
  enrollment?: { status: string; group?: { id: string } }
  hasProfile?: boolean
}

export default function QuickActions({ enrollment, hasProfile = false }: QuickActionsProps) {
  const actions = React.useMemo(() => {
    const baseActions = [
      {
        label: "Browse Skills",
        href: "/student/skills",
        icon: BookOpen,
        color: "primary" as const,
        description: "Enroll in new skills"
      },
      {
        label: "My Profile",
        href: "/student/profile",
        icon: User,
        color: "default" as const,
        description: "View profile details"
      }
    ]

    // Add enrollment-specific actions
    if (enrollment) {
      if (enrollment.status === "pending" || enrollment.status === "paid") {
        baseActions.push({
          label: "Complete Payment",
          href: "/student/payment",
          icon: CreditCard,
          color: "warning" as const,
          description: "Pay for enrollment"
        })
      }

      if (enrollment.group) {
        baseActions.push(
          {
            label: "My Group",
            href: "/student/my-group",
            icon: Users,
            color: "success" as const,
            description: "View group details"
          },
          {
            label: "Scan QR",
            href: "/student/scan-qr",
            icon: QrCode,
            color: "primary" as const,
            description: "Mark attendance"
          },
          {
            label: "Schedule",
            href: "/student/schedule",
            icon: Calendar,
            color: "default" as const,
            description: "View practical schedule"
          }
        )
      }
    }

    return baseActions
  }, [enrollment])

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader>
        <p className="text-xl font-medium leading-normal">Quick Actions</p>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              as={Link}
              href={action.href}
              color={action.color}
              variant="bordered"
              className="h-auto p-4 justify-start"
              startContent={<action.icon className="h-5 w-5" />}
            >
              <div className="text-left">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-neutral-600">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
