// * Permissions Utility
// * Manages UI visibility based on user roles
// * Mirrors the successful pattern from sd-frontend

import { User, UserPermissions } from './types';

// * Role-based permission mapping
export function getUserPermissions(user: User): UserPermissions {
  switch (user.role) {
    case 'Admin':
      return {
        canManageSkills: true,
        canManageGroups: true,
        canManageStudents: true,
        canManageMentors: true,
        canViewPayments: true,
        canManageSystemSettings: true,
        canEnrollInSkills: false, // Admins don't enroll in skills
        canViewAttendance: true,
        canTakeAttendance: false, // Admins don't take attendance
      };

    case 'Mentor':
      return {
        canManageSkills: false,
        canManageGroups: false,
        canManageStudents: false,
        canManageMentors: false,
        canViewPayments: false,
        canManageSystemSettings: false,
        canEnrollInSkills: false, // Mentors don't enroll in skills
        canViewAttendance: true,
        canTakeAttendance: true, // Mentors can take attendance
      };

    case 'Student':
      return {
        canManageSkills: false,
        canManageGroups: false,
        canManageStudents: false,
        canManageMentors: false,
        canViewPayments: true, // Students can view their own payments
        canManageSystemSettings: false,
        canEnrollInSkills: true, // Students can enroll in skills
        canViewAttendance: true, // Students can view their own attendance
        canTakeAttendance: false, // Students don't take attendance
      };

    default:
      return {
        canManageSkills: false,
        canManageGroups: false,
        canManageStudents: false,
        canManageMentors: false,
        canViewPayments: false,
        canManageSystemSettings: false,
        canEnrollInSkills: false,
        canViewAttendance: false,
        canTakeAttendance: false,
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
