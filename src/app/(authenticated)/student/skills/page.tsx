// * Student My Skills Page
// * Shows skills available for enrollment and enrolled skills
// * Follows the same pattern as other pages with StateRenderer + React Query

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { api } from '@/lib/api';
import { Skill, Group } from '@/lib/types';
import { Button, Card, CardBody, CardHeader, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Badge, Progress } from '@nextui-org/react';
import { BookOpen, Users, Calendar, Clock, CheckCircle, AlertCircle, Plus, Eye } from 'lucide-react';

interface EnrolledSkill {
  id: string;
  skill: Skill;
  group: Group;
  enrollmentDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
  progress: number;
}

export default function StudentSkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // * React Query for data fetching - get available skills
  const {
    data: availableSkills,
    isLoading: skillsLoading,
    error: skillsError,
    refetch: refetchSkills
  } = useQuery({
    queryKey: ['available-skills'],
    queryFn: async () => {
      const response = await api.getSkills();
      return response.data;
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  // * React Query for enrolled skills
  const {
    data: enrolledSkills,
    isLoading: enrolledLoading,
    error: enrolledError,
    refetch: refetchEnrolled
  } = useQuery({
    queryKey: ['enrolled-skills'],
    queryFn: async () => {
      // TODO: Implement student enrolled skills endpoint
      // For now, return mock data
      return [
        {
          id: 'enrollment-1',
          skill: {
            id: 'skill-1',
            title: 'Web Development',
            description: 'Learn modern web development with React and Node.js',
            max_groups: 3,
            min_students_per_group: 5,
            max_students_per_group: 10,
            groups_count: 2,
            enrollments_count: 15,
            allowed_levels: ['200', '300', '400'],
            date_range_start: '2024-01-01',
            date_range_end: '2024-06-30',
            exclude_weekends: false,
            meta: null,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          group: {
            id: 'group-1',
            name: 'Group A',
            skill: { id: 'skill-1', title: 'Web Development' },
            mentor: { id: 'mentor-1', first_name: 'John', last_name: 'Smith' },
            members: [],
            creation_date: '2024-01-01T00:00:00Z',
            end_date: '2024-06-30T23:59:59Z'
          },
          enrollmentDate: '2024-01-10',
          status: 'enrolled',
          progress: 65
        }
      ] as EnrolledSkill[];
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  // * Enroll in skill mutation
  const enrollSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      // TODO: Implement skill enrollment endpoint
      console.log('Enrolling in skill:', skillId);
      return { skillId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-skills'] });
      queryClient.invalidateQueries({ queryKey: ['available-skills'] });
      setIsEnrollModalOpen(false);
    },
    onError: (error) => {
      console.error('Error enrolling in skill:', error);
    },
  });

  // * Handle skill enrollment
  const handleEnrollSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEnrollModalOpen(true);
  };

  // * Handle confirm enrollment
  const handleConfirmEnrollment = async () => {
    if (!selectedSkill) return;
    
    setIsSubmitting(true);
    try {
      await enrollSkillMutation.mutateAsync(selectedSkill.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle view skill details
  const handleViewSkill = (skill: Skill) => {
    // TODO: Navigate to skill details page
    console.log('View skill details:', skill);
  };

  // * Close modals
  const closeModals = () => {
    setIsEnrollModalOpen(false);
    setSelectedSkill(null);
  };

  // * Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'primary';
      case 'completed': return 'success';
      case 'dropped': return 'danger';
      default: return 'default';
    }
  };

  // * Calculate statistics
  const totalEnrolled = enrolledSkills?.length || 0;
  const completedSkills = enrolledSkills?.filter(s => s.status === 'completed').length || 0;
  const inProgressSkills = enrolledSkills?.filter(s => s.status === 'enrolled').length || 0;

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Skills</h1>
          <p className="text-neutral-600 mt-1">
            View your enrolled skills and discover new ones to learn
          </p>
        </div>
      </div>

      {/* * Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Enrolled Skills</p>
              <p className="text-2xl font-bold text-neutral-900">{totalEnrolled}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Completed</p>
              <p className="text-2xl font-bold text-neutral-900">{completedSkills}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">In Progress</p>
              <p className="text-2xl font-bold text-neutral-900">{inProgressSkills}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* * Enrolled Skills */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">My Enrolled Skills</h2>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <StateRenderer
            data={enrolledSkills}
            isLoading={enrolledLoading}
            error={enrolledError}
            loadingComponent={
              <div className="p-6">
                <DefaultLoadingComponent />
              </div>
            }
            errorComponent={
              <div className="p-6">
                <DefaultErrorComponent 
                  error={enrolledError!} 
                  onRetry={() => refetchEnrolled()} 
                />
              </div>
            }
            emptyComponent={
              <div className="p-6">
                <DefaultEmptyComponent 
                  message="You haven't enrolled in any skills yet. Browse available skills below to get started."
                />
              </div>
            }
          >
            {(data) => (
              <div className="p-6 space-y-4">
                {data.map((enrollment) => (
                  <Card key={enrollment.id}>
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {enrollment.skill.title}
                            </h3>
                            <Chip
                              color={getStatusColor(enrollment.status)}
                              variant="flat"
                              size="sm"
                            >
                              {enrollment.status}
                            </Chip>
                          </div>
                          
                          <p className="text-neutral-600">
                            {enrollment.skill.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-neutral-400" />
                              <span>Group: {enrollment.group.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <span>Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-neutral-400" />
                              <span>Duration: {enrollment.group.creation_date} - {enrollment.group.end_date}</span>
                            </div>
                          </div>
                          
                          {enrollment.status === 'enrolled' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-600">Progress</span>
                                <span className="font-medium">{enrollment.progress}%</span>
                              </div>
                              <Progress
                                value={enrollment.progress}
                                color="primary"
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            color="primary"
                            variant="light"
                            size="sm"
                            startContent={<Eye className="w-4 h-4" />}
                            onClick={() => handleViewSkill(enrollment.skill)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </StateRenderer>
        </div>
      </div>

      {/* * Available Skills */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">Available Skills</h2>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <StateRenderer
            data={availableSkills}
            isLoading={skillsLoading}
            error={skillsError}
            loadingComponent={
              <div className="p-6">
                <DefaultLoadingComponent />
              </div>
            }
            errorComponent={
              <div className="p-6">
                <DefaultErrorComponent 
                  error={skillsError!} 
                  onRetry={() => refetchSkills()} 
                />
              </div>
            }
            emptyComponent={
              <div className="p-6">
                <DefaultEmptyComponent 
                  message="No skills available for enrollment at the moment."
                />
              </div>
            }
          >
            {(data) => (
              <div className="p-6 space-y-4">
                {data.map((skill) => {
                  const isEnrolled = enrolledSkills?.some(e => e.skill.id === skill.id);
                  
                  return (
                    <Card key={skill.id}>
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-neutral-900">
                                {skill.title}
                              </h3>
                              {isEnrolled && (
                                <Badge content="Enrolled" color="primary" variant="flat">
                                  <Chip color="primary" variant="flat" size="sm">
                                    Enrolled
                                  </Chip>
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-neutral-600">
                              {skill.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-neutral-400" />
                                <span>{skill.groups_count} groups available</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-neutral-400" />
                                <span>{skill.date_range_start} - {skill.date_range_end}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neutral-400" />
                                <span>Levels: {skill.allowed_levels?.join(', ') || 'All'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              color="primary"
                              variant="light"
                              size="sm"
                              startContent={<Eye className="w-4 h-4" />}
                              onClick={() => handleViewSkill(skill)}
                            >
                              View Details
                            </Button>
                            {!isEnrolled && (
                              <Button
                                color="primary"
                                size="sm"
                                startContent={<Plus className="w-4 h-4" />}
                                onClick={() => handleEnrollSkill(skill)}
                              >
                                Enroll
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </StateRenderer>
        </div>
      </div>

      {/* * Enrollment Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={closeModals}
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Enroll in Skill</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedSkill && (
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h3 className="font-medium text-neutral-900">{selectedSkill.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{selectedSkill.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-900">Enrollment Details</h4>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p><strong>Duration:</strong> {selectedSkill.date_range_start} - {selectedSkill.date_range_end}</p>
                    <p><strong>Available Groups:</strong> {selectedSkill.groups_count}</p>
                    <p><strong>Students per Group:</strong> {selectedSkill.min_students_per_group} - {selectedSkill.max_students_per_group}</p>
                    <p><strong>Allowed Levels:</strong> {selectedSkill.allowed_levels?.join(', ') || 'All levels'}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Important:</p>
                      <p>You will be automatically assigned to an available group. Group assignments are based on availability and your level.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={closeModals}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onClick={handleConfirmEnrollment}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Confirm Enrollment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Skills Loading:</strong> {skillsLoading ? 'Yes' : 'No'}</p>
          <p><strong>Enrolled Loading:</strong> {enrolledLoading ? 'Yes' : 'No'}</p>
          <p><strong>Available Skills:</strong> {availableSkills?.length || 0}</p>
          <p><strong>Enrolled Skills:</strong> {enrolledSkills?.length || 0}</p>
          <p><strong>Selected Skill:</strong> {selectedSkill?.id || 'None'}</p>
        </div>
      </div>
    </div>
  );
}
