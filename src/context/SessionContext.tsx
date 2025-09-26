"use client"
import React, { createContext, useContext } from "react"

/**
 * * SessionContext
 * Provides current academic session and warning helpers if none.
 * TODO: Integrate with sessionStore and backend API to load active session.
 */

export type AcademicSession = { id: string; name: string; starts_at: string; ends_at: string; status: "active" | "inactive" | "expired" }

export type SessionContextValue = {
  currentSession: AcademicSession | null
  isActive: boolean
  refresh: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // TODO: Load current session from store/API
  const value: SessionContextValue = {
    currentSession: null,
    isActive: false,
    refresh: async () => {}
  }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSessionContext(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSessionContext must be used within SessionProvider")
  return ctx
}


