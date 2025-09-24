"use client"
import React from "react"
import { Card, CardBody } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/src/lib/api"
import type { GroupStatistics } from "@/src/lib/types"
import { StatCard, StatCardGrid } from "@/src/components/shared/StatCard"

/**
 * * MentorWorkloadView
 * KPIs for mentor workload using group statistics (skill scoped optional).
 */
export type MentorWorkloadViewProps = {
  skillId?: number
  academicSessionId?: number
}

export default function MentorWorkloadView(props: MentorWorkloadViewProps) {
  const { skillId, academicSessionId } = props

  const { data, isLoading } = useQuery({
    queryKey: ["group-statistics", skillId, academicSessionId],
    queryFn: async () => {
      const res = await api.getGroupStatistics({
        skill_id: skillId,
        academic_session_id: academicSessionId,
      })
      return res?.data as GroupStatistics
    },
  })

  if (isLoading) {
    return (
      <StatCardGrid columns={4}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} shadow="sm" className="p-6">
            <CardBody>
              <div className="h-6 w-28 bg-neutral-200 rounded mb-2" />
              <div className="h-8 w-20 bg-neutral-200 rounded" />
            </CardBody>
          </Card>
        ))}
      </StatCardGrid>
    )
  }

  const stats = data

  return (
    <div className="space-y-6">
      <StatCardGrid columns={4}>
        <StatCard title="Total Groups" value={stats?.total_groups ?? 0} />
        <StatCard title="Total Students" value={stats?.total_students ?? 0} />
        <StatCard title="Avg Students/Group" value={stats?.average_students_per_group ?? 0} />
        <StatCard title="Full Groups" value={stats?.full_groups ?? 0} color="warning" />
      </StatCardGrid>
      <Card shadow="sm" className="p-4">
        <CardBody>
          <p className="text-sm text-neutral-500">Utilization distribution:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
            {stats && Object.entries(stats.utilization_distribution).map(([k, v]) => (
              <div key={k} className="border rounded-md px-3 py-2">
                <p className="text-xs text-neutral-500">{k}</p>
                <p className="text-base font-medium text-neutral-900">{v}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}


