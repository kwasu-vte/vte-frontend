'use server'

import { requireRole } from '@/lib/auth'
import MentorMyQRCodesView from '@/components/features/mentor/MentorMyQRCodesView'

export default async function MentorMyQRCodesPage() {
  const user = await requireRole('Mentor')
  return <MentorMyQRCodesView userId={String(user.id)} />
}
