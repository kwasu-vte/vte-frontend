"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react"
import { Calendar, Clock, Users, MapPin, User } from "lucide-react"

export interface SessionDetailsData {
  id: string
  title: string
  skill: string
  groupName: string
  date: string
  time: string
  duration?: string
  location?: string
  mentor: string
  studentsCount: number
  maxStudents?: number
  description?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

interface SessionDetailsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  session: SessionDetailsData | null
}

export default function SessionDetails({ isOpen, onOpenChange, session }: SessionDetailsProps) {
  if (!session) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'primary'
      case 'ongoing': return 'success' 
      case 'completed': return 'default'
      case 'cancelled': return 'danger'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming'
      case 'ongoing': return 'In Progress'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{session.title}</DialogTitle>
          <DialogDescription className="text-sm text-default-500">
            {session.skill} • {session.groupName}
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Status Badge */}
          <div className="flex justify-start">
            <Chip 
              color={getStatusColor(session.status) as any}
              variant="flat"
              size="sm"
            >
              {getStatusText(session.status)}
            </Chip>
          </div>

          {/* Session Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date & Time */}
            <Card shadow="sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Date & Time</span>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{session.date}</p>
                  <div className="flex items-center gap-2 text-sm text-default-600">
                    <Clock className="h-3 w-3" />
                    <span>{session.time}</span>
                    {session.duration && <span>({session.duration})</span>}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Students */}
            <Card shadow="sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Students</span>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {session.studentsCount} enrolled
                    {session.maxStudents && ` of ${session.maxStudents}`}
                  </p>
                  {session.maxStudents && (
                    <div className="w-full bg-default-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(session.studentsCount / session.maxStudents) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Mentor */}
            <Card shadow="sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Mentor</span>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm font-medium">{session.mentor}</p>
              </CardBody>
            </Card>

            {/* Location */}
            {session.location && (
              <Card shadow="sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-sm font-medium">{session.location}</p>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Description */}
          {session.description && (
            <Card shadow="sm">
              <CardHeader className="pb-2">
                <span className="text-sm font-medium">Description</span>
              </CardHeader>
              <Divider />
              <CardBody className="pt-3">
                <p className="text-sm text-default-700">{session.description}</p>
              </CardBody>
            </Card>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
