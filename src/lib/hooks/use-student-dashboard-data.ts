// * Composite Data Hook for Student Dashboard
// * Combines profile and enrollment data
// * Provides loading states and error handling

import { useQuery } from '@tanstack/react-query';
import { authApi, enrollmentsApi } from '@/lib/api';
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
    queryKey: ['student-profile', 'me'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      const me = response.data as any;
      return (me && me.studentProfile) ? (me.studentProfile as StudentProfile) : null;
    },
    enabled: true,
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