// * Permissions Utility
// * Manages UI visibility based on user roles
// * Mirrors the successful pattern from sd-frontend

import { User, UserPermissions } from './types';

// * Role-based permission mapping
export function getUserPermissions(user: User): UserPermissions {
  switch (user.role) {
    case 'Admin':
      return {
        can_manage_skills: true,
        can_manage_groups: true,
        can_manage_students: true,
        can_manage_mentors: true,
        can_view_payments: true,
        can_manage_system_settings: true,
        can_enroll_in_skills: false, // Admins don't enroll in skills
        can_view_attendance: true,
        can_take_attendance: false, // Admins don't take attendance
      };

    case 'Mentor':
      return {
        can_manage_skills: false,
        can_manage_groups: false,
        can_manage_students: false,
        can_manage_mentors: false,
        can_view_payments: false,
        can_manage_system_settings: false,
        can_enroll_in_skills: false, // Mentors don't enroll in skills
        can_view_attendance: true,
        can_take_attendance: true, // Mentors can take attendance
      };

    case 'Student':
      return {
        can_manage_skills: false,
        can_manage_groups: false,
        can_manage_students: false,
        can_manage_mentors: false,
        can_view_payments: true, // Students can view their own payments
        can_manage_system_settings: false,
        can_enroll_in_skills: true, // Students can enroll in skills
        can_view_attendance: true, // Students can view their own attendance
        can_take_attendance: false, // Students don't take attendance
      };

    default:
      return {
        can_manage_skills: false,
        can_manage_groups: false,
        can_manage_students: false,
        can_manage_mentors: false,
        can_view_payments: false,
        can_manage_system_settings: false,
        can_enroll_in_skills: false,
        can_view_attendance: false,
        can_take_attendance: false,
      };
  }
}

// * Navigation filtering based on permissions
export function filterNavigationByPermissions<T extends { role: User['role'][] }>(
  items: T[],
  userRole: User['role']
): T[] {
  return items.filter(item => item.role.includes(userRole));
}

// * Conditional rendering helper
export function canAccess(user: User, permission: keyof UserPermissions): boolean {
  const permissions = getUserPermissions(user);
  return permissions[permission];
}

// * Route protection helper
export function isRouteAccessible(user: User, requiredPermissions: (keyof UserPermissions)[]): boolean {
  return requiredPermissions.every(permission => canAccess(user, permission));
}
