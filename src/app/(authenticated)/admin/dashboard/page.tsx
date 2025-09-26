// * Admin Dashboard Page
// * Tests full AppShell integration with real admin functionality
// * Uses composite data hook for optimized data fetching

'use client';

import React from 'react';
import PWATestPanel from '@/components/shared/PWATestPanel';
import { StatCard, StatCardGrid } from '@/components/shared/StatCard';
import { useAdminDashboardData } from '@/lib/hooks/use-admin-dashboard-data';
import Link from 'next/link';

export default function AdminDashboard() {
  const { sessions, activeSession, statistics, recentEnrollments, isLoading, error } = useAdminDashboardData();

  const totalGroups = statistics?.total_groups ?? '0';
  const totalStudents = statistics?.total_students ?? '0';
  const fullGroups = statistics?.full_groups ?? '0';
  const groupsWithCapacity = statistics?.groups_with_capacity ?? '0';

  return (
    <div className="space-y-6">
      {/* * Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
            <p className="text-neutral-600">Overview of sessions, capacity, and recent activity.</p>
            <div className="mt-3 inline-flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md bg-neutral-100 text-neutral-700">Session:</span>
              <span className="font-medium text-neutral-900">
                {activeSession ? `${activeSession.name}${activeSession.active ? ' (Active)' : ''}` : 'No active session'}
              </span>
            </div>
          </div>
          <PWATestPanel />
        </div>
      </div>

      {/* * Stats */}
      <StatCardGrid>
        <StatCard title="Total Groups" value={totalGroups} color="primary" />
        <StatCard title="Total Students" value={totalStudents} color="success" />
        <StatCard title="Full Groups" value={fullGroups} color="warning" />
        <StatCard title="With Capacity" value={groupsWithCapacity} color="neutral" />
      </StatCardGrid>

      {/* * Content: Activity | Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* * Activity Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
            <Link href="/admin/enrollments" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-neutral-200">
            {recentEnrollments && recentEnrollments.items.length > 0 ? (
              recentEnrollments.items.slice(0, 10).map((enr: any) => (
                <div key={enr.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {enr.user?.first_name} {enr.user?.last_name}
                    </p>
                    <p className="text-xs text-neutral-600 truncate">
                      Enrolled in {enr.skill?.title} • {new Date(enr.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="ml-4 inline-flex items-center px-2 py-1 rounded-md text-xs bg-neutral-100 text-neutral-700 capitalize">
                    {enr.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-neutral-600">No recent activity</div>
            )}
          </div>
        </div>

        {/* * Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/qr-codes" className="block w-full text-left px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary-600 transition-colors">
              Generate QR Codes
            </Link>
            <Link href="/admin/sessions" className="block w-full text-left px-4 py-3 rounded-lg bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors">
              Manage Sessions
            </Link>
            <Link href="/admin/reports" className="block w-full text-left px-4 py-3 rounded-lg bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors">
              View Reports
            </Link>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Sessions</h3>
            <div className="max-h-48 overflow-y-auto divide-y divide-neutral-200">
              {(sessions || []).slice(0, 6).map((s) => (
                <div key={s.id} className="py-2 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-900 truncate">{s.name}</p>
                    <p className="text-xs text-neutral-600 truncate">
                      {s.starts_at ? new Date(s.starts_at).toLocaleDateString() : 'TBD'} - {s.ends_at ? new Date(s.ends_at).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  {s.active && <span className="ml-2 px-2 py-0.5 rounded-md text-xs bg-green-100 text-green-700">Active</span>}
                </div>
              ))}
              {(!sessions || sessions.length === 0) && (
                <div className="py-6 text-center text-neutral-600">No sessions found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
