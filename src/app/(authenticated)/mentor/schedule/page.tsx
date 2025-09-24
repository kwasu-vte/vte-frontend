'use client'

import { StateRenderer } from '@/components/shared/StateRenderer'
import PracticalCalendar from '@/components/features/student/PracticalCalendar'
import GroupScheduleCard from '@/components/features/mentor/GroupScheduleCard'

export default function MentorSchedulePage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Schedule</h1>
        <p className="text-default-500">Your upcoming practical sessions and calendar.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <StateRenderer state="success">
            <PracticalCalendar />
          </StateRenderer>
        </div>
        <div className="md:col-span-1">
          <StateRenderer state="success">
            <GroupScheduleCard />
          </StateRenderer>
        </div>
      </div>
    </div>
  )
}

