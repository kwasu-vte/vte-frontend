"use client"

import React, { useState, useMemo } from "react"
import { Card, CardBody, CardHeader, Chip, Button, Skeleton, Tabs, Tab } from "@heroui/react"
import { useMentorDashboardData } from "@/lib/hooks/use-mentor-dashboard-data"
import GroupScheduleCard from "@/components/features/mentor/GroupScheduleCard"
import PracticalCalendar from "@/components/features/student/PracticalCalendar"
import SessionDetails, { SessionDetailsData } from "@/components/features/mentor/SessionDetails"
import { StateRenderer, DefaultLoadingComponent, DefaultEmptyComponent } from "@/components/shared/StateRenderer"
import { NotificationContainer } from "@/components/shared/NotificationContainer"
import { formatPracticalDate } from "@/lib/utils/dates"

// * Date utility functions to replace date-fns
const parseISO = (dateString: string): Date => {
  return new Date(dateString)
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString()
}

const isAfter = (date: Date, compareDate: Date): boolean => {
  return date.getTime() > compareDate.getTime()
}

const isBefore = (date: Date, compareDate: Date): boolean => {
  return date.getTime() < compareDate.getTime()
}

const format = (date: Date, formatString: string): string => {
  // * Simplified format function for common patterns
  switch (formatString) {
    case 'EEEE, MMMM d, yyyy':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    case 'h:mm a':
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    case 'EEEE, MMMM d, yyyy • h:mm a':
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      return `${dateStr} • ${timeStr}`
    default:
      return date.toLocaleDateString()
  }
}

export interface MentorCalendarViewProps {
  userId: string
}

export default function MentorCalendarView({ userId }: MentorCalendarViewProps) {
  const { groups, isLoading, error } = useMentorDashboardData(userId)
  const [selectedSession, setSelectedSession] = useState<SessionDetailsData | null>(null)
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false)

  // * Transform groups data into calendar events with timezone-safe handling
  const practicalDates = useMemo(() => {
    if (!groups) return []
    
    return groups.flatMap((group) => 
      (group.practical_dates ?? []).map((dateStr) => {
        try {
          // ! Ensure timezone-safe date parsing
          const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
          return {
            date: dateStr,
            groupId: group.id,
            groupName: group.group_display_name ?? `Group ${group.group_number ?? group.id}`,
            skill: group.skill?.title || 'Unknown Skill',
            mentorName: 'Current User', // TODO: Get actual mentor name from context/props
            studentsCount: parseInt(group.current_student_count) || 0,
            maxStudents: parseInt(group.max_student_capacity) || undefined
          }
        } catch (error) {
          console.warn('Failed to parse date:', dateStr, error)
          return null
        }
      }).filter(Boolean)
    )
  }, [groups])

  // * Create ordered schedule list with proper sorting
  const orderedSchedule = useMemo(() => {
    if (!groups) return []
    
    const now = new Date()
    const sessions: Array<{
      id: string
      group: any
      date: Date
      dateStr: string
      isUpcoming: boolean
      isPast: boolean
    }> = []

    groups.forEach((group) => {
      (group.practical_dates ?? []).forEach((dateStr) => {
        try {
          const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
          const isUpcoming = isAfter(date, now)
          const isPast = isBefore(date, now)
          
          sessions.push({
            id: `${group.id}-${dateStr}`,
            group,
            date,
            dateStr,
            isUpcoming,
            isPast
          })
        } catch (error) {
          console.warn('Failed to parse date for ordering:', dateStr, error)
        }
      })
    })

    // * Sort by date: upcoming first (ascending), then past (descending)
    return sessions.sort((a, b) => {
      if (a.isUpcoming && b.isUpcoming) {
        return a.date.getTime() - b.date.getTime() // Ascending for upcoming
      }
      if (a.isPast && b.isPast) {
        return b.date.getTime() - a.date.getTime() // Descending for past
      }
      if (a.isUpcoming && b.isPast) return -1 // Upcoming before past
      if (a.isPast && b.isUpcoming) return 1 // Past after upcoming
      return 0
    })
  }, [groups])

  // * Handle session click - open details drawer
  const handleSessionClick = (sessionId: string, sessionData: any) => {
    try {
      const session = orderedSchedule.find(s => s.id === sessionId)
      if (!session) return

      const group = session.group
      const sessionDate = session.date
      const now = new Date()
      
      // * Determine session status based on current time and date
      let status: SessionDetailsData['status'] = 'upcoming'
      if (isBefore(sessionDate, now)) {
        status = 'completed'
      } else if (isSameDay(sessionDate, now)) {
        // TODO: Add time-based logic for 'ongoing' status when time data is available
        status = 'upcoming'
      }

      const sessionDetails: SessionDetailsData = {
        id: session.id,
        title: `${group.skill?.title || 'Practical Session'}`,
        skill: group.skill?.title || 'Unknown Skill',
        groupName: group.group_display_name ?? `Group ${group.group_number ?? group.id}`,
        date: format(sessionDate, 'EEEE, MMMM d, yyyy'),
        time: format(sessionDate, 'h:mm a'), // TODO: Use actual session time when available
        duration: '2 hours', // TODO: Get actual duration from session data
        location: 'Practical Lab', // TODO: Get actual location from session data
        mentor: 'Current User', // TODO: Get actual mentor name
        studentsCount: parseInt(group.current_student_count) || 0,
        maxStudents: parseInt(group.max_student_capacity) || undefined,
        description: `Practical session for ${group.skill?.title || 'this skill'}.`, // TODO: Get actual description
        status
      }

      setSelectedSession(sessionDetails)
      setIsSessionDetailsOpen(true)
    } catch (error) {
      console.error('Error opening session details:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <StateRenderer
          isLoading={false}
          error={error}
          data={null}
          loadingComponent={<DefaultLoadingComponent />}
          emptyComponent={<DefaultEmptyComponent message="No calendar data available." />}
        >
          {() => <></>}
        </StateRenderer>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Calendar</h1>
          <p className="text-default-500">Your practical sessions and calendar view.</p>
        </div>

        <Tabs aria-label="Calendar" variant="underlined" className="w-full">
          <Tab key="calendar" title="Practical Calendar">
            <Card shadow="sm" className="p-4">
              <CardBody>
                <PracticalCalendar
                  practicalDates={practicalDates.filter(pd => pd !== null).map(pd => ({
                    date: pd.date,
                    venue: 'Practical Lab', // TODO: Get actual venue from data
                    time: '10:00 AM' // TODO: Get actual time from data
                  }))}
                />
              </CardBody>
            </Card>
          </Tab>

          <Tab key="list" title="Schedule List">
            <Card shadow="sm" className="p-4">
              <CardHeader className="flex items-center justify-between">
                <div className="text-base font-medium text-neutral-900">Scheduled Sessions</div>
                <Chip variant="flat">{orderedSchedule.length}</Chip>
              </CardHeader>
              <CardBody>
                {orderedSchedule.length === 0 ? (
                  <DefaultEmptyComponent message="No scheduled sessions." />
                ) : (
                  <div className="space-y-4">
                    {orderedSchedule.map((session) => (
                      <Card 
                        key={session.id} 
                        shadow="sm" 
                        isPressable
                        className="p-3 hover:bg-default-50 transition-colors cursor-pointer"
                        onPress={() => handleSessionClick(session.id, session)}
                      >
                        <CardBody className="p-0">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm">
                                  {session.group.skill?.title || 'Practical Session'}
                                </h3>
                                <Chip 
                                  size="sm" 
                                  variant="flat" 
                                  color={session.isUpcoming ? 'primary' : 'default'}
                                >
                                  {session.group.group_display_name ?? `Group ${session.group.group_number ?? session.group.id}`}
                                </Chip>
                              </div>
                              <p className="text-xs text-default-600">
                                {format(session.date, 'EEEE, MMMM d, yyyy • h:mm a')}
                              </p>
                              <p className="text-xs text-default-500">
                                {parseInt(session.group.current_student_count) || 0} students enrolled
                                {session.group.max_student_capacity && ` of ${session.group.max_student_capacity}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <Chip 
                                size="sm" 
                                variant="dot" 
                                color={session.isUpcoming ? 'success' : 'default'}
                              >
                                {session.isUpcoming ? 'Upcoming' : 'Past'}
                              </Chip>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Session Details Dialog */}
      <SessionDetails
        isOpen={isSessionDetailsOpen}
        onOpenChange={setIsSessionDetailsOpen}
        session={selectedSession}
      />

      <NotificationContainer />
    </>
  )
}
