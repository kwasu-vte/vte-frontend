"use client"
import React, { createContext, useContext } from "react"

/**
 * * EnrollmentContext
 * Manages student enrollment state across the app.
 * TODO: Integrate with enrollmentStore and backend API for status updates.
 */

export type EnrollmentState = {
  enrollmentId?: string
  status?: string
  skillId?: string
}

export type EnrollmentContextValue = {
  state: EnrollmentState
  setState: (next: EnrollmentState) => void
  refresh: () => Promise<void>
}

const EnrollmentContext = createContext<EnrollmentContextValue | undefined>(undefined)

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  // TODO: Wire to Zustand store
  const value: EnrollmentContextValue = {
    state: {},
    setState: () => {},
    refresh: async () => {}
  }
  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>
}

export function useEnrollmentContext(): EnrollmentContextValue {
  const ctx = useContext(EnrollmentContext)
  if (!ctx) throw new Error("useEnrollmentContext must be used within EnrollmentProvider")
  return ctx
}


