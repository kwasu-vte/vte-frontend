"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react"

/**
 * * UpcomingPracticals
 * List of next 3-5 upcoming practicals with countdown.
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

export default function UpcomingPracticals({ practicals, limit = 5 }: UpcomingPracticalsProps) {
  const items = React.useMemo(() => (
    [...practicals]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit)
  ), [practicals, limit])

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader>
        <p className="text-xl font-medium leading-normal">Upcoming Practicals</p>
      </CardHeader>
      <CardBody className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-neutral-600">No upcoming practicals.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
            <div>
              <p className="text-sm text-neutral-900 font-medium">{new Date(item.date).toLocaleString()}</p>
              <p className="text-xs text-neutral-600">{item.venue || 'Venue TBD'}{item.mentor ? ` • ${item.mentor}` : ''}</p>
            </div>
            <Chip color="primary" variant="flat">{getCountdownText(item.date)}</Chip>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}


