// * Admin Mentors Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills, groups, and students pages

'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { MentorsTable } from '@/components/features/admin/MentorsTable';
import { MentorModal } from '@/components/features/admin/MentorModal';
import MentorSkillAssignment from '@/components/features/mentor/MentorSkillAssignment';
import { mentorsApi, skillsApi } from '@/lib/api';
import { MentorProfile, CreateMentorProfilePayload, Skill } from '@/lib/types';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody, Chip, Select, SelectItem } from '@heroui/react';
import { Plus, Search, Eye, AlertTriangle, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getErrorMessage, getErrorTitle, getSuccessTitle, getSuccessMessage } from '@/lib/error-handling';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminMentorsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignSkillsOpen, setIsAssignSkillsOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { addNotification } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // * Initialize filters from query params
  useEffect(() => {
    const skillsParam = searchParams.get('skills');
    const searchQuery = searchParams.get('search');

    if (skillsParam) {
      const skills = skillsParam.split(',').filter(Boolean);
      setSelectedSkills(skills);
    }
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  // * Update URL when filters change
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    router.push(`/admin/mentors?${params.toString()}`, { scroll: false });
  };

  // * Fetch skills for filtering
  const { data: skillsData } = useClientQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await skillsApi.getAll();
      return Array.isArray(response.data) ? response.data : response.data?.items || [];
    },
  });

  // * React Query for data fetching - only run on client
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, error, refetch } = useClientQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const res = await mentorsApi.list({ per_page: '100' })
      return res.data
    },
  })

  // * Client-side filtering
  const mentors = useMemo(() => {
    if (!data) return []
    
    let filteredMentors = data
    
    // * Apply search filter
    if (debouncedSearch.trim()) {
      const searchTerm = debouncedSearch.toLowerCase()
      filteredMentors = filteredMentors.filter(mentor => {
        const fullName = mentor.full_name || `${mentor.user.first_name} ${mentor.user.last_name}`
        const email = mentor.user.email
        const specialization = mentor.specialization
        
        return (
          fullName.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          specialization.toLowerCase().includes(searchTerm)
        )
      })
    }
    
    // * Apply skills filter
    if (selectedSkills.length > 0) {
      filteredMentors = filteredMentors.filter(mentor => {
        if (!mentor.assigned_skills) return false
        
        let mentorSkills: any[] = []
        if (typeof mentor.assigned_skills === 'string') {
          try {
            mentorSkills = JSON.parse(mentor.assigned_skills)
          } catch {
            mentorSkills = []
          }
        } else if (Array.isArray(mentor.assigned_skills)) {
          mentorSkills = mentor.assigned_skills
        }
        
        return selectedSkills.some(skillId => 
          mentorSkills.some(skill => 
            skill.id === skillId || skill.title === skillsData?.find(s => s.id === skillId)?.title
          )
        )
      })
    }
    
    return filteredMentors
  }, [data, debouncedSearch, selectedSkills, skillsData])

  const createMentorMutation = useMutation({
    mutationFn: async (payload: CreateMentorProfilePayload) => {
      const response = await mentorsApi.create(payload)
      return response
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] })
      setIsCreateModalOpen(false)
      addNotification({
        type: 'success',
        title: getSuccessTitle('create', 'mentor'),
        message: getSuccessMessage(response, 'The mentor has been created successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error creating mentor:', error)
      addNotification({
        type: 'error',
        title: getErrorTitle('create', 'mentor'),
        message: getErrorMessage(error, 'An unexpected error occurred while creating the mentor.'),
      });
    }
  })

  // Note: update/delete user APIs are not present in api.ts; leaving edit/delete as no-op for now

  const handleCreateMentor = async (data: CreateMentorProfilePayload) => {
    setIsSubmitting(true);
    try {
      await createMentorMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit mentor
  const handleEditMentor = async (data: CreateMentorProfilePayload | any) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement mentor update API
      console.log('Edit mentor data:', data);
      addNotification({
        type: 'info',
        title: 'Feature Coming Soon',
        message: 'Mentor profile editing will be available soon.',
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating mentor:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'An unexpected error occurred while updating the mentor.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete mentor
  const handleDeleteMentor = async () => {
    if (!selectedMentor) return;
    setIsSubmitting(true);
    try {
      // TODO: Implement mentor delete API
      console.log('Delete mentor:', selectedMentor);
      addNotification({
        type: 'info',
        title: 'Feature Coming Soon',
        message: 'Mentor deletion will be available soon.',
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting mentor:', error);
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'An unexpected error occurred while deleting the mentor.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = useCallback(() => {
    setSelectedMentor(null);
    setIsCreateModalOpen(true);
  }, []);

  // * Open view modal
  const openViewModal = useCallback((mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setIsViewModalOpen(true);
  }, []);

  // * Open edit modal
  const openEditModal = useCallback((mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setIsEditModalOpen(true);
  }, []);

  // * Open delete modal
  const openDeleteModal = useCallback((mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setIsDeleteModalOpen(true);
  }, []);

  // * Open assign skills modal
  const openAssignSkillsModal = useCallback((mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setIsAssignSkillsOpen(true);
  }, []);

  // * Close all modals
  const closeModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsAssignSkillsOpen(false);
    setSelectedMentor(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mentors</h1>
          <p className="text-neutral-600 mt-1">Manage mentors and assigned skills</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <Button color="primary" startContent={<Plus className="w-4 h-4" />} onClick={openCreateModal}>Add Mentor</Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card shadow="sm">
        <CardHeader className="px-4 pt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-600" />
            <p className="text-base font-medium text-neutral-900">Filters</p>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  updateFilters({ search: e.target.value });
                }}
                startContent={<Search className="w-4 h-4 text-neutral-400" />}
                placeholder="Search mentors"
                variant="bordered"
                label="Search"
                className="w-full"
              />
            </div>
            
            <div>
              <Select
                label="Filter by Skills"
                placeholder="Select skills"
                selectedKeys={selectedSkills}
                onSelectionChange={(keys) => {
                  const skills = Array.from(keys) as string[];
                  setSelectedSkills(skills);
                  updateFilters({ skills: skills.join(',') });
                }}
                variant="bordered"
                selectionMode="multiple"
                className="w-full"
              >
                {skillsData?.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.title}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              {selectedSkills.length > 0 && (
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => {
                  setSelectedSkills([]);
                  updateFilters({ skills: '' });
                }}
                >
                  Clear Skills Filter
                </Button>
              )}
            </div>
            
            <Chip variant="flat" color="primary">
              {mentors?.length || 0} mentors
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* Results Card */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Mentors</p>
            <Chip variant="flat">{mentors?.length || 0}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <MentorsTable
            mentors={mentors}
            isLoading={isLoading}
            error={error as Error | null}
            onView={openViewModal}
            onManageProfile={openEditModal}
            onManageGroups={(mentor) => {
              // TODO: Navigate to groups management for this mentor
              addNotification({
                type: 'info',
                title: 'Feature Coming Soon',
                message: `Groups management for ${mentor.full_name || `${mentor.user.first_name} ${mentor.user.last_name}`} will be available soon.`,
              });
            }}
            onAssignSkills={openAssignSkillsModal}
            onCreate={openCreateModal}
          />
        </CardBody>
      </Card>

      {/* * Create Mentor Modal */}
      <MentorModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateMentor as any}
        isLoading={isSubmitting}
      />

      {/* * Edit Mentor Modal */}
      <MentorModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditMentor as any}
        mentor={selectedMentor || null}
        isLoading={isSubmitting}
      />

      {/* * View Mentor Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModals}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Mentor Details</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedMentor && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {selectedMentor.full_name || `${selectedMentor.user.first_name} ${selectedMentor.user.last_name}`}
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {selectedMentor.user.email}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-neutral-700">Specialization:</span>
                    <p className="text-neutral-600">{selectedMentor.specialization}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Phone:</span>
                    <p className="text-neutral-600">{selectedMentor.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Current Students:</span>
                    <p className="text-neutral-600">{selectedMentor.current_student_count || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Total Mentored:</span>
                    <p className="text-neutral-600">{selectedMentor.total_students_mentored || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Status:</span>
                    <p className="text-neutral-600">
                      {selectedMentor.is_active ? 'Active' : 'Inactive'} • 
                      {selectedMentor.is_available ? ' Available' : ' Unavailable'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Created:</span>
                    <p className="text-neutral-600">
                      {selectedMentor.created_at ? new Date(selectedMentor.created_at).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>

                {(() => {
                  // * Handle assigned_skills as either string (JSON) or array
                  let skillsArray: any[] = [];
                  if (selectedMentor.assigned_skills) {
                    if (typeof selectedMentor.assigned_skills === 'string') {
                      try {
                        skillsArray = JSON.parse(selectedMentor.assigned_skills);
                      } catch {
                        // * If parsing fails, treat as empty array
                        skillsArray = [];
                      }
                    } else if (Array.isArray(selectedMentor.assigned_skills)) {
                      skillsArray = selectedMentor.assigned_skills;
                    }
                  }
                  
                  return skillsArray.length > 0 && (
                    <div>
                      <span className="font-medium text-neutral-700 mb-2 block">Assigned Skills:</span>
                      <div className="flex flex-wrap gap-2">
                        {skillsArray.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill.title || skill.name || `Skill ${index + 1}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={closeModals}>
              Close
            </Button>
            <Button 
              color="primary" 
              variant="light"
              onClick={() => {
                closeModals();
                openEditModal(selectedMentor!);
              }}
            >
              Edit Profile
            </Button>
            <Button 
              color="danger" 
              variant="light"
              onClick={() => {
                closeModals();
                openDeleteModal(selectedMentor!);
              }}
            >
              Delete Mentor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Assign Skills Modal */}
      <Modal
        isOpen={isAssignSkillsOpen}
        onClose={closeModals}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Assign Skills</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedMentor && (
              <MentorSkillAssignment
                userId={selectedMentor.user_id}
                mentorProfileId={Number(selectedMentor.id)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={closeModals}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Delete Mentor</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete <strong>{selectedMentor?.full_name || `${selectedMentor?.user.first_name} ${selectedMentor?.user.last_name}`}</strong>? 
              This action cannot be undone and will remove all associated groups and assignments.
            </p>
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
              color="danger"
              onClick={handleDeleteMentor}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Mentor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* * Debug Information (hidden in production) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="bg-neutral-50 p-4 rounded-lg">
          <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
          <div className="text-sm text-neutral-600 space-y-1">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error ? (error as Error).message : 'None'}</p>
            <p><strong>Data Count:</strong> {mentors?.length || 0}</p>
            <p><strong>Query Key:</strong> [&#39;mentors&#39;]</p>
            <p><strong>Mutations:</strong> Create: {createMentorMutation.isPending ? 'Pending' : 'Idle'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
