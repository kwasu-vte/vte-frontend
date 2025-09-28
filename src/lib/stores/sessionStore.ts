import { create } from "zustand"
import { academicSessionsApi } from "@/lib/api/academic-sessions"
import type { AcademicSession } from "@/lib/types"

/**
 * * sessionStore (Zustand)
 * * Manages academic sessions list and the currently active session.
 */

type SessionStore = {
  sessions: AcademicSession[];
  activeSessionId: number | null;
  isLoading: boolean;
  setSessions: (sessions: AcademicSession[]) => void;
  /**
   * * Activates the session on the server and updates local state
   */
  activateSession: (id: number) => Promise<void>;
  /**
   * * Fetches sessions from backend and updates state
   */
  refresh: () => Promise<void>;
  /**
   * * Creates a new session and immediately activates it
   */
  createAndActivate: (params: { name: string; starts_at?: string | null; ends_at?: string | null; }) => Promise<AcademicSession | null>;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  setSessions: (sessions) => set({
    sessions,
    activeSessionId: sessions.find((s) => s.active)?.id ?? null,
  }),
  activateSession: async (id: number) => {
    // * Activate on server; server should ensure single active session
    await academicSessionsApi.start(id)
    await get().refresh()
  },
  refresh: async () => {
    set({ isLoading: true });
    try {
      const res = await academicSessionsApi.getAll()
      if (res?.success) {
        const sessions = res.data || []
        set({
          sessions,
          activeSessionId: sessions.find((s) => s.active)?.id ?? null,
          isLoading: false,
        })
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      // ! Swallow errors at store level; UI handles surfacing
      set({ isLoading: false });
    }
  },
  createAndActivate: async ({ name, starts_at = null, ends_at = null }) => {
    try {
      // * Backend expects valid future dates; avoid nulls for immediate activation
      const now = new Date()
      const defaultStart = now.toISOString()
      const oneYearLater = new Date(now.getTime())
      oneYearLater.setFullYear(now.getFullYear() + 1)
      const defaultEnd = oneYearLater.toISOString()

      const payload = {
        name,
        starts_at: starts_at ?? defaultStart,
        ends_at: ends_at ?? defaultEnd,
      }

      const created = await academicSessionsApi.create(payload)
      if (!created?.success || !created.data) return null
      const newSession = created.data
      // * Immediately update with date fields to ensure backend reflects chosen schedule
      await academicSessionsApi.update(newSession.id, { /* name: payload.name, */ starts_at: payload.starts_at || undefined, ends_at: payload.ends_at || undefined })
      await academicSessionsApi.start(newSession.id)
      await get().refresh()
      return newSession
    } catch (error) {
      return null
    }
  },
}))