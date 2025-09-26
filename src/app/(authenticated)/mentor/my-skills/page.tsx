'use server'

import { requireRole } from '@/lib/auth'
import MentorMySkillsView from '@/components/features/mentor/MentorMySkillsView'

export default async function MentorMySkillsPage() {
  const user = await requireRole('Mentor')
  return <MentorMySkillsView userId={String(user.id)} />
}

