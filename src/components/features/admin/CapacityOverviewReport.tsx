"use client";

import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from '@heroui/react';
import { FileSpreadsheet, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { GroupStatistics, SkillGroup } from '@/lib/types';
import { exportCapacityOverviewToExcel } from '@/lib/utils/excel-export';

export interface CapacityOverviewReportProps {
  statistics: GroupStatistics;
  groups?: SkillGroup[];
}

export default function CapacityOverviewReport({ statistics, groups = [] }: CapacityOverviewReportProps) {
  // * Helper function to get utilization color
  const getUtilizationColor = (percentage: number): 'success' | 'warning' | 'danger' | 'default' => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    if (percentage >= 50) return 'success';
    return 'default';
  };

  // * Helper function to get capacity status
  const getCapacityStatus = (current: number, max: number): string => {
    const percentage = max > 0 ? Math.round((current / max) * 100) : 0;
    if (percentage >= 100) return 'Full';
    if (percentage >= 80) return 'Near Full';
    if (percentage >= 50) return 'Good';
    if (percentage >= 25) return 'Low';
    return 'Empty';
  };

  // * Helper function to get status color
  const getStatusColor = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'Full':
        return 'danger';
      case 'Near Full':
        return 'warning';
      case 'Good':
        return 'success';
      case 'Low':
        return 'warning';
      case 'Empty':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xl font-medium leading-normal">Capacity Overview Report</p>
            <p className="text-sm text-neutral-600">System-wide capacity utilization statistics</p>
          </div>
        </div>
        <Button
          color="success"
          variant="bordered"
          size="sm"
          startContent={<FileSpreadsheet className="h-4 w-4" />}
          onPress={() => exportCapacityOverviewToExcel(statistics, groups)}
        >
          Export Excel
        </Button>
      </CardHeader>
      
      {/* * Summary Statistics */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {statistics.total_groups}
            </p>
            <p className="text-sm text-neutral-600">Total Groups</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {statistics.total_students}
            </p>
            <p className="text-sm text-neutral-600">Total Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {typeof statistics.average_students_per_group === 'number' 
                ? statistics.average_students_per_group.toFixed(1)
                : statistics.average_students_per_group}
            </p>
            <p className="text-sm text-neutral-600">Avg per Group</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {statistics.average_utilization}%
            </p>
            <p className="text-sm text-neutral-600">Avg Utilization</p>
          </div>
        </div>
      </div>

      {/* * Capacity Distribution */}
      <div className="px-6 pb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Capacity Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statistics.utilization_distribution).map(([range, count]) => (
            <div key={range} className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-lg font-bold text-primary">{count}</p>
              <p className="text-sm text-neutral-600">{range}</p>
            </div>
          ))}
        </div>
      </div>

      {/* * Group Status Summary */}
      <div className="px-6 pb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Group Status Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{statistics.groups_with_capacity}</p>
            <p className="text-sm text-neutral-600">With Capacity</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-lg font-bold text-red-600">{statistics.full_groups}</p>
            <p className="text-sm text-neutral-600">Full Groups</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-600">{statistics.empty_groups}</p>
            <p className="text-sm text-neutral-600">Empty Groups</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">
              {parseInt(statistics.total_groups) - parseInt(statistics.full_groups) - parseInt(statistics.empty_groups)}
            </p>
            <p className="text-sm text-neutral-600">Partially Filled</p>
          </div>
        </div>
      </div>

      {/* * Detailed Group Breakdown */}
      {groups.length > 0 && (
        <CardBody className="p-0">
          <div className="px-6 pb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Detailed Group Breakdown
            </h3>
          </div>
          <Table aria-label="Capacity overview table" className="w-full">
            <TableHeader>
              <TableColumn>GROUP</TableColumn>
              <TableColumn>SKILL</TableColumn>
              <TableColumn>CURRENT</TableColumn>
              <TableColumn>CAPACITY</TableColumn>
              <TableColumn>UTILIZATION</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {groups.map((group, index) => {
                const current = parseInt(group.current_student_count);
                const max = parseInt(group.max_student_capacity);
                const utilization = max > 0 ? Math.round((current / max) * 100) : 0;
                const status = getCapacityStatus(current, max);
                
                return (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      {group.group_display_name || `Group ${group.group_number}`}
                    </TableCell>
                    <TableCell>{group.skill?.title || 'N/A'}</TableCell>
                    <TableCell>{current}</TableCell>
                    <TableCell>{max}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              utilization >= 90 ? 'bg-red-500' : 
                              utilization >= 70 ? 'bg-yellow-500' : 
                              utilization >= 50 ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${Math.min(100, utilization)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{utilization}%</span>
                      </div>
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      )}
    </Card>
  );
}
