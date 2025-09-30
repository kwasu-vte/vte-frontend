// * Composite Data Hook for Student Dashboard
// * Combines profile, enrollment, and attendance data
// * Provides loading states and error handling

import { useQuery } from '@tanstack/react-query';
import { authApi, enrollmentsApi, qrCodesApi } from '@/lib/api';
import type { StudentProfile, Enrollment, AttendanceReport } from '@/lib/types';

interface StudentDashboardData {
  profile: StudentProfile | null;
  enrollment: Enrollment | null;
  upcomingPracticals: Array<{ id: string; date: string }>;
  attendanceSummary: {
    totalSessions: number;
    attendedSessions: number;
    attendanceRate: number;
    lastAttendance: string;
  } | null;
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

  // Fetch attendance data if user has an active enrollment
  const { data: attendanceSummary, isLoading: attendanceLoading, error: attendanceError } = useQuery({
    queryKey: ['student-attendance', userId, enrollment?.group_id],
    queryFn: async () => {
      if (!enrollment?.group_id) return null;
      
      const response = await qrCodesApi.getGroupAttendanceReport(Number(enrollment.group_id));
      const attendanceData = response.data;
      
      if (!attendanceData) return null;
      
      const totalEnrolled = parseInt(attendanceData.group_info?.total_enrolled || '0');
      const attendedStudents = attendanceData.students?.length || 0;
      
      return {
        totalSessions: totalEnrolled,
        attendedSessions: attendedStudents,
        attendanceRate: totalEnrolled > 0 ? Math.round((attendedStudents / totalEnrolled) * 100) : 0,
        lastAttendance: attendanceData.group_info?.practical_date || new Date().toISOString()
      };
    },
    enabled: !!enrollment?.group_id,
  });

  // Derive upcoming practicals from enrolled skill date range
  const upcomingPracticals = (() => {
    if (!enrollment?.skill?.date_range_start || !enrollment?.skill?.date_range_end) {
      return [];
    }

    const start = new Date(enrollment.skill.date_range_start);
    const end = new Date(enrollment.skill.date_range_end);
    const now = new Date();
    const items: Array<{ id: string; date: string }> = [];

    // Generate up to 10 dates between start and end (every 7 days), future-only
    const stepDays = 7;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + stepDays)) {
      const candidate = new Date(d);
      if (candidate >= now) {
        // Optionally skip weekends if exclude_weekends
        const isWeekend = candidate.getDay() === 0 || candidate.getDay() === 6;
        if (enrollment.skill.exclude_weekends && isWeekend) continue;
        items.push({ id: `${candidate.getTime()}`, date: candidate.toISOString() });
        if (items.length >= 10) break;
      }
    }

    return items;
  })();

  // Combine loading states
  const isLoading = profileLoading || enrollmentLoading || attendanceLoading;
  
  // Combine errors
  const error = profileError || enrollmentError || attendanceError;

  return {
    profile: profile || null,
    enrollment: enrollment || null,
    upcomingPracticals,
    attendanceSummary: attendanceSummary || null,
    isLoading,
    error: error as Error | null,
  };
}
