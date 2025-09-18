// * Attendance Table Component
// * Displays attendance records in a table format with actions
// * Follows the same pattern as other table components

'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { AttendanceRecord } from '@/lib/types';
import { MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (record: AttendanceRecord) => void;
  onView: (record: AttendanceRecord) => void;
  onMarkPresent: (record: AttendanceRecord) => void;
  onMarkAbsent: (record: AttendanceRecord) => void;
}

export function AttendanceTable({
  records,
  onEdit,
  onDelete,
  onView,
  onMarkPresent,
  onMarkAbsent
}: AttendanceTableProps) {
  const columns = [
    { key: 'student', label: 'Student' },
    { key: 'group', label: 'Group' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' },
    { key: 'actions', label: 'Actions' }
  ];

  const getStatusColor = (record: AttendanceRecord) => {
    switch (record.status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'danger';
      case 'late':
        return 'warning';
      case 'excused':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (record: AttendanceRecord) => {
    return record.status.charAt(0).toUpperCase() + record.status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Table aria-label="Attendance records table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={records}>
        {(record) => (
          <TableRow key={record.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">
                  {record.student.first_name} {record.student.last_name}
                </span>
                <span className="text-sm text-neutral-500">{record.student.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">{record.group.name}</span>
                <span className="text-sm text-neutral-500">{record.group.skill.title}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span className="font-medium">{formatDate(record.date)}</span>
              </div>
            </TableCell>
            <TableCell>
              <Chip
                color={getStatusColor(record)}
                variant="flat"
                size="sm"
              >
                {getStatusText(record)}
              </Chip>
            </TableCell>
            <TableCell>
              <div className="max-w-xs">
                <span className="text-sm text-neutral-600 truncate block">
                  {record.notes || 'No notes'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Attendance actions">
                  <DropdownItem
                    key="view"
                    startContent={<Eye className="w-4 h-4" />}
                    onClick={() => onView(record)}
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={<Edit className="w-4 h-4" />}
                    onClick={() => onEdit(record)}
                  >
                    Edit Record
                  </DropdownItem>
                  <DropdownItem
                    key="present"
                    startContent={<CheckCircle className="w-4 h-4" />}
                    onClick={() => onMarkPresent(record)}
                    className={record.status === 'present' ? 'text-success' : ''}
                  >
                    Mark Present
                  </DropdownItem>
                  <DropdownItem
                    key="absent"
                    startContent={<XCircle className="w-4 h-4" />}
                    onClick={() => onMarkAbsent(record)}
                    className={record.status === 'absent' ? 'text-danger' : ''}
                  >
                    Mark Absent
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<Trash2 className="w-4 h-4" />}
                    onClick={() => onDelete(record)}
                  >
                    Delete Record
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
