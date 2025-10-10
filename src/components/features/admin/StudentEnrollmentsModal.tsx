"use client";

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardHeader, CardBody, Chip, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api";
import type { StudentProfile, Enrollment } from "@/lib/types";
import { BookOpen, Calendar, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import EnrollmentStatusBadge from './EnrollmentStatusBadge';

interface StudentEnrollmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
}

export function StudentEnrollmentsModal({ isOpen, onClose, student }: StudentEnrollmentsModalProps) {
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  const { data: enrollments, isLoading, error } = useQuery({
    queryKey: ["student-enrollments", student?.user_id],
    queryFn: async () => {
      if (!student?.user_id) return [];
      // * Get enrollments for this specific student by fetching all and filtering
      const response = await enrollmentsApi.getAll({ 
        per_page: 100 
      });
      // * Filter enrollments for this specific student
      return (response.data?.items || []).filter(enrollment => enrollment.user_id === student.user_id);
    },
    enabled: isOpen && !!student?.user_id,
  });

  const handleViewEnrollments = () => {
    // * Navigate to enrollments page with student filter
    window.open(`/admin/enrollments?student_id=${student?.user_id}`, '_blank', 'noopener,noreferrer');
  };

  const getEnrollmentIcon = (enrollment: Enrollment) => {
    const status = enrollment.status.toLowerCase();
    if (status === 'assigned') return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === 'paid') return <CheckCircle className="w-4 h-4 text-primary" />;
    if (status === 'pending_payment') return <AlertTriangle className="w-4 h-4 text-warning" />;
    return <BookOpen className="w-4 h-4 text-neutral-400" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Student Enrollments</h2>
          </div>
          <p className="text-sm text-neutral-600">
            {student?.full_name} ({student?.matric_number})
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-neutral-600">Loading enrollments...</span>
            </div>
          )}

          {error && (
            <div className="text-center p-8">
              <div className="text-red-500 mb-2">
                <AlertTriangle className="w-12 h-12" />
              </div>
              <div className="text-neutral-700">Failed to load enrollments</div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} shadow="sm" className="border border-neutral-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                          {getEnrollmentIcon(enrollment)}
                          <div>
                            <h3 className="font-medium text-neutral-900">
                              {enrollment.skill?.title || 'Unknown Skill'}
                            </h3>
                            <p className="text-sm text-neutral-500">
                              Enrollment ID: {enrollment.id}
                            </p>
                          </div>
                        </div>
                        <EnrollmentStatusBadge status={enrollment.status.toUpperCase() as any} />
                      </CardHeader>
                      <CardBody className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-sm text-neutral-600">Enrolled</p>
                              <p className="text-sm font-medium">{formatDate(enrollment.created_at)}</p>
                            </div>
                          </div>
                          
                          {enrollment.group && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-neutral-400" />
                              <div>
                                <p className="text-sm text-neutral-600">Assigned Group</p>
                                <p className="text-sm font-medium">
                                  {enrollment.group.group_display_name || `Group ${enrollment.group.group_number}`}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className={`w-2 h-2 rounded-full ${
                                enrollment.payment_status === 'paid' ? 'bg-success' : 
                                enrollment.payment_status === 'failed' ? 'bg-danger' : 'bg-warning'
                              }`} />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-600">Payment</p>
                              <p className="text-sm font-medium capitalize">
                                {enrollment.payment_status === 'paid' ? 'Paid' : 
                                 enrollment.payment_status === 'failed' ? 'Failed' : 'Pending'}
                              </p>
                            </div>
                          </div>

                          {enrollment.academic_session && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <div>
                                <p className="text-sm text-neutral-600">Session</p>
                                <p className="text-sm font-medium">{enrollment.academic_session.name}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Enrollments</h3>
                  <p className="text-neutral-600">
                    This student hasn't enrolled in any skills yet.
                  </p>
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
          {enrollments && enrollments.length > 0 && (
            <Button color="primary" onPress={handleViewEnrollments}>
              Manage in Enrollments Page
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
