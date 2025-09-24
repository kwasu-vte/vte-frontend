'use server'

import { requireRole } from '@/lib/auth'
import MentorAttendanceReportsView from '@/components/features/mentor/MentorAttendanceReportsView'

export default async function MentorAttendanceReportsPage() {
  const user = await requireRole('Mentor')
  return <MentorAttendanceReportsView userId={String(user.id)} />
}
