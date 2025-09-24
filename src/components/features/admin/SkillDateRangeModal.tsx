"use client"
import React, { useMemo } from "react"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { AcademicSession, SkillDateRange } from "@/lib/types"

export type SkillDateRangeModalProps = {
  isOpen: boolean
  skillId: string
  academicSessionId?: number
  onClose: () => void
  onSuccess?: (range: SkillDateRange) => void
}

const schema = z.object({
  date_range_start: z.string().min(1, "Start date is required"),
  date_range_end: z.string().min(1, "End date is required"),
}).superRefine((values, ctx) => {
  const s = new Date(values.date_range_start)
  const e = new Date(values.date_range_end)
  if (e < s) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['date_range_end'], message: 'End date must be after start date' })
  }
})

type FormValues = z.infer<typeof schema>

export default function SkillDateRangeModal({ isOpen, skillId, academicSessionId, onClose, onSuccess }: SkillDateRangeModalProps) {
  // * Fetch sessions to show bounds context (latest active preferred)
  const { data: sessions } = useQuery({
    queryKey: ["academic-sessions", "list"],
    queryFn: async (): Promise<AcademicSession[]> => {
      const res = await api.getAcademicSessions()
      return res.data
    },
  })

  const currentSession = useMemo(() => {
    if (!sessions) return undefined
    const byId = academicSessionId ? sessions.find(s => s.id === academicSessionId) : undefined
    return byId || sessions.find(s => s.active) || sessions[0]
  }, [academicSessionId, sessions])

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { date_range_start: "", date_range_end: "" },
  })

  const queryClient = useQueryClient()

  // * For now, emit values outward (API integration for skill range update lives in parent via docs plan)
  const onSubmit = (values: FormValues) => {
    // * Validate within session bounds if available
    if (currentSession?.starts_at && currentSession?.ends_at) {
      const s = new Date(values.date_range_start)
      const e = new Date(values.date_range_end)
      const ss = new Date(currentSession.starts_at)
      const ee = new Date(currentSession.ends_at)
      if (s < ss || e > ee) {
        // * Soft guard: prevent submit if outside bounds
        return
      }
    }
    // * Emit; parent can call api.updateSkillDateRange per plan
    onSuccess?.({
      id: 0,
      skill_id: skillId,
      academic_session_id: currentSession?.id || 0,
      date_range_start: values.date_range_start,
      date_range_end: values.date_range_end,
      created_at: null,
      updated_at: null,
    })
    queryClient.invalidateQueries()
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="text-xl font-medium">Set Practical Date Range</ModalHeader>
            <ModalBody>
              {currentSession && (
                <div className="text-sm text-neutral-600">
                  Session bounds: {currentSession.starts_at ? new Date(currentSession.starts_at).toLocaleDateString() : '—'} — {currentSession.ends_at ? new Date(currentSession.ends_at).toLocaleDateString() : '—'}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start"
                  isRequired
                  {...register('date_range_start')}
                  isInvalid={!!errors.date_range_start}
                  errorMessage={errors.date_range_start?.message}
                />
                <Input
                  type="date"
                  label="End"
                  isRequired
                  {...register('date_range_end')}
                  isInvalid={!!errors.date_range_end}
                  errorMessage={errors.date_range_end?.message}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose} isDisabled={isSubmitting}>Cancel</Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>Save</Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}


