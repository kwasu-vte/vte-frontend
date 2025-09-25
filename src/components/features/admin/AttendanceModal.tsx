// * Attendance Modal Component
// * Handles creating and editing attendance records
// * Follows the same pattern as other modal components

'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { AttendanceRecord, CreateAttendanceRecordPayload, UpdateAttendanceRecordPayload } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAttendanceRecordPayload | UpdateAttendanceRecordPayload) => void;
  record?: AttendanceRecord | null;
  isLoading?: boolean;
}

export function AttendanceModal({
  isOpen,
  onClose,
  onSubmit,
  record,
  isLoading = false
}: AttendanceModalProps) {
  const [formData, setFormData] = useState({
    student_id: '',
    group_id: '',
    date: '',
    status: 'present',
    notes: ''
  });

  // * Fetch students for the student selection
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await api.getStudents({ per_page: 100 });
      return response.data?.items ?? [];
    },
  });

  // * Fetch groups for the group selection
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await api.getSkillGroups({ per_page: 100 });
      // Map to minimal shape for the Select usage below
      return (response.data?.items ?? []).map((g: any) => ({
        id: String(g.id),
        name: g.group_display_name || `Group ${g.group_number}`,
        skill: { title: g.skill?.title ?? 'Unknown' },
      }));
    },
  });

  // * Reset form when modal opens/closes or record changes
  useEffect(() => {
    if (isOpen) {
      if (record) {
        setFormData({
          student_id: record.student.id,
          group_id: record.group.id,
          date: record.date,
          status: record.status,
          notes: record.notes || ''
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          student_id: '',
          group_id: '',
          date: today,
          status: 'present',
          notes: ''
        });
      }
    }
  }, [isOpen, record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.group_id || !formData.date) {
      return;
    }

    const submitData: CreateAttendanceRecordPayload | UpdateAttendanceRecordPayload = {
      student_id: formData.student_id,
      group_id: formData.group_id,
      date: formData.date,
      status: formData.status as 'present' | 'absent' | 'late' | 'excused',
      notes: formData.notes || null
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.student_id && formData.group_id && formData.date;

  const statusOptions = [
    { key: 'present', value: 'present', label: 'Present' },
    { key: 'absent', value: 'absent', label: 'Absent' },
    { key: 'late', value: 'late', label: 'Late' },
    { key: 'excused', value: 'excused', label: 'Excused' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            {record ? 'Edit Attendance Record' : 'Add Attendance Record'}
          </h2>
          <p className="text-sm text-neutral-600">
            {record ? 'Update attendance information' : 'Record student attendance for a specific date'}
          </p>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Student"
                placeholder="Select a student"
                selectedKeys={formData.student_id ? [formData.student_id] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('student_id', selectedKey);
                }}
                isRequired
                variant="bordered"
              >
                {students?.map((student: any) => (
                  <SelectItem key={String(student.id)} value={String(student.id)}>
                    {student.full_name ?? student.matric_number ?? String(student.id)}
                  </SelectItem>
                )) || []}
              </Select>

              <Select
                label="Group"
                placeholder="Select a group"
                selectedKeys={formData.group_id ? [formData.group_id] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('group_id', selectedKey);
                }}
                isRequired
                variant="bordered"
              >
                {groups?.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} - {group.skill.title}
                  </SelectItem>
                )) || []}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                isRequired
                variant="bordered"
              />
              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={formData.status ? [formData.status] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('status', selectedKey);
                }}
                isRequired
                variant="bordered"
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Textarea
              label="Notes"
              placeholder="Add any additional notes (optional)"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              variant="bordered"
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              isDisabled={!isFormValid || isLoading}
            >
              {record ? 'Update Record' : 'Add Record'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
