'use server'

import { requireRole } from '@/lib/auth'
import MentorCalendarView from '@/components/features/mentor/MentorCalendarView'

export default async function MentorCalendarPage() {
  const user = await requireRole('Mentor')
  return <MentorCalendarView userId={String(user.id)} />
}
