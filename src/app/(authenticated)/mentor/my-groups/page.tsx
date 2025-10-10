'use server'

import { requireRole } from '@/lib/auth'
import MentorSkillsAndGroupsView from '@/components/features/mentor/MentorSkillsAndGroupsView'

export default async function MentorGroupsPage() {
  const user = await requireRole('Mentor')
  return <MentorSkillsAndGroupsView userId={String(user.id)} />
}
