'use client'

import { StateRenderer } from '@/components/shared/StateRenderer'
import MentorSkillAssignment from '@/components/features/mentor/MentorSkillAssignment'
import MentorGroupsList from '@/components/features/mentor/MentorGroupsList'

export default function MentorMySkillsPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">My Skills</h1>
        <p className="text-default-500">Manage your assigned skills and view associated groups.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <StateRenderer state="success">
          <MentorSkillAssignment />
        </StateRenderer>
        <StateRenderer state="success">
          <MentorGroupsList />
        </StateRenderer>
      </div>
    </div>
  )
}

