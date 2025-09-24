// * Mentor Dashboard Page
// * Tests AppShell integration for mentor role
// * Demonstrates role-based navigation and permissions

export const dynamic = 'force-dynamic';

import { requireRole } from '@/lib/auth';
import MentorDashboard from '@/components/features/mentor/MentorDashboard';

export default async function MentorDashboardPage() {
  const user = await requireRole('Mentor');
  return (
    <div className="p-4 md:p-6">
      <MentorDashboard userId={String(user.id)} />
    </div>
  );
}
