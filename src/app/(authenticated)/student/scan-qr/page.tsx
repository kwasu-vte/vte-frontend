// * Student QR Scanner Page - Server Component Wrapper
// * Handles authentication and passes userId to client component

import { getCurrentUser } from '@/lib/auth';
import StudentScanQR from '@/components/features/student/StudentScanQR';

export const dynamic = 'force-dynamic';

export default async function StudentScanQRPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Error: User not found</div>;
  }

  return <StudentScanQR userId={user.id} />;
}