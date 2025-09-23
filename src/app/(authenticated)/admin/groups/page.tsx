// * Admin Groups Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This follows the same pattern as the skills page

'use client';

import { useQuery } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { GroupsTable } from '@/components/features/admin/GroupsTable';
import { api } from '@/lib/api';
import { Button } from '@nextui-org/react';
import { Eye } from 'lucide-react';

export default function AdminGroupsPage() {

  // * React Query for data fetching - only run on client
  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await api.getGroups();
      // * Extract items from paginated response
      return response.data?.items || [];
    },
    enabled: typeof window !== 'undefined', // * Only enable on client side
  });

  // * Read-only page: only view navigation handlers
  const handleView = (groupId: string) => {
    // TODO: Navigate to admin skill group detail page when available
    console.log('View group', groupId);
  };

  return (
    <div className="space-y-6">
      {/* * Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Groups</h1>
          <p className="text-neutral-600 mt-1">
            View groups and their status. Creation and editing are disabled.
          </p>
        </div>
      </div>

      {/* * Groups Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={groups}
          isLoading={isLoading}
          error={error}
          loadingComponent={
            <div className="p-6">
              <DefaultLoadingComponent />
            </div>
          }
          errorComponent={
            <div className="p-6">
              <DefaultErrorComponent 
                error={error!} 
                onRetry={() => refetch()} 
              />
            </div>
          }
          emptyComponent={
            <div className="p-6">
              <DefaultEmptyComponent 
                message="No groups found."
              />
            </div>
          }
        >
          {(data) => (
            <GroupsTable
              groups={data}
              onView={(group) => handleView(group.id)}
            />
          )}
        </StateRenderer>
      </div>

      {/* * Debug Information */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Debug Information</h3>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Data Count:</strong> {groups?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;groups&apos;]</p>
          <p><strong>Mode:</strong> Read-only</p>
        </div>
      </div>
    </div>
  );
}
