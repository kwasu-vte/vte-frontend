// * Server Actions
// * Uses proxy pattern for all API calls
// * No client-side cookie handling - proxy manages httpOnly cookies
// * Follows the exact pattern from sd-frontend

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from './api';
import { CreateSkillPayload, UpdateSkillPayload, CreateSkillGroupPayload, CreateUserPayload, CreateStudentProfilePayload } from './types';

// * Authentication Actions
export async function signInAction(formData: FormData) {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  
  console.log(`[SignIn Action] Attempting login for user: ${username}`);
  
  if (!username || !password) {
    console.error('[SignIn Action] Missing username or password');
    throw new Error('Username and password are required');
  }

  let target: string | null = null;
  let token: string | null = null;
  try {
    console.log('[SignIn Action] Calling API signIn...');
    const response = await api.signIn({ email: username, password });
    
    if (!response.success) {
      console.error(`[SignIn Action] API signIn failed: ${response.message}`);
      throw new Error(response.message || 'Authentication failed');
    }

    console.log('[SignIn Action] API signIn successful, getting user data...');
    // * Get token from response; cookie will be set via /auth/callback (browser route)
    token = (response as any)?.data?.access_token || null;
    const me = token ? await api.getCurrentUserWithToken(token) : await api.getCurrentUser();
    if (!me.success || !me.data) {
      console.error(`[SignIn Action] Failed to get user data: ${me.message}`);
      throw new Error(me.message || 'Failed to fetch user after login');
    }

    const role = String(me.data.role || '').toLowerCase();
    target = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';
    console.log(`[SignIn Action] User role: ${role}, target: ${target}`);
  } catch (error) {
    console.error('[SignIn Action] Error during authentication:', error);
    // Fallback for legacy/edge cases of redirect signals
    if ((error as any)?.digest === 'NEXT_REDIRECT' || String((error as any)?.message || '').includes('NEXT_REDIRECT')) {
      throw error as Error;
    }
    throw new Error(error instanceof Error ? error.message : 'Authentication failed');
  }

  if (target && token) {
    const params = new URLSearchParams();
    params.set('token', token);
    params.set('target', target);
    const callbackUrl = `/auth/callback?${params.toString()}`;
    console.log(`[SignIn Action] Redirecting to callback: ${callbackUrl}`);
    redirect(callbackUrl);
  } else {
    console.error('[SignIn Action] Missing target or token, cannot redirect');
    throw new Error('Authentication completed but redirect failed');
  }
}

// * Authentication Action (Safe): returns inline error instead of throwing
// * Intended for use with useFormState on the client to render errors inline
export async function signInActionSafe(_prevState: { error?: string | null } | undefined, formData: FormData) {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  let target: string | null = null;
  let token: string | null = null;
  try {
    const response = await api.signIn({ email: username, password });
    if (!response.success) {
      return { error: response.message || 'Authentication failed' };
    }

    token = (response as any)?.data?.access_token || null;
    const me = token ? await api.getCurrentUserWithToken(token) : await api.getCurrentUser();
    if (!me.success || !me.data) {
      return { error: me.message || 'Failed to fetch user after login' };
    }

    const role = String(me.data.role || '').toLowerCase();
    target = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';
  } catch (error) {
    // * Do not throw; return message so client can render inline
    return { error: error instanceof Error ? error.message : 'Authentication failed' };
  }

  if (target && token) {
    const params = new URLSearchParams();
    params.set('token', token);
    params.set('target', target);
    const callbackUrl = `/auth/callback?${params.toString()}`;
    redirect(callbackUrl);
  }

  return { error: 'Authentication completed but redirect failed' };
}

export async function signOutAction() {
  try {
    await api.signOut();
  } catch (_) {
    // * Ignore API errors - proceed to redirect
  }
  // * Ensure local cookie is cleared as well
  try {
    const cookieStore = await cookies();
    cookieStore.set('session_token', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
  } catch (_) {}
  // * Proxy has already cleared httpOnly cookies (if success); ensure navigation regardless
  redirect('/auth/sign_in');
}

export async function signUpAction(formData: FormData) {
  const userData: CreateUserPayload = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    password_confirmation: formData.get('password2') as string,
    role: 'Student', // Default role for sign up
  };
  
  // * Validate required fields
  const requiredFields = ['first_name', 'last_name', 'email', 'password', 'password_confirmation'];
  for (const field of requiredFields) {
    if (!userData[field as keyof CreateUserPayload]) {
      throw new Error(`${field} is required`);
    }
  }
  
  // * Validate password match
  if (userData.password !== userData.password_confirmation) {
    throw new Error('Passwords do not match');
  }
  
  let shouldRedirect = false;
  try {
    const response = await api.signUp(userData);
    
    if (response.success) {
      // * Mark for redirect to sign in after successful registration
      shouldRedirect = true;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }

  if (shouldRedirect) {
    redirect('/student/profile/create');
  }
}

// * Sign Up (Safe): returns error for inline display; success redirects
export async function signUpActionSafe(_prevState: { error?: string | null } | undefined, formData: FormData) {
  const userData: CreateUserPayload = {
    first_name: String(formData.get('firstName') ?? ''),
    last_name: String(formData.get('lastName') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    password_confirmation: String(formData.get('password2') ?? ''),
    role: 'Student',
  };

  // * Basic validation
  if (!userData.first_name || !userData.last_name || !userData.email || !userData.password || !userData.password_confirmation) {
    return { error: 'All fields are required' };
  }
  if (userData.password !== userData.password_confirmation) {
    return { error: 'Passwords do not match' };
  }

  try {
    const response = await api.signUp(userData);
    if (!response.success) {
      return { error: response.message || 'Registration failed' };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }

  redirect('/student/profile/create');
}

// * Skill Management Actions
export async function createSkillAction(formData: FormData) {
  const skillData: CreateSkillPayload = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    max_groups: parseInt(formData.get('maxGroups') as string),
    min_students_per_group: parseInt(formData.get('minStudentsPerGroup') as string),
    max_students_per_group: formData.get('maxStudentsPerGroup') ? parseInt(formData.get('maxStudentsPerGroup') as string) : null,
    meta: formData.get('meta') ? [formData.get('meta') as string] : null,
    allowed_levels: (formData.get('allowedLevels') as string).split(',').filter(Boolean),
  };
  
  try {
    const response = await api.createSkill(skillData);
    
    if (response.success) {
      // * Return success - the page will handle the redirect/refresh
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to create skill');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create skill');
  }
}

export async function updateSkillAction(id: string, formData: FormData) {
  const skillData: UpdateSkillPayload = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    max_groups: parseInt(formData.get('maxGroups') as string),
    min_students_per_group: parseInt(formData.get('minStudentsPerGroup') as string),
    max_students_per_group: formData.get('maxStudentsPerGroup') ? parseInt(formData.get('maxStudentsPerGroup') as string) : undefined,
    meta: formData.get('meta') ? [formData.get('meta') as string] : null,
    allowed_levels: (formData.get('allowedLevels') as string).split(',').filter(Boolean),
  };
  
  try {
    const response = await api.updateSkill(id, skillData);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to update skill');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update skill');
  }
}

export async function deleteSkillAction(id: string) {
  try {
    await api.deleteSkill(id);
    return { success: true };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete skill');
  }
}

// * Group Management Actions
export async function createGroupAction(formData: FormData) {
  const groupData: CreateSkillGroupPayload = {
    skill_id: Number(formData.get('skillId')),
    academic_session_id: Number(formData.get('academicSessionId')),
    group_number: formData.get('groupNumber') ? Number(formData.get('groupNumber')) : undefined,
  };
  
  try {
    const response = await api.createSkillGroup(groupData);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to create group');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create group');
  }
}

// * User Management Actions
export async function updateUserAction(id: string, formData: FormData) {
  // * Not implemented in current API; keep placeholder for future extension
  const userData: Partial<CreateUserPayload> = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    email: formData.get('email') as string,
  };
  throw new Error('updateUserAction is not supported by the current API');
}

// * Academic Sessions Actions
export async function createAcademicSessionAction(formData: FormData) {
  const sessionData = {
    name: formData.get('name') as string,
    starts_at: formData.get('starts_at') as string || null,
    ends_at: formData.get('ends_at') as string || null,
  };

  try {
    const response = await api.createAcademicSession(sessionData);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to create academic session');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create academic session');
  }
}

export async function updateAcademicSessionAction(id: number, formData: FormData) {
  const sessionData = {
    name: formData.get('name') as string,
    starts_at: formData.get('starts_at') as string,
    ends_at: formData.get('ends_at') as string,
  };

  try {
    const response = await api.updateAcademicSession(id, sessionData);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to update academic session');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update academic session');
  }
}

export async function startAcademicSessionAction(id: number) {
  try {
    const response = await api.startAcademicSession(id);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to start academic session');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to start academic session');
  }
}

export async function endAcademicSessionAction(id: number) {
  try {
    const response = await api.endAcademicSession(id);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to end academic session');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to end academic session');
  }
}

// * Student Profile Actions
export async function createStudentProfileAction(userId: string, formData: FormData) {
  const profileData: CreateStudentProfilePayload = {
    matric_number: formData.get('matric_number') as string,
    student_level: formData.get('student_level') as string,
    department: formData.get('department') as string,
    faculty: formData.get('faculty') as string,
    phone: formData.get('phone') as string,
    gender: formData.get('gender') as 'male' | 'female',
    meta: formData.get('meta') as string || null,
  };

  try {
    const response = await api.createStudentProfile(userId, profileData);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to create student profile');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create student profile');
  }
}

export async function deleteUserAction(id: string) {
  // * Not implemented in current API; placeholder for future extension
  throw new Error('deleteUserAction is not supported by the current API');
}