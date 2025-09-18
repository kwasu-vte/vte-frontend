// * Server Actions
// * Uses proxy pattern for all API calls
// * No client-side cookie handling - proxy manages httpOnly cookies
// * Follows the exact pattern from sd-frontend

'use server';

import { redirect } from 'next/navigation';
import { api } from './api';
import { CreateSkillPayload, UpdateSkillPayload, CreateGroupPayload, CreateUserPayload, CreateStudentProfilePayload } from './types';

// * Authentication Actions
export async function signInAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  try {
    const response = await api.signIn({ email: username, password });
    
    if (!response.success) {
      throw new Error(response.message || 'Authentication failed');
    }

    // * After login, proxy has set the session cookie. Fetch current user to determine role
    const me = await api.getCurrentUser();
    if (!me.success || !me.data) {
      throw new Error(me.message || 'Failed to fetch user after login');
    }

    const role = String(me.data.role || '').toLowerCase();
    const target = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';
    redirect(target);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Authentication failed');
  }
}

export async function signOutAction() {
  try {
    await api.signOut();
    // * Proxy has already cleared httpOnly cookies
    redirect('/auth/sign_in');
  } catch (error) {
    // * Even if API call fails, redirect to sign-in
    redirect('/auth/sign_in');
  }
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
  
  try {
    const response = await api.signUp(userData);
    
    if (response.success) {
      // * Redirect to sign in after successful registration
      redirect('/auth/sign-in?message=Registration successful. Please sign in.');
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
}

// * Skill Management Actions
export async function createSkillAction(formData: FormData) {
  const skillData: CreateSkillPayload = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    max_groups: parseInt(formData.get('maxGroups') as string),
    min_students_per_group: parseInt(formData.get('minStudentsPerGroup') as string),
    max_students_per_group: formData.get('maxStudentsPerGroup') ? parseInt(formData.get('maxStudentsPerGroup') as string) : null,
    date_range_start: formData.get('dateRangeStart') as string,
    date_range_end: formData.get('dateRangeEnd') as string,
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
  const groupData: CreateGroupPayload = {
    skill_id: formData.get('skillId') as string,
    force: formData.get('force') === 'true',
  };
  
  try {
    const response = await api.createGroup(groupData);
    
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
  const userData: Partial<CreateUserPayload> = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    email: formData.get('email') as string,
    // Note: matricNumber, level, role are not part of CreateUserPayload in OpenAPI spec
  };
  
  try {
    const response = await api.updateUser(id, userData);
    
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to update user');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update user');
  }
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
  try {
    await api.deleteUser(id);
    return { success: true };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user');
  }
}