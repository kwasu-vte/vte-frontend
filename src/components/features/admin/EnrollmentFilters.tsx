"use client"
import React from "react"
import { Select, SelectItem, Button } from "@nextui-org/react"
import { academicSessionsApi, skillsApi } from "@/src/lib/api"
import { useQuery } from "@tanstack/react-query"
import type { AcademicSession, Skill } from "@/src/lib/types"

/**
 * * EnrollmentFilters
 * Filter panel for enrollments with preset saving capability.
 * TODO: Build filters for session, skill, status, date range; support preset save/load.
 *
 * Props:
 * - currentFilters: Record<string, any>
 * - availableSkills: Array<{ id: string; name: string }>
 * - onFilterChange: (filters: Record<string, any>) => void
 */
export type EnrollmentFiltersProps = {
  currentFilters: Record<string, unknown>
  availableSkills: Array<{ id: string; name: string }>
  onFilterChange: (filters: Record<string, unknown>) => void
}

export default function EnrollmentFilters({ currentFilters, availableSkills, onFilterChange }: EnrollmentFiltersProps) {
  const { data: sessionsResp } = useQuery({
    queryKey: ["academic-sessions"],
    queryFn: () => academicSessionsApi.getAll(),
  })

  const { data: skillsResp, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => skillsApi.getAll(),
    initialData: availableSkills?.length
      ? { success: true, message: "", data: availableSkills as unknown as Skill[] }
      : undefined,
  })

  const [filters, setFilters] = React.useState<Record<string, unknown>>(currentFilters || {})

  const sessions = (sessionsResp?.data as AcademicSession[]) || []
  const skills = (skillsResp?.data as Skill[]) || []

  const handleChange = (key: string, value: unknown) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    onFilterChange(next)
  }

  const reset = () => {
    setFilters({})
    onFilterChange({})
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="w-full md:w-64">
        <Select
          label="Academic Session"
          selectedKeys={filters.academic_session_id ? new Set([String(filters.academic_session_id)]) : new Set([])}
          onChange={(e) => handleChange("academic_session_id", e.target.value ? Number(e.target.value) : undefined)}
          placeholder="All sessions"
          size="sm"
        >
          {sessions.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="w-full md:w-64">
        <Select
          label="Skill"
          isLoading={skillsLoading}
          selectedKeys={filters.skill_id ? new Set([String(filters.skill_id)]) : new Set([])}
          onChange={(e) => handleChange("skill_id", e.target.value || undefined)}
          placeholder="All skills"
          size="sm"
        >
          {skills.map((sk) => (
            <SelectItem key={sk.id} value={sk.id}>
              {sk.title}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex gap-2">
        <Button variant="bordered" size="sm" onPress={reset}>Reset</Button>
      </div>
    </div>
  )
}


