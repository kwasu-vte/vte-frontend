// * Composite Data Hook for Mentor Dashboard
// * Combines mentor profile, skill groups, and QR code data
// * Provides loading states and error handling

import { useQuery, useQueries } from '@tanstack/react-query';
import { mentorsApi, qrCodesApi } from '@/lib/api';
import type { MentorProfile, SkillGroup, Skill, PaginatedResponse, GroupQrCode, AttendanceReport } from '@/lib/types';

interface MentorDashboardData {
  profile: MentorProfile | null;
  skills: Skill[];
  groups: SkillGroup[];
  todaysGroups: SkillGroup[];
  qrCodes: Array<{ groupId: number; data: PaginatedResponse<GroupQrCode> | null }>;
  attendanceReport: AttendanceReport | null;
  isLoading: boolean;
  error: Error | null;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function useMentorDashboardData(userId: string): MentorDashboardData {
  // Fetch mentor profile
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['mentor-profile', userId],
    queryFn: async () => {
      const response = await mentorsApi.getProfile(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  // Fetch assigned skills
  const { data: skills, isLoading: skillsLoading, error: skillsError } = useQuery({
    queryKey: ['mentor-assigned-skills', userId],
    queryFn: async () => {
      const response = await mentorsApi.getAssignedSkills(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  // Fetch skill groups
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['mentor-skill-groups', userId],
    queryFn: async () => {
      const response = await mentorsApi.getSkillGroups(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  // Derive today's groups
  const todaysGroups = (() => {
    const groupsArray = Array.isArray(groups) ? groups : [];
    if (groupsArray.length === 0) return [];
    const today = new Date();
    return groupsArray.filter((g) => (g as any)?.next_practical_at && isSameDay(new Date((g as any).next_practical_at), today));
  })();

  // Fetch QR codes for first 3 groups
  const qrGroups = Array.isArray(groups) ? groups.slice(0, 3) : [];
  const qrQueries = useQueries({
    queries: qrGroups.map((g) => ({
      queryKey: ['group-qr-codes', g.id, 'active'],
      queryFn: async () => {
        const response = await qrCodesApi.listGroupCodes(Number(g.id), { status: 'active', per_page: 20 });
        return { groupId: g.id, data: response.data };
      },
      enabled: !!g?.id,
    })),
  });

  // Select primary group for attendance report
  const primaryGroup = Array.isArray(groups) && groups.length > 0 ? groups[0] : null;
  const { data: attendanceReport, isLoading: attendanceLoading, error: attendanceError } = useQuery({
    queryKey: ['group-attendance-report', primaryGroup?.id],
    queryFn: async () => {
      if (!primaryGroup?.id) return null;
      const response = await qrCodesApi.getGroupAttendanceReport(Number(primaryGroup.id));
      return response.data;
    },
    enabled: !!primaryGroup?.id,
    refetchInterval: 10000,
  });

  // Combine loading states
  const isLoading = profileLoading || skillsLoading || groupsLoading || attendanceLoading || 
    (Array.isArray(qrQueries) ? qrQueries.some(q => q.isLoading) : false);
  
  // Combine errors
  const error = profileError || skillsError || groupsError || attendanceError || 
    (Array.isArray(qrQueries) ? qrQueries.find(q => q.error)?.error : null);

  return {
    profile: profile || null,
    skills: Array.isArray(skills) ? skills : [],
    groups: Array.isArray(groups) ? groups : [],
    todaysGroups,
    qrCodes: Array.isArray(qrQueries) ? qrQueries.map(q => q.data).filter(Boolean) as any : [],
    attendanceReport: attendanceReport || null,
    isLoading,
    error: error as Error | null,
  };
}