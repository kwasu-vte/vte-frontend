// * Mentor Announcements Page
// * View announcements relevant to mentors
// * Create announcements for assigned groups

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { Plus, Megaphone, Calendar, Users, AlertCircle, BookOpen } from 'lucide-react';

// * Mock announcement type - replace with actual API types
interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  target_audience: 'all' | 'students' | 'mentors' | 'admins';
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  created_by: string;
  group_id?: string;
  group_name?: string;
}

export default function MentorAnnouncementsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // * Mock data for now - replace with actual API call
  const {
    data: announcements,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['mentor-announcements'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await api.getMentorAnnouncements();
      // return response.data;
      
      // Mock data for demonstration
      return [
        {
          id: '1',
          title: 'System Maintenance Notice',
          content: 'The system will undergo maintenance on Sunday from 2 AM to 4 AM.',
          type: 'warning',
          target_audience: 'all',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          expires_at: '2024-01-20T23:59:59Z',
          created_by: 'Admin User'
        },
        {
          id: '2',
          title: 'New Skills Available',
          content: 'Three new vocational skills have been added to the curriculum.',
          type: 'success',
          target_audience: 'students',
          is_active: true,
          created_at: '2024-01-14T14:30:00Z',
          created_by: 'Admin User'
        },
        {
          id: '3',
          title: 'Group Assignment Update',
          content: 'Your group assignment has been updated. Please check your groups.',
          type: 'info',
          target_audience: 'mentors',
          is_active: true,
          created_at: '2024-01-13T09:15:00Z',
          created_by: 'Admin User',
          group_id: 'group-1',
          group_name: 'Advanced Carpentry Group'
        }
      ] as Announcement[];
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'success': return Megaphone;
      default: return Megaphone;
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all': return 'All Users';
      case 'students': return 'Students Only';
      case 'mentors': return 'Mentors Only';
      case 'admins': return 'Admins Only';
      default: return audience;
    }
  };

  const mentorAnnouncements = announcements?.filter(a => 
    a.target_audience === 'all' || 
    a.target_audience === 'mentors' ||
    a.target_audience === 'students' // Mentors see student announcements too
  ) || [];

  return (
    <div className="space-y-6">
      {/* * Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Announcements
          </h1>
          <p className="text-neutral-600">
            Stay updated with the latest announcements and notifications.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group Announcement</span>
        </button>
      </div>

      {/* * Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Announcements</p>
              <p className="text-2xl font-bold text-neutral-900">{mentorAnnouncements.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Urgent</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mentorAnnouncements.filter(a => a.type === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Group Related</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mentorAnnouncements.filter(a => a.group_id).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* * Announcements List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Announcements</h2>
        </div>
        
        <StateRenderer
          data={mentorAnnouncements}
          isLoading={isLoading}
          error={error}
          loadingComponent={<DefaultLoadingComponent />}
          errorComponent={<DefaultErrorComponent error={error as Error} onRetry={() => { void refetch() }} />}
          emptyComponent={
            <div className="p-12 text-center">
              <Megaphone className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No announcements yet</h3>
              <p className="text-neutral-600 mb-4">You&apos;ll see announcements relevant to mentors here.</p>
            </div>
          }
        >
          {(data) => (
            <div className="divide-y divide-neutral-200">
              {data.map((announcement) => {
                const TypeIcon = getTypeIcon(announcement.type);
                return (
                  <div key={announcement.id} className="p-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <TypeIcon className="w-5 h-5 text-neutral-600" />
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {announcement.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)}`}>
                            {announcement.type.toUpperCase()}
                          </span>
                          {announcement.group_name && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                              {announcement.group_name}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-neutral-600 mb-3">{announcement.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{getAudienceLabel(announcement.target_audience)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                          </div>
                          <span>By {announcement.created_by}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </StateRenderer>
      </div>

      {/* * TODO: Add Create Group Announcement Modal */}
      {/* * This would allow mentors to create announcements for their assigned groups */}
    </div>
  );
}
