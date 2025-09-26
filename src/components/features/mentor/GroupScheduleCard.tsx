"use client"
import React from "react"
import { Card, CardHeader, CardBody, Chip, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { skillsApi } from "@/lib/api"

/**
 * * GroupScheduleCard
 * Shows upcoming practical sessions for a group's skill using skill date range.
 *
 * Props:
 * - skillId: string (required)
 * - academicSessionId?: number (optional)
 * - groupLabel?: string
 */
export type GroupScheduleCardProps = {
  skillId: string
  academicSessionId?: number
  groupLabel?: string
}

export default function GroupScheduleCard(props: GroupScheduleCardProps) {
  const { skillId, academicSessionId, groupLabel } = props

  const { data, isLoading } = useQuery({
    queryKey: ["skill-date-range", skillId, academicSessionId],
    queryFn: async () => {
      const res = await skillsApi.getDateRange(skillId, academicSessionId ? String(academicSessionId) : undefined)
      return res?.data ?? null
    },
  })

  // * derive upcoming dates (placeholder: next three weekly slots within range)
  const upcoming: string[] = React.useMemo(() => {
    if (!data?.date_range_start || !data?.date_range_end) return []
    const start = new Date(data.date_range_start)
    const end = new Date(data.date_range_end)
    const now = new Date()
    const list: string[] = []
    const cursor = new Date(Math.max(start.getTime(), now.getTime()))
    while (cursor <= end && list.length < 3) {
      list.push(new Date(cursor).toISOString())
      cursor.setDate(cursor.getDate() + 7)
    }
    return list
  }, [data?.date_range_start, data?.date_range_end])

  if (isLoading) {
    return (
      <Card shadow="sm" className="p-4">
        <CardHeader className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </CardHeader>
        <CardBody className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-2/3 rounded-md" />
          ))}
        </CardBody>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card shadow="sm" className="p-4">
        <CardHeader className="flex items-center justify-between">
          <p className="text-base font-medium text-neutral-900">Schedule</p>
          {groupLabel && <Chip variant="flat">{groupLabel}</Chip>}
        </CardHeader>
        <CardBody>
          <p className="text-sm text-neutral-500">No schedule configured.</p>
        </CardBody>
      </Card>
    )
  }

  const rangeLabel = `${new Date(data.date_range_start).toLocaleDateString()} → ${new Date(data.date_range_end).toLocaleDateString()}`

  return (
    <Card shadow="sm" className="p-4">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-neutral-900">Schedule</p>
          <p className="text-sm text-neutral-500">{rangeLabel}</p>
        </div>
        {groupLabel && <Chip variant="flat">{groupLabel}</Chip>}
      </CardHeader>
      <CardBody className="space-y-2">
        {upcoming.length === 0 ? (
          <p className="text-sm text-neutral-500">No upcoming practicals within range.</p>
        ) : (
          upcoming.map((iso) => (
            <div key={iso} className="flex items-center justify-between">
              <span className="text-sm text-neutral-900">{new Date(iso).toLocaleString()}</span>
              <Chip size="sm" color="primary" variant="flat">Upcoming</Chip>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  )
}


