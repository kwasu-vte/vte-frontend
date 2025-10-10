// * Admin Skills Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This is the blueprint for all other data-driven pages

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientQuery } from '@/lib/hooks/useClientQuery';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { SkillsTable } from '@/components/features/admin/SkillsTable';
import { SkillModal } from '@/components/features/admin/SkillModal';
import { skillsApi } from '@/lib/api';
import { Skill, CreateSkillPayload, UpdateSkillPayload, SkillDateRangePayload } from '@/lib/types';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody, Chip } from '@heroui/react';
import { Plus, AlertTriangle, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getErrorMessage, getErrorTitle, getSuccessTitle, getSuccessMessage } from '@/lib/error-handling';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminSkillsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { addNotification } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // * Fetch detailed skill data for view modal
  const { data: detailedSkillData, isLoading: isDetailedLoading } = useClientQuery({
    queryKey: ['skill-details', selectedSkill?.id],
    queryFn: async () => {
      if (!selectedSkill?.id) return null;
      const res = await skillsApi.getById(selectedSkill.id);
      return res.data;
    },
    enabled: !!selectedSkill?.id && isViewModalOpen,
  });

  // * Simple data fetching
  const {
    data: skills,
    isLoading,
    error,
    refetch
  } = useClientQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      console.log('[Skills] Starting API call...');
      const response = await skillsApi.getAll();
      console.log('[Skills] Raw API response:', response);
      console.log('[Skills] Response.data:', response.data);
      console.log('[Skills] Response.data.items:', response.data?.items);
      console.log('[Skills] Items length:', response.data?.items?.length);
      
      const extractedItems = response.data.items || [];
      console.log('[Skills] Extracted items:', extractedItems);
      console.log('[Skills] Extracted items length:', extractedItems.length);
      
      return extractedItems;
    },
  });

  console.log('🔍 [Skills] Component state:', { 
    skills, 
    skillsLength: skills?.length,
    isLoading, 
    error,
    hasWindow: typeof window !== 'undefined'
  });

  // * Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: async (data: CreateSkillPayload) => {
      const response = await skillsApi.create(data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsCreateModalOpen(false);
      addNotification({
        type: 'success',
        title: getSuccessTitle('create', 'skill'),
        message: getSuccessMessage(response, 'The skill has been created successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error creating skill:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('create', 'skill'),
        message: getErrorMessage(error, 'An unexpected error occurred while creating the skill.'),
      });
    },
  });

  // * Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: async (data: UpdateSkillPayload) => {
      if (!selectedSkill) throw new Error('No skill selected');
      const response = await skillsApi.update(selectedSkill.id, data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsEditModalOpen(false);
      setSelectedSkill(null);
      addNotification({
        type: 'success',
        title: getSuccessTitle('update', 'skill'),
        message: getSuccessMessage(response, 'The skill has been updated successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error updating skill:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('update', 'skill'),
        message: getErrorMessage(error, 'An unexpected error occurred while updating the skill.'),
      });
    },
  });

  // * Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      const response = await skillsApi.delete(skillId);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsDeleteModalOpen(false);
      setSelectedSkill(null);
      addNotification({
        type: 'success',
        title: getSuccessTitle('delete', 'skill'),
        message: getSuccessMessage(response, 'The skill has been deleted successfully.'),
      });
    },
    onError: (error: any) => {
      console.error('Error deleting skill:', error);
      addNotification({
        type: 'error',
        title: getErrorTitle('delete', 'skill'),
        message: getErrorMessage(error, 'An unexpected error occurred while deleting the skill.'),
      });
    },
  });

  // * Handle create skill
  const handleCreateSkill = useCallback(async (data: CreateSkillPayload | UpdateSkillPayload) => {
    console.log('🎯 Creating skill with data:', data);
    setIsSubmitting(true);
    try {
      await createSkillMutation.mutateAsync(data as CreateSkillPayload);
      console.log('🎯 Skill created successfully');
    } catch (error) {
      console.error('🎯 Error creating skill:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [createSkillMutation]);

  // * Handle edit skill
  const handleEditSkill = useCallback(async (data: CreateSkillPayload | UpdateSkillPayload) => {
    setIsSubmitting(true);
    try {
      await updateSkillMutation.mutateAsync(data as UpdateSkillPayload);
    } finally {
      setIsSubmitting(false);
    }
  }, [updateSkillMutation]);

  // Basic date range update action (trigger example)
  async function handleUpdateDateRange(skill: Skill, payload: SkillDateRangePayload) {
    setIsSubmitting(true)
    try {
      await skillsApi.updateDateRange(String(skill.id), payload)
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      addNotification({ type: 'success', title: 'Date Range Updated', message: 'Skill date range saved.' })
    } catch (error) {
      addNotification({ type: 'error', title: 'Update Failed', message: getErrorMessage(error, 'Could not update date range.') })
    } finally {
      setIsSubmitting(false)
    }
  }

  // * Handle delete skill
  const handleDeleteSkill = async () => {
    if (!selectedSkill) return;
    setIsSubmitting(true);
    try {
      await deleteSkillMutation.mutateAsync(selectedSkill.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Open create modal
  const openCreateModal = useCallback(() => {
    setSelectedSkill(null);
    setIsCreateModalOpen(true);
  }, []);

  // * Open view modal
  const openViewModal = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setIsViewModalOpen(true);
  }, []);

  // * Open edit modal
  const openEditModal = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  }, []);

  // * Open delete modal
  const openDeleteModal = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setIsDeleteModalOpen(true);
  }, []);

  // * Close all modals
  const closeModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedSkill(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Skills Management</h1>
          <p className="text-neutral-600 mt-1">
            Manage vocational skills and courses
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Create Skill
        </Button>
      </div>

      {/* Info: How to use */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm">
        Manage skills, update details, and set date ranges. Use the actions to view, edit, or delete. Assignments and schedules are managed from their dedicated pages.
      </div>

      {/* * Skills Table */}
      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Skills</p>
            <Chip variant="flat">{skills?.length || 0}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <SkillsTable
            skills={skills ?? []}
            isLoading={isLoading}
            error={error}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onCreate={openCreateModal}
            onView={openViewModal}
            onManageGroups={(skill) => {
              router.push(`/admin/skills/${skill.id}/groups`);
            }}
            onManageEnrollments={(skill) => {
              router.push(`/admin/enrollments?skill_id=${skill.id}`);
            }}
          />
        </CardBody>
      </Card>

      {/* * Create Skill Modal */}
      <SkillModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateSkill}
        isLoading={isSubmitting}
      />

      {/* * Edit Skill Modal */}
      <SkillModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditSkill}
        skill={selectedSkill}
        isLoading={isSubmitting}
      />

      {/* * View Skill Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModals}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Skill Details</h2>
                <p className="text-sm text-neutral-500">Comprehensive information about this skill</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="px-6 py-4">
            {selectedSkill && (
              <div className="space-y-6">
                {isDetailedLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                      <div className="text-neutral-500">Loading skill details...</div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* * Skill Overview Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                            {detailedSkillData?.title || selectedSkill.title}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {detailedSkillData?.description || selectedSkill.description || 'No description provided'}
                          </p>
                        </div>
                        <Chip 
                          color="primary"
                          variant="flat"
                          size="sm"
                        >
                          Active
                        </Chip>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{detailedSkillData?.groups_count || selectedSkill.groups_count || 0}</div>
                          <div className="text-xs text-neutral-600">Current Groups</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-neutral-700">{detailedSkillData?.max_groups || selectedSkill.max_groups || 0}</div>
                          <div className="text-xs text-neutral-600">Max Groups</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{detailedSkillData?.enrollments_count || selectedSkill.enrollments_count || 0}</div>
                          <div className="text-xs text-neutral-600">Enrollments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{detailedSkillData?.max_students_per_group || selectedSkill.max_students_per_group || 0}</div>
                          <div className="text-xs text-neutral-600">Max per Group</div>
                        </div>
                      </div>
                    </div>

                    {/* * Skill Configuration */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Skill Configuration
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Min Students per Group</label>
                            <p className="text-sm font-semibold text-neutral-900 mt-1">{detailedSkillData?.min_students_per_group || selectedSkill.min_students_per_group || '—'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Max Students per Group</label>
                            <p className="text-sm font-semibold text-neutral-900 mt-1">{detailedSkillData?.max_students_per_group || selectedSkill.max_students_per_group || '—'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Max Groups</label>
                            <p className="text-sm font-semibold text-neutral-900 mt-1">{detailedSkillData?.max_groups || selectedSkill.max_groups || '—'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Exclude Weekends</label>
                            <div className="mt-1">
                              <Chip 
                                size="sm" 
                                variant="flat" 
                                color={detailedSkillData?.exclude_weekends ? 'warning' : 'success'}
                              >
                                {detailedSkillData?.exclude_weekends ? 'Excluded' : 'Included'}
                              </Chip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* * Allowed Levels */}
                    {(detailedSkillData?.allowed_levels || selectedSkill.allowed_levels) && (
                      <div className="bg-white border border-neutral-200 rounded-xl p-6">
                        <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Allowed Levels
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(detailedSkillData?.allowed_levels || selectedSkill.allowed_levels || []).map((level: string) => (
                            <Chip key={level} size="sm" variant="flat" color="primary">Level {level}</Chip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* * Date Range Information */}
                    {(detailedSkillData?.date_range_start || detailedSkillData?.date_range_end || selectedSkill.date_range_start || selectedSkill.date_range_end) && (
                      <div className="bg-white border border-neutral-200 rounded-xl p-6">
                        <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Date Range
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Start Date</label>
                            <p className="text-sm font-semibold text-neutral-900 mt-1">
                              {detailedSkillData?.date_range_start || selectedSkill.date_range_start 
                                ? new Date(detailedSkillData?.date_range_start || selectedSkill.date_range_start!).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'Not set'
                              }
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">End Date</label>
                            <p className="text-sm font-semibold text-neutral-900 mt-1">
                              {detailedSkillData?.date_range_end || selectedSkill.date_range_end 
                                ? new Date(detailedSkillData?.date_range_end || selectedSkill.date_range_end!).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'Not set'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* * Metadata */}
                    {(detailedSkillData?.meta || selectedSkill.meta) && (detailedSkillData?.meta?.length || selectedSkill.meta?.length) && (
                      <div className="bg-white border border-neutral-200 rounded-xl p-6">
                        <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Tags & Metadata
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(detailedSkillData?.meta || selectedSkill.meta || []).map((tag: string, index: number) => (
                            <Chip key={index} size="sm" variant="flat" color="secondary">{tag}</Chip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* * Creation Info */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Creation Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Created Date</label>
                          <p className="text-sm font-semibold text-neutral-900 mt-1">
                            {detailedSkillData?.created_at || selectedSkill.created_at 
                              ? new Date(detailedSkillData?.created_at || selectedSkill.created_at!).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : '—'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Last Updated</label>
                          <p className="text-sm font-semibold text-neutral-900 mt-1">
                            {detailedSkillData?.updated_at || selectedSkill.updated_at 
                              ? new Date(detailedSkillData?.updated_at || selectedSkill.updated_at!).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : '—'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter className="px-6 py-4">
            <Button 
              color="default" 
              variant="light" 
              onClick={closeModals}
              className="font-medium"
            >
              Close
            </Button>
            <Button 
              color="primary" 
              variant="light"
              onClick={() => {
                closeModals();
                openEditModal(selectedSkill!);
              }}
              className="font-medium"
            >
              Edit
            </Button>
            <Button 
              color="danger" 
              variant="light"
              onClick={() => {
                closeModals();
                openDeleteModal(selectedSkill!);
              }}
              className="font-medium"
            >
              Delete
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
              <h2 className="text-lg font-semibold">Delete Skill</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-600">
              Are you sure you want to delete <strong>{selectedSkill?.title}</strong>? 
              This action cannot be undone and will remove all associated groups and enrollments.
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
              onClick={handleDeleteSkill}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Skill
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}
