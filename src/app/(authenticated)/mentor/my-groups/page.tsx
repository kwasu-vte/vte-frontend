'use server'

import { requireRole } from '@/lib/auth'
import MentorGroupsPageView from '@/components/features/mentor/MentorGroupsPageView'

export default async function MentorGroupsPage() {
  const user = await requireRole('Mentor')
  return <MentorGroupsPageView userId={String(user.id)} />
}
