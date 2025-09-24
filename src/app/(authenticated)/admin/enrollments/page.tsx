'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Enrollment, PaginatedResponse } from '@/lib/types';
import { StateRenderer, DefaultLoadingComponent, DefaultErrorComponent } from '@/components/shared/StateRenderer';
import { EnrollmentFilters } from '@/components/features/admin/EnrollmentFilters';
import { EnrollmentsTable } from '@/components/features/admin/EnrollmentsTable';
import { Button } from '@nextui-org/react';
import { RefreshCw } from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const [filters, setFilters] = useState<{ academic_session_id?: number; skill_id?: string; per_page?: number }>({ per_page: 25 });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-enrollments', filters],
    queryFn: async () => (await api.getAllEnrollments(filters)).data as PaginatedResponse<Enrollment>,
    enabled: typeof window !== 'undefined',
  });

  const rows = useMemo(() => data?.results ?? [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Enrollments</h1>
          <p className="text-neutral-600 mt-1">Filter, review and assign enrollments.</p>
        </div>
        <Button variant="light" startContent={<RefreshCw className="w-4 h-4" />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
          <EnrollmentFilters
            value={filters}
            onChange={(v) => setFilters((s) => ({ ...s, ...v }))}
            defaultPerPage={25}
          />
        </div>

        <StateRenderer
          data={rows}
          isLoading={isLoading}
          error={error as Error | null}
          loadingComponent={<div className="p-6"><DefaultLoadingComponent /></div>}
          errorComponent={<div className="p-6"><DefaultErrorComponent error={error as Error} onRetry={() => refetch()} /></div>}
          emptyComponent={<div className="p-6 text-center text-neutral-600">No enrollments found.</div>}
        >
          {(items) => (
            <div className="p-4">
              <EnrollmentsTable enrollments={items} perPage={filters.per_page ?? 25} />
            </div>
          )}
        </StateRenderer>
      </div>
    </div>
  );
}


