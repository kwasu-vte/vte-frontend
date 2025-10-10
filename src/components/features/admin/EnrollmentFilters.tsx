"use client"
import React from "react"
import { Select, SelectItem, Button } from "@heroui/react"
import { academicSessionsApi, skillsApi } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import type { AcademicSession, Skill } from "@/lib/types"
import { useSessionStore } from "@/lib/stores/sessionStore"

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
  value: { academic_session_id?: number; skill_id?: string; per_page?: number }
  onChange: (filters: { academic_session_id?: number; skill_id?: string; per_page?: number }) => void
  defaultPerPage?: number
}

export function EnrollmentFilters({ value, onChange, defaultPerPage = 25 }: EnrollmentFiltersProps) {
  const { activeSessionId } = useSessionStore()
  const { data: sessionsResp } = useQuery({
    queryKey: ["academic-sessions"],
    queryFn: () => academicSessionsApi.getAll(),
  })

  const { data: skillsResp, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => skillsApi.getAll(),
  })

  const [filters, setFilters] = React.useState<{ academic_session_id?: number; skill_id?: string; per_page?: number }>(value || { per_page: defaultPerPage })

  const sessions = React.useMemo(() => (sessionsResp?.data as AcademicSession[]) || [], [sessionsResp?.data])
  const skills = React.useMemo(() => {
    if (!skillsResp?.data) return []
    
    // * Handle both direct array and paginated response
    if (Array.isArray(skillsResp.data)) {
      return skillsResp.data as Skill[]
    }
    
    // * Handle paginated response with items
    if ((skillsResp.data as any)?.items) {
      return (skillsResp.data as any).items as Skill[]
    }
    
    return []
  }, [skillsResp?.data])

  // * Prefer the globally active session from the store when absent
  React.useEffect(() => {
    if (!filters.academic_session_id && activeSessionId) {
      const next = { ...filters, academic_session_id: Number(activeSessionId) }
      setFilters(next)
      onChange(next)
    }
  }, [activeSessionId, filters, onChange])

  // * Fallback: if store is not yet populated, use the session marked active from API list
  React.useEffect(() => {
    if (!filters.academic_session_id && sessions.length > 0 && !activeSessionId) {
      const active = sessions.find((s) => (s as any).active === true)
      if (active) {
        const next = { ...filters, academic_session_id: Number(active.id) }
        setFilters(next)
        onChange(next)
      }
    }
  }, [sessions, activeSessionId, filters, onChange])

  const handleChange = (key: keyof EnrollmentFiltersProps["value"], nextValue: number | string | undefined) => {
    const next = { ...filters, [key]: nextValue }
    setFilters(next)
    onChange(next)
  }

  const reset = () => {
    const resetValue = { per_page: defaultPerPage }
    setFilters(resetValue)
    onChange(resetValue)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="w-full md:w-64">
        <Select
          // label="Academic Session"
          selectedKeys={filters.academic_session_id ? new Set([String(filters.academic_session_id)]) : new Set([])}
          onChange={(e) => handleChange("academic_session_id", e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Academic sessions"
          size="sm"
        >
          <SelectItem key="all" value="">
            All Sessions
          </SelectItem>
          {sessions.map((s) => (
            <SelectItem key={String(s.id)} value={String(s.id)}>
              {s.name}{(s as any).active ? ' (current)' : ''}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="w-full md:w-64">
        <Select
          // label="Skill"
          isLoading={skillsLoading}
          selectedKeys={filters.skill_id ? new Set([String(filters.skill_id)]) : new Set([])}
          onChange={(e) => handleChange("skill_id", e.target.value || undefined)}
          placeholder="All skills"
          size="sm"
        >
          <SelectItem key="all" value="">
            All Skills
          </SelectItem>
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

export default EnrollmentFilters


