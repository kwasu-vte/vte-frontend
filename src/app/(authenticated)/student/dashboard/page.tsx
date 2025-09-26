// * Student Dashboard Page
// * Student hub with profile completion alert, enrollment status, and quick actions
// * Uses composite data hook for optimized data fetching

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { StudentDashboardClient } from './StudentDashboardClient';

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Error: User not found</div>;
  }

  return <StudentDashboardClient userId={user.id} />;
}