// * Root Page Purpose: Role-based dashboard routing for authenticated users.
// * Implements authentication check and redirects based on user role
// * First attempts to refresh access token if needed

import { redirect } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';

export default async function Page() {
  // * Check if user is authenticated
  const user = await getCurrentUser();
  
  if (!user) {
    // * User is not authenticated, redirect to sign-in
    redirect('/auth/sign_in');
  }
  
  // * User is authenticated, redirect based on role
  const role = user.role.toLowerCase();
  
  switch (role) {
    case 'admin':
      redirect('/admin/dashboard');
    case 'mentor':
      redirect('/mentor/dashboard');
    case 'student':
      redirect('/student/dashboard');
    default:
      // * Unknown role, redirect to sign-in
      redirect('/auth/sign_in');
  }
}
