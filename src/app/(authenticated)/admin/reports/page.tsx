'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { DefaultErrorComponent, DefaultLoadingComponent } from '@/components/shared/StateRenderer';

export default function AdminReportsPage() {
  const [groupId, setGroupId] = useState<string>('');
  const [type, setType] = useState<'attendance' | 'capacity'>('attendance');

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (type === 'attendance' && groupId) {
        return (await api.getGroupAttendanceReport(Number(groupId))).data;
      }
      if (type === 'capacity') {
        return (await api.getGroupStatistics()).data;
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
          <Input
            label="Group ID (for attendance)"
            placeholder="e.g. 12"
            value={groupId}
            onValueChange={setGroupId}
            isDisabled={type !== 'attendance'}
          />
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
          <pre className="bg-neutral-50 border border-neutral-200 rounded p-4 overflow-auto text-xs">
{JSON.stringify(reportMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}


