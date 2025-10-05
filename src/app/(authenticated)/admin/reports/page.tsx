"use client";

import { useMemo, useState } from 'react';
import { skillGroupsApi, qrCodesApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { Button, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, CardHeader, Chip } from '@nextui-org/react';
import { FileSpreadsheet, Calendar, Users } from 'lucide-react';
import { exportAttendanceReportToExcel } from '@/lib/utils/excel-export';
import { AttendanceReport } from '@/lib/types';
import { DefaultErrorComponent, DefaultLoadingComponent } from '@/components/shared/StateRenderer';

// * Helper functions for status and rating
const getAttendanceStatus = (attendanceCount: number): string => {
  if (attendanceCount >= 8) return 'Excellent';
  if (attendanceCount >= 6) return 'Good';
  if (attendanceCount >= 4) return 'Fair';
  if (attendanceCount >= 1) return 'Poor';
  return 'No Attendance';
};

const getPerformanceRating = (points: number): string => {
  if (points >= 80) return 'Outstanding';
  if (points >= 60) return 'Good';
  if (points >= 40) return 'Average';
  if (points >= 20) return 'Below Average';
  if (points > 0) return 'Poor';
  return 'No Points';
};

const getStatusColor = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
  switch (status) {
    case 'Excellent':
    case 'Outstanding':
      return 'success';
    case 'Good':
    case 'Fair':
      return 'warning';
    case 'Poor':
    case 'Below Average':
    case 'No Attendance':
    case 'No Points':
      return 'danger';
    default:
      return 'default';
  }
};

export default function AdminReportsPage() {
  const [groupId, setGroupId] = useState<string>('');
  const [type, setType] = useState<'attendance' | 'capacity'>('attendance');

  const { data: groupsData } = useClientQuery({
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
          <div className="space-y-4">
            {/* * Export buttons for attendance reports */}
            {type === 'attendance' && reportMutation.data && (
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xl font-medium leading-normal">Attendance Report</p>
                      <p className="text-sm text-neutral-600">
                        Group {(reportMutation.data as AttendanceReport).group_info.group_number} - 
                        {(reportMutation.data as AttendanceReport).group_info.skill_title}
                      </p>
                    </div>
                  </div>
                  <Button
                    color="success"
                    variant="bordered"
                    size="sm"
                    startContent={<FileSpreadsheet className="h-4 w-4" />}
                    onPress={() => exportAttendanceReportToExcel(reportMutation.data as AttendanceReport)}
                  >
                    Export Excel
                  </Button>
                </CardHeader>
                
                {/* * Summary Statistics */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {(reportMutation.data as AttendanceReport).students.length}
                      </p>
                      <p className="text-sm text-neutral-600">Total Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {(reportMutation.data as AttendanceReport).students.filter(s => s.total_attendance > 0).length}
                      </p>
                      <p className="text-sm text-neutral-600">With Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {(reportMutation.data as AttendanceReport).students.filter(s => s.total_attendance === 0).length}
                      </p>
                      <p className="text-sm text-neutral-600">No Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {((reportMutation.data as AttendanceReport).students.length > 0 ? 
                          ((reportMutation.data as AttendanceReport).students.reduce((sum, s) => sum + s.total_points, 0) / 
                           (reportMutation.data as AttendanceReport).students.length) : 0).toFixed(1)}
                      </p>
                      <p className="text-sm text-neutral-600">Avg Points</p>
                    </div>
                  </div>
                </div>
                
                <CardBody className="p-0">
                  <Table aria-label="Attendance report table" className="w-full">
                    <TableHeader>
                      <TableColumn>S/N</TableColumn>
                      <TableColumn>STUDENT NAME</TableColumn>
                      <TableColumn>MATRIC NUMBER</TableColumn>
                      <TableColumn>TOTAL ATTENDANCE</TableColumn>
                      <TableColumn>TOTAL POINTS</TableColumn>
                      <TableColumn>LAST ATTENDANCE</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                      <TableColumn>PERFORMANCE</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {(reportMutation.data as AttendanceReport).students.map((student, index) => {
                        const status = getAttendanceStatus(student.total_attendance);
                        const rating = getPerformanceRating(student.total_points);
                        
                        return (
                          <TableRow key={student.student_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{student.full_name}</TableCell>
                            <TableCell>{student.matric_number}</TableCell>
                            <TableCell>{student.total_attendance}</TableCell>
                            <TableCell>{student.total_points}</TableCell>
                            <TableCell>
                              {student.last_attendance ? 
                                new Date(student.last_attendance).toLocaleDateString() : 
                                'Never'
                              }
                            </TableCell>
                            <TableCell>
                              <Chip 
                                color={getStatusColor(status)} 
                                variant="flat" 
                                size="sm"
                              >
                                {status}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                color={getStatusColor(rating)} 
                                variant="flat" 
                                size="sm"
                              >
                                {rating}
                              </Chip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            )}

            {/* * Capacity report display */}
            {type === 'capacity' && reportMutation.data && (
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xl font-medium leading-normal">Capacity Overview</p>
                    <p className="text-sm text-neutral-600">System capacity statistics</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <pre className="bg-neutral-50 border border-neutral-200 rounded p-4 overflow-auto text-xs">
{JSON.stringify(reportMutation.data, null, 2)}
                  </pre>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


