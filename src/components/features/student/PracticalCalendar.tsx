"use client"
import React from "react"
import { Card, CardBody, CardHeader, Chip, Select, SelectItem } from "@nextui-org/react"

/**
 * * PracticalCalendar
 * Calendar view of practical sessions highlighting student's practical dates.
 *
 * Props:
 * - practicalDates: Array<{ date: string; venue?: string; time?: string }>
 * - viewMode?: 'month' | 'week'
 */
export type PracticalCalendarProps = {
  practicalDates: Array<{ date: string; venue?: string; time?: string }>
  viewMode?: 'month' | 'week'
}

function PracticalCalendar({ practicalDates, viewMode = 'month' }: PracticalCalendarProps) {
  const [mode, setMode] = React.useState<'month' | 'week'>(viewMode)

  const sorted = React.useMemo(() => (
    [...practicalDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  ), [practicalDates])

  const groups = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
    const weekFormatter = (d: Date) => {
      const onejan = new Date(d.getFullYear(), 0, 1)
      const week = Math.ceil((((d as any) - (onejan as any)) / 86400000 + onejan.getDay() + 1) / 7)
      return `${d.getFullYear()} • Week ${week}`
    }

    return sorted.reduce<Record<string, Array<{ date: string; venue?: string; time?: string }>>>((acc, item) => {
      const d = new Date(item.date)
      const key = mode === 'month' ? formatter.format(d) : weekFormatter(d)
      acc[key] = acc[key] || []
      acc[key].push(item)
      return acc
    }, {})
  }, [sorted, mode])

  const keys = Object.keys(groups)

  return (
    <Card shadow="sm" className="w-full" id="student-schedule">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Practical Calendar</p>
          <p className="text-xl font-medium leading-normal">Upcoming Schedule</p>
        </div>
        <Select
          size="sm"
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as 'month' | 'week'
            setMode(value)
          }}
          className="max-w-[140px]"
        >
          <SelectItem key="month" value="month">Month</SelectItem>
          <SelectItem key="week" value="week">Week</SelectItem>
        </Select>
      </CardHeader>
      <CardBody className="space-y-6">
        {keys.length === 0 && (
          <p className="text-sm text-neutral-600">No practicals scheduled.</p>
        )}
        {keys.map((key) => (
          <div key={key} className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-base font-medium">{key}</p>
              <Chip variant="flat">{groups[key].length}</Chip>
            </div>
            <ul className="space-y-2">
              {groups[key].map((item, idx) => (
                <li key={`${item.date}-${idx}`} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
                  <div>
                    <p className="text-sm text-neutral-900 font-medium">{new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-neutral-600">{item.time || 'TBD'} {item.venue ? `• ${item.venue}` : ''}</p>
                  </div>
                  <Chip variant="flat" color="primary">Practical</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export { PracticalCalendar }
export default PracticalCalendar
