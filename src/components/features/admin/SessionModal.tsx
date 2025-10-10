"use client"
import React, { useMemo } from "react"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { academicSessionsApi } from "@/lib/api"
import type { AcademicSession } from "@/lib/types"

/**
 * * SessionModal
 * Form for creating/editing academic session.
 */
export type SessionModalProps = {
  isOpen: boolean
  mode: "create" | "edit"
  session?: Pick<AcademicSession, 'id' | 'name' | 'starts_at' | 'ends_at'>
  onClose: () => void
}

const schema = z.object({
  name: z.string().min(3, "Name is too short").max(100, "Name is too long"),
  starts_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
}).superRefine((values, ctx) => {
  const { starts_at, ends_at } = values
  if (starts_at && ends_at) {
    const s = new Date(starts_at)
    const e = new Date(ends_at)
    if (e < s) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ends_at'], message: 'End date must be after start date' })
    }
  }
})

type FormValues = z.infer<typeof schema>

export default function SessionModal({ isOpen, mode, session, onClose }: SessionModalProps) {
  const defaultValues: FormValues = useMemo(() => {
    const toDate = (iso?: string | null) => {
      if (!iso) return ""
      const d = new Date(iso)
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const todayStr = `${yyyy}-${mm}-${dd}`
    const nextYearStr = `${yyyy + 1}-${mm}-${dd}`

    return {
      name: session?.name || "",
      starts_at: toDate(session?.starts_at) || (mode === 'create' ? todayStr : ""),
      ends_at: toDate(session?.ends_at) || (mode === 'create' ? nextYearStr : ""),
    }
  }, [session, mode])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      const toIso = (d?: string | null) => d ? new Date(`${d}T00:00:00Z`).toISOString() : null
      const created = await academicSessionsApi.create({ name: payload.name, starts_at: toIso(payload.starts_at), ends_at: toIso(payload.ends_at) })
      // * Immediately send update with date fields (omit name) after creation
      if (created?.success && created.data?.id) {
        await academicSessionsApi.update(created.data.id, { /* name: payload.name, */ starts_at: toIso(payload.starts_at) ?? undefined, ends_at: toIso(payload.ends_at) ?? undefined })
      }
      return created.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions", "list"] })
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      if (!session?.id && mode === 'edit') throw new Error('Missing session id')
      const toIsoU = (d?: string | null) => d ? new Date(`${d}T00:00:00Z`).toISOString() : undefined
      // * Do not pass name on update; only update dates
      const res = await academicSessionsApi.update(session!.id, { /* name: payload.name, */ starts_at: toIsoU(payload.starts_at), ends_at: toIsoU(payload.ends_at) })
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions", "list"] })
      onClose()
    },
  })

  const onSubmit = (values: FormValues) => {
    if (mode === 'create') {
      createMutation.mutate(values)
    } else {
      updateMutation.mutate(values)
    }
  }

  const isBusy = isSubmitting || createMutation.isPending || updateMutation.isPending

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="text-xl font-medium">{mode === 'create' ? 'Create Academic Session' : 'Edit Academic Session'}</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                isRequired
                placeholder="2024/2025 Academic Session"
                {...register('name')}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  {...register('starts_at')}
                  isInvalid={!!errors.starts_at}
                  errorMessage={errors.starts_at?.message as string}
                />
                <Input
                  type="date"
                  label="End Date"
                  {...register('ends_at')}
                  isInvalid={!!errors.ends_at}
                  errorMessage={errors.ends_at?.message as string}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose} isDisabled={isBusy}>Cancel</Button>
              <Button color="primary" type="submit" isLoading={isBusy}>{mode === 'create' ? 'Create' : 'Save changes'}</Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}


