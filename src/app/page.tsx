// * Root Page Purpose: Role-based dashboard routing for authenticated users.
// * Relies on middleware for authentication validation to avoid redirect loops
// * Directly fetches user data and redirects based on role

import { redirect } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';
import { cookies } from 'next/headers';

export default async function Page() {
  // * Check if we have a session cookie before attempting to get user
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session_token');
  
  // * If no session cookie at all, redirect to sign-in
  if (!sessionCookie) {
    redirect('/auth/sign_in?redirect=/');
  }

  // * Try to get user data - if this fails, let middleware handle the redirect
  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error('Failed to get current user:', error);
    redirect('/auth/sign_in?redirect=/');
  }
  
  // * If user is null but we have a cookie, there might be a session issue
  if (!user) {
    redirect('/auth/sign_in?redirect=/');
  }

  const role = user.role.toLowerCase();
  
  // * Redirect to appropriate dashboard based on role
  switch (role) {
    case 'admin':
    case 'superadmin':
      redirect('/admin/dashboard');
    case 'mentor':
      redirect('/mentor/dashboard');
    case 'student':
      redirect('/student/dashboard');
    default:
      // * Unknown role, redirect to sign-in
      console.warn('Unknown user role:', role);
      redirect('/auth/sign_in');
  }
}
