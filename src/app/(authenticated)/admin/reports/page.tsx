"use client";

import { useMemo, useState } from 'react';
import { skillGroupsApi, qrCodesApi } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { DefaultErrorComponent, DefaultLoadingComponent } from '@/components/shared/StateRenderer';

export default function AdminReportsPage() {
  const [groupId, setGroupId] = useState<string>('');
  const [type, setType] = useState<'attendance' | 'capacity'>('attendance');

  const { data: groupsData } = useQuery({
    queryKey: ['skill-groups', { per_page: 100 }],
    queryFn: async () => {
      const res = await skillGroupsApi.list({ per_page: 100 })
      return res.data?.items ?? []
    },
  })

  const groups = useMemo(() => (groupsData || []).map((g: any) => ({ id: g.id, name: g.group_display_name || `Group ${g.group_number}` })), [groupsData])

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (type === 'attendance' && groupId) {
        return (await qrCodesApi.getGroupAttendanceReport(Number(groupId))).data;
      }
      if (type === 'capacity') {
        return (await skillGroupsApi.getStatistics()).data;
      }
      return null;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Reports</h1>
        <p className="text-neutral-600 mt-1">Generate attendance and capacity reports.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            label="Report Type"
            selectedKeys={[type]}
            onChange={(e) => setType(e.target.value as 'attendance' | 'capacity')}
          >
            <SelectItem key="attendance" value="attendance">Attendance</SelectItem>
            <SelectItem key="capacity" value="capacity">Capacity Overview</SelectItem>
          </Select>
          <Select
            label="Group (for attendance)"
            placeholder="Select group"
            selectedKeys={groupId ? [groupId] : []}
            onChange={(e) => setGroupId(e.target.value)}
            isDisabled={type !== 'attendance'}
          >
            {groups.map((g: any) => (
              <SelectItem key={String(g.id)}>{g.name}</SelectItem>
            ))}
          </Select>
          <div className="flex items-end">
            <Button color="primary" isDisabled={type === 'attendance' && !groupId} onClick={() => reportMutation.mutate()}>
              Generate
            </Button>
          </div>
        </div>

        {reportMutation.isPending && (
          <div className="p-4"><DefaultLoadingComponent /></div>
        )}
        {reportMutation.isError && (
          <div className="p-4"><DefaultErrorComponent error={reportMutation.error as Error} /></div>
        )}
        {reportMutation.isSuccess && (
          // TODO: Replace JSON dump with visual report viewer and export options (CSV/PDF).
          <pre className="bg-neutral-50 border border-neutral-200 rounded p-4 overflow-auto text-xs">
{JSON.stringify(reportMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}


