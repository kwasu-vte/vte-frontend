"use client"
import React, { useMemo } from "react"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { academicSessionsApi } from "@/src/lib/api/academic-sessions"
import type { AcademicSession } from "@/src/lib/types"

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
  const defaultValues: FormValues = useMemo(() => ({
    name: session?.name || "",
    starts_at: session?.starts_at || "",
    ends_at: session?.ends_at || "",
  }), [session])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      const res = await academicSessionsApi.create({ name: payload.name, starts_at: payload.starts_at || null, ends_at: payload.ends_at || null })
      if (!res.success) throw new Error(res.message || 'Failed to create session')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions", "list"] })
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      if (!session?.id && mode === 'edit') throw new Error('Missing session id')
      const res = await academicSessionsApi.update(session!.id, { name: payload.name, starts_at: payload.starts_at || undefined, ends_at: payload.ends_at || undefined })
      if (!res.success) throw new Error(res.message || 'Failed to update session')
      return res.data
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


