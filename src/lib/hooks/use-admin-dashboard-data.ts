// * Composite Data Hook for Admin Dashboard
// * Combines academic sessions, statistics, and recent enrollments
// * Provides loading states and error handling

import { useQuery } from '@tanstack/react-query';
import { academicSessionsApi, skillGroupsApi, enrollmentsApi } from '@/lib/api';
import type { AcademicSession, GroupStatistics, PaginatedResponse, Enrollment } from '@/lib/types';

interface AdminDashboardData {
  sessions: AcademicSession[];
  activeSession: AcademicSession | null;
  statistics: GroupStatistics | null;
  recentEnrollments: PaginatedResponse<Enrollment> | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAdminDashboardData(): AdminDashboardData {
  // Fetch academic sessions
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: ['academic-sessions'],
    queryFn: async () => {
      const response = await academicSessionsApi.getAll();
      return response.data;
    },
  });

  // Fetch group statistics
  const { data: statistics, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['group-statistics'],
    queryFn: async () => {
      const response = await skillGroupsApi.getStatistics();
      return response.data;
    },
  });

  // Fetch recent enrollments
  const { data: recentEnrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery({
    queryKey: ['recent-enrollments'],
    queryFn: async () => {
      const response = await enrollmentsApi.getAll({ per_page: 25 });
      return response.data;
    },
  });

  // Determine active session
  const activeSession = (() => {
    // * Ensure sessions is an array before using array methods
    const sessionsArray = Array.isArray(sessions) ? sessions : [];
    if (sessionsArray.length === 0) return null;
    
    const now = new Date();
    return sessionsArray.find((s) => s.active) ||
           sessionsArray.find((s) => {
             if (!s.starts_at || !s.ends_at) return false;
             const start = new Date(s.starts_at);
             const end = new Date(s.ends_at);
             return start <= now && now <= end;
           }) ||
           null;
  })();

  // Combine loading states
  const isLoading = sessionsLoading || statsLoading || enrollmentsLoading;
  
  // Combine errors
  const error = sessionsError || statsError || enrollmentsError;

  return {
    sessions: Array.isArray(sessions) ? sessions : [],
    activeSession,
    statistics: statistics || null,
    recentEnrollments: recentEnrollments || null,
    isLoading,
    error: error as Error | null,
  };
}