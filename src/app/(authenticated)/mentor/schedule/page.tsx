'use server'

import { requireRole } from '@/lib/auth'
import MentorScheduleView from '@/components/features/mentor/MentorScheduleView'

export default async function MentorSchedulePage() {
  const user = await requireRole('Mentor')
  return <MentorScheduleView userId={String(user.id)} />
}

