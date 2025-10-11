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
    const baseActions: Array<{
      label: string;
      href: string;
      icon: React.ComponentType<any>;
      color: 'primary' | 'default' | 'success';
      variant: 'flat';
    }> = [
      {
        label: "Browse Skills",
        href: "/student/skills",
        icon: BookOpen,
        color: "primary",
        variant: "flat",
      },
      {
        label: "My Profile",
        href: "/student/profile",
        icon: User,
        color: "default",
        variant: "flat",
      }
    ]

    if (enrollment?.group) {
      baseActions.push(
        {
          label: "My Group",
          href: "/student/my-group",
          icon: Users,
          color: "primary",
          variant: "flat",
        },
        {
          label: "Mark Attendance",
          href: "/student/scan-qr",
          icon: QrCode,
          color: "success",
          variant: "flat",
        },
        {
          label: "View Schedule",
          href: "/student/schedule",
          icon: Calendar,
          color: "default",
          variant: "flat",
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