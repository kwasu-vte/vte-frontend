// * Composite Data Hook for Student Dashboard
// * Combines profile and enrollment data
// * Provides loading states and error handling

import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi, studentsApi } from '@/lib/api';
import type { StudentProfile, Enrollment } from '@/lib/types';

interface StudentDashboardData {
  profile: StudentProfile | null;
  enrollment: Enrollment | null;
  isLoading: boolean;
  error: Error | null;
}

export function useStudentDashboardData(userId: string): StudentDashboardData {
  // Fetch profile data via "me" endpoint and map to studentProfile
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['student-profile', userId],
    queryFn: async () => {
      const response = await studentsApi.getProfile(userId);
      const studentProfile = response.data as any;
      console.log('[useStudentDashboardData] getProfile payload', studentProfile);
      if (!studentProfile) return null;
      const normalized: StudentProfile = {
        id: Number(studentProfile.id ?? 0),
        matric_number: String(studentProfile.matric_number ?? ''),
        student_level: String(studentProfile.student_level ?? studentProfile.level ?? ''),
        department: String(studentProfile.department ?? ''),
        faculty: studentProfile.faculty ?? null,
        phone: studentProfile.phone ?? null,
        gender: studentProfile.gender ?? null,
        can_enroll: Boolean(studentProfile.can_enroll ?? true),
        meta: studentProfile.meta ?? null,
        created_at: studentProfile.created_at ?? null,
        updated_at: studentProfile.updated_at ?? null,
        full_name: String(studentProfile.full_name ?? ''),
        student_level_int: String(studentProfile.student_level_int ?? ''),
        attendances_count: String(studentProfile.attendances_count ?? '0'),
        enrollments_count: String(studentProfile.enrollments_count ?? '0'),
        user_id: String(userId),
      };
      console.log('[useStudentDashboardData] normalized studentProfile', normalized);
      return normalized;
    },
    enabled: !!userId,
  });

  // Fetch enrollment data
  const { data: enrollment, isLoading: enrollmentLoading, error: enrollmentError } = useQuery({
    queryKey: ['student-enrollment', userId],
    queryFn: async () => {
      const response = await enrollmentsApi.getUserEnrollment(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  // Combine loading states
  const isLoading = profileLoading || enrollmentLoading;
  
  // Combine errors
  const error = profileError || enrollmentError;

  return {
    profile: profile || null,
    enrollment: enrollment || null,
    isLoading,
    error: error as Error | null,
  };
}