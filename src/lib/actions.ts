// * Server Actions
// * Uses proxy pattern for all API calls
// * No client-side cookie handling - proxy manages httpOnly cookies
// * Follows the exact pattern from sd-frontend

'use server';

import { redirect } from 'next/navigation';
import { api } from './api';
import { CreateSkillPayload, CreateGroupPayload, CreateUserPayload } from './types';

// * Authentication Actions
export async function signInAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  try {
    const response = await api.signIn(username, password);
    
    if (response.status) {
      // * Proxy has already set httpOnly cookies
      // * Redirect based on user role
      const role = response.data.user.role.toLowerCase();
      redirect(`/${role}/dashboard`);
    } else {
      throw new Error(response.message || 'Authentication failed');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Authentication failed');
  }
}

export async function signOutAction() {
  try {
    await api.signOut();
    // * Proxy has already cleared httpOnly cookies
    redirect('/auth/sign-in');
  } catch (error) {
    // * Even if API call fails, redirect to sign-in
    redirect('/auth/sign-in');
  }
}

export async function signUpAction(formData: FormData) {
  const userData: CreateUserPayload = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    password2: formData.get('password2') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    matricNumber: formData.get('matricNumber') as string,
    level: formData.get('level') as string,
    role: formData.get('role') as string,
  };
  
  // * Validate required fields
  const requiredFields = ['username', 'email', 'password', 'password2', 'firstName', 'lastName', 'matricNumber', 'level', 'role'];
  for (const field of requiredFields) {
    if (!userData[field as keyof CreateUserPayload]) {
      throw new Error(`${field} is required`);
    }
  }
  
  // * Validate password match
  if (userData.password !== userData.password2) {
    throw new Error('Passwords do not match');
  }
  
  try {
    const response = await api.signUp(userData);
    
    if (response.status) {
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
    code: formData.get('code') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    availableLevelIds: (formData.get('availableLevelIds') as string).split(',').filter(Boolean),
    capacity: parseInt(formData.get('capacity') as string),
  };
  
  try {
    const response = await api.createSkill(skillData);
    
    if (response.status) {
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
  const skillData: Partial<CreateSkillPayload> = {
    code: formData.get('code') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    availableLevelIds: (formData.get('availableLevelIds') as string).split(',').filter(Boolean),
    capacity: parseInt(formData.get('capacity') as string),
  };
  
  try {
    const response = await api.updateSkill(id, skillData);
    
    if (response.status) {
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
    skillId: formData.get('skillId') as string,
    force: formData.get('force') === 'true',
  };
  
  try {
    const response = await api.createGroup(groupData);
    
    if (response.status) {
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
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    matricNumber: formData.get('matricNumber') as string,
    level: formData.get('level') as string,
    role: formData.get('role') as string,
  };
  
  try {
    const response = await api.updateUser(id, userData);
    
    if (response.status) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Failed to update user');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update user');
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