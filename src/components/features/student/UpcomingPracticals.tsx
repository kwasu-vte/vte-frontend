"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react"
import { Calendar, MapPin, User, Clock } from "lucide-react"

/**
 * * UpcomingPracticals
 * List of next 3-5 upcoming practicals with countdown.
 * Follows design guide with NextUI components and proper styling.
 *
 * Props:
 * - practicals: Array<{ id: string; date: string; venue?: string; mentor?: string }>
 * - limit?: number
 */
export type UpcomingPracticalsProps = {
  practicals: Array<{ id: string; date: string; venue?: string; mentor?: string }>
  limit?: number
}

function getCountdownText(date: string) {
  const now = Date.now()
  const target = new Date(date).getTime()
  const diff = target - now
  if (diff <= 0) return "Now"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 0) return `${days}d`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours > 0) return `${hours}h`
  const minutes = Math.floor(diff / (1000 * 60))
  return `${minutes}m`
}

function getCountdownColor(date: string) {
  const now = Date.now()
  const target = new Date(date).getTime()
  const diff = target - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (diff <= 0) return "success"
  if (hours <= 24) return "warning"
  return "primary"
}

export default function UpcomingPracticals({ practicals, limit = 5 }: UpcomingPracticalsProps) {
  const items = React.useMemo(() => (
    [...practicals]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit)
  ), [practicals, limit])

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <p className="text-xl font-medium leading-normal">Upcoming Practicals</p>
      </CardHeader>
      <Divider />
      <CardBody className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-sm text-neutral-600">No upcoming practicals scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <Clock className="h-4 w-4 text-neutral-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-neutral-900">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <Chip 
                      color={getCountdownColor(item.date)} 
                      variant="flat"
                      size="sm"
                    >
                      {getCountdownText(item.date)}
                    </Chip>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {new Date(item.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="space-y-1">
                    {item.venue && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <MapPin className="h-3 w-3" />
                        <span>{item.venue}</span>
                      </div>
                    )}
                    {item.mentor && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <User className="h-3 w-3" />
                        <span>{item.mentor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}


