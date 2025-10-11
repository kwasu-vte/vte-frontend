"use client"
import React from "react"
import { Button } from "@heroui/react"
import { BookOpen, Users, QrCode, Calendar, User } from "lucide-react"
import Link from "next/link"

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
        variant: "flat" as const,
      },
      {
        label: "My Profile",
        href: "/student/profile",
        icon: User,
        color: "default" as const,
        variant: "flat" as const,
      }
    ]

    if (enrollment?.group) {
      baseActions.push(
        {
          label: "My Group",
          href: "/student/my-group",
          icon: Users,
          color: "primary" as const,
          variant: "flat" as const,
        },
        {
          label: "Mark Attendance",
          href: "/student/scan-qr",
          icon: QrCode,
          color: "success" as const,
          variant: "flat" as const,
        },
        {
          label: "View Schedule",
          href: "/student/schedule",
          icon: Calendar,
          color: "default" as const,
          variant: "flat" as const,
        }
      )
    }

    return baseActions
  }, [enrollment])

  return (
    <div className="grid grid-cols-1 gap-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          as={Link}
          href={action.href}
          color={action.color}
          variant={action.variant}
          className="justify-start h-auto py-3 px-4"
          startContent={
            <div className="flex-shrink-0">
              <action.icon className="h-5 w-5" />
            </div>
          }
        >
          <span className="font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}

export { QuickActions }
export default QuickActions