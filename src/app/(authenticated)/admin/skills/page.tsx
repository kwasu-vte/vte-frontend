// * Admin Skills Management Page
// * Template page demonstrating StateRenderer + React Query pattern
// * This is the blueprint for all other data-driven pages

'use client';

import { useQuery } from '@tanstack/react-query';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent } from '@/components/shared/StateRenderer';
import { DataTable } from '@/components/shared/DataTable';
import { api } from '@/lib/api';
import { Skill } from '@/lib/types';
import { Button } from '@nextui-org/react';
import { Plus } from 'lucide-react';

// * Skills Table Columns
const skillsColumns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'max_groups', label: 'Max Groups' },
  { key: 'min_students_per_group', label: 'Min Students' },
  { key: 'max_students_per_group', label: 'Max Students' },
  { key: 'enrollments_count', label: 'Enrollments' },
  { key: 'groups_count', label: 'Groups' },
  { key: 'actions', label: 'Actions' },
];

export default function AdminSkillsPage() {
  // * React Query for data fetching
  const {
    data: skills,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.getSkills();
      return response.data;
    },
  });

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
          onPress={() => {
            // TODO: Open create skill modal
            console.log('Create skill clicked');
          }}
        >
          Create Skill
        </Button>
      </div>

      {/* * Skills Table with StateRenderer */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <StateRenderer
          data={skills}
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
                message="No skills found. Create your first skill to get started."
                actionButton={
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={() => {
                      // TODO: Open create skill modal
                      console.log('Create skill clicked');
                    }}
                  >
                    Create Skill
                  </Button>
                }
              />
            </div>
          }
        >
          {(data) => (
            <DataTable
              data={data}
              isLoading={false}
              error={null}
              columns={skillsColumns}
              emptyMessage="No skills found"
              onRowClick={(skill) => {
                // TODO: Navigate to skill details or open edit modal
                console.log('Skill clicked:', skill);
              }}
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
          <p><strong>Data Count:</strong> {skills?.length || 0}</p>
          <p><strong>Query Key:</strong> [&apos;skills&apos;]</p>
        </div>
      </div>
    </div>
  );
}
