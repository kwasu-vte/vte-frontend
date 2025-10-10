'use client'

import React from 'react'
import { Card, CardHeader, CardBody, Chip } from '@heroui/react'

type Group = {
  id: string
  group_display_name?: string
  group_number?: string | number
  is_full?: boolean
  current_student_count?: string | number
  max_student_capacity?: string | number
  capacity_percentage?: number | string
}

export function SkillGroupsClient({ skillTitle, groups }: { skillTitle: string; groups: Group[] }) {
  const count = groups?.length || 0
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{skillTitle} • Groups</h1>
        <p className="text-neutral-600 mt-1">Manage groups and view capacity for this skill.</p>
      </div>

      <Card shadow="sm">
        <CardHeader className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-medium text-neutral-900">Groups</p>
            <Chip variant="flat">{count}</Chip>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {count === 0 ? (
              <div className="col-span-full text-neutral-600">No groups found for this skill.</div>
            ) : (
              groups.map((g) => {
                const percent = Math.round(Number(g.capacity_percentage) || 0)
                const isFull = Boolean(g.is_full)
                return (
                  <div
                    key={g.id}
                    className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">Group {g.group_display_name || g.group_number}</h3>
                      <Chip size="sm" color={isFull ? 'danger' : 'success'} variant="flat">
                        {isFull ? 'Full' : 'Has Capacity'}
                      </Chip>
                    </div>
                    <p className="text-sm text-neutral-600 mt-2">
                      {g.current_student_count}/{g.max_student_capacity} students • {percent}%
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default SkillGroupsClient


