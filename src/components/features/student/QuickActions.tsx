"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Tooltip } from "@nextui-org/react"
import { BookOpen, Users, QrCode, Calendar, User } from "lucide-react"
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

function QuickActions({ enrollment, hasProfile = false }: QuickActionsProps) {
  const actions = React.useMemo(() => {
    const baseActions = [
      {
        label: "Browse Skills",
        href: "/student/skills",
        icon: BookOpen,
        color: "primary" as const,
        description: "Find and enroll in skills"
      },
      {
        label: "My Profile",
        href: "/student/profile",
        icon: User,
        color: "default" as const,
        description: "View and update your details"
      }
    ]

    // Add enrollment-specific actions
    if (enrollment) {
      if (enrollment.group) {
        baseActions.push(
          {
            label: "My Group",
            href: "/student/my-group",
            icon: Users,
            color: "primary" as const,
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
      <CardHeader className="pb-2">
        <p className="text-xl font-medium leading-normal">Quick Actions</p>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Tooltip key={action.label} content={action.description} placement="top" delay={200}>
              <Button
                as={Link}
                href={action.href}
                color={action.color}
                variant="bordered"
                className="h-auto p-4 justify-start hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                startContent={<action.icon className="h-5 w-5" aria-hidden="true" />}
              >
                <div className="text-left">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-neutral-600">{action.description}</p>
                </div>
              </Button>
            </Tooltip>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export { QuickActions }
export default QuickActions
