/**
 * * dates.ts utilities (placeholders)
 * TODO: Implement date formatting, ranges, and practical date generation.
 */

export type DateFormat = string
export type PracticalDate = { date: Date }

export function formatPracticalDate(date: string, _format?: DateFormat): string {
  // TODO: Use date-fns or Intl to format date
  return new Date(date).toLocaleString()
}

export function getUpcomingPracticals(dates: PracticalDate[], limit: number = 5): PracticalDate[] {
  // TODO: Sort and limit upcoming dates
  return dates.slice(0, limit)
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime()
  return time >= start.getTime() && time <= end.getTime()
}

export function generatePracticalDates(startDate: Date, endDate: Date, frequency: 'daily' | 'weekly', excludeWeekends: boolean): Date[] {
  const result: Date[] = []
  const current = new Date(startDate)
  while (current <= endDate) {
    const isWeekend = current.getDay() === 0 || current.getDay() === 6
    if (!(excludeWeekends && isWeekend)) {
      result.push(new Date(current))
    }
    current.setDate(current.getDate() + (frequency === 'daily' ? 1 : 7))
  }
  return result
}


