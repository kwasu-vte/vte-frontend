// * Admin Mentors Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills, groups, and students pages

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MentorsTable } from '@/components/features/admin/MentorsTable';
import { MentorModal } from '@/components/features/admin/MentorModal';
import { api } from '@/lib/api';
import { MentorProfile, CreateMentorProfilePayload } from '@/lib/types';
import { Button, Input } from '@nextui-org/react';
import { Plus, Search } from 'lucide-react';

export default function AdminMentorsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const queryClient = useQueryClient();

  // * React Query for data fetching - only run on client
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['mentors', { search: debouncedSearch }],
    queryFn: async () => {
      const res = await api.getMentors({ search: debouncedSearch || undefined, per_page: '25' })
      return res.data
    },
    enabled: typeof window !== 'undefined',
  })

  const mentors = useMemo(() => data ?? [], [data])

  const createMentorMutation = useMutation({
    mutationFn: async (payload: CreateMentorProfilePayload) => {
      const response = await api.createMentor(payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] })
      setIsCreateModalOpen(false)
    },
  })

  // * Update mentor mutation
  const updateMentorMutation = useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      if (!selectedMentor) throw new Error('No mentor selected');
      const response = await api.updateUser(selectedMentor.id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      setIsEditModalOpen(false);
      setSelectedMentor(null);
    },
    onError: (error) => {
      console.error('Error updating mentor:', error);
    },
  });

  // * Delete mentor mutation
  const deleteMentorMutation = useMutation({
    mutationFn: async (mentorId: string) => {
      await api.deleteUser(mentorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      setIsDeleteModalOpen(false);
      setSelectedMentor(null);
    },
    onError: (error) => {
      console.error('Error deleting mentor:', error);
    },
  });

  const handleCreateMentor = async (data: CreateMentorProfilePayload) => {
    setIsSubmitting(true);
    try {
      await createMentorMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle edit mentor
  const handleEditMentor = async (data: CreateUserPayload | UpdateUserPayload) => {
    setIsSubmitting(true);
    try {
      await updateMentorMutation.mutateAsync(data as UpdateUserPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  // * Handle delete mentor
  const handleDeleteMentor = async () => {
    if (!selectedMentor) return;
    setIsSubmitting(true);
    try {
      await deleteMentorMutation.mutateAsync(selectedMentor.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedMentor(null);
    setIsCreateModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setSelectedMentor(null);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mentors</h1>
          <p className="text-neutral-600 mt-1">Manage mentors and assigned skills</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<Search className="w-4 h-4 text-neutral-400" />}
            placeholder="Search mentors"
            variant="bordered"
            className="w-full md:w-80"
          />
          <Button color="primary" startContent={<Plus className="w-4 h-4" />} onClick={openCreateModal}>Add Mentor</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <MentorsTable
          mentors={mentors}
          onView={(mentor) => console.log('View mentor', mentor)}
          onManageProfile={(mentor) => console.log('Manage profile', mentor)}
          onManageGroups={(mentor) => console.log('Manage groups', mentor)}
        />
      </div>

      {/* * Create Mentor Modal */}
      <MentorModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateMentor as any}
        isLoading={isSubmitting}
      />

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Data Count:</strong> {mentors?.length || 0}</p>
          <p><strong>Query Key:</strong> ['mentors']</p>
          <p><strong>Mutations:</strong> Create: {createMentorMutation.isPending ? 'Pending' : 'Idle'}</p>
        </div>
      </div>
    </div>
  );
}
