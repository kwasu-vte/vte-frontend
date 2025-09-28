"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRGenerationForm } from '@/components/features/admin/QRGenerationForm';
import { QRDistributionTracker } from '@/components/features/admin/QRDistributionTracker';
import { Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { skillsApi, skillGroupsApi } from '@/lib/api';

export default function AdminQrCodesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // * Load skills for selector
  const { data: skillsResp } = useQuery({
    queryKey: ['qr-skills'],
    queryFn: async () => (await skillsApi.getAll()).data,
    enabled: typeof window !== 'undefined',
  });
  const skills = useMemo(() => (skillsResp as any)?.items ?? skillsResp ?? [], [skillsResp]);

  // * Load groups for selected skill
  const { data: groupsResp } = useQuery({
    queryKey: ['qr-groups', selectedSkillId],
    queryFn: async () => {
      if (!selectedSkillId) return [] as any[];
      const res = await skillGroupsApi.list({ per_page: 100, skill_id: Number(selectedSkillId) });
      return res.data?.items ?? [];
    },
    enabled: typeof window !== 'undefined' && !!selectedSkillId,
  });
  const groups = useMemo(() => groupsResp ?? [], [groupsResp]);

  // * Initialize from query params: ?skillId=...&groupId=...
  useEffect(() => {
    const qSkill = searchParams.get('skillId');
    const qGroup = searchParams.get('groupId');
    if (qSkill) setSelectedSkillId(qSkill);
    if (qGroup) setSelectedGroupId(Number(qGroup));
  }, [searchParams]);

  // * Keep URL in sync when selections change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedSkillId) params.set('skillId', selectedSkillId);
    else params.delete('skillId');
    if (selectedGroupId) params.set('groupId', String(selectedGroupId));
    else params.delete('groupId');
    router.replace(`?${params.toString()}`);
  }, [selectedSkillId, selectedGroupId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">QR Codes</h1>
        <p className="text-neutral-600 mt-1">Generate and track QR codes per group.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* * Context selectors */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Skill"
              selectedKeys={selectedSkillId ? [selectedSkillId] : []}
              onChange={(e) => {
                const nextSkill = e.target.value || null;
                setSelectedSkillId(nextSkill);
                // * Reset group when skill changes
                setSelectedGroupId(null);
              }}
              placeholder="Select a skill"
              size="sm"
            >
              {skills.map((s: any) => (
                <SelectItem key={String(s.id)}>{s.title}</SelectItem>
              ))}
            </Select>

            <Select
              label="Group"
              isDisabled={!selectedSkillId}
              selectedKeys={selectedGroupId ? [String(selectedGroupId)] : []}
              onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : null)}
              placeholder={selectedSkillId ? "Select a group" : "Select a skill first"}
              size="sm"
            >
              {groups.map((g: any) => (
                <SelectItem key={String(g.id)}>{g.group_display_name || `Group ${g.group_number}`}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <QRGenerationForm onGroupSelected={(id) => setSelectedGroupId(id)} />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <QRDistributionTracker selectedGroupId={selectedGroupId} />
        </div>
      </div>
    </div>
  );
}


