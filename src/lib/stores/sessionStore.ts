import { create } from "zustand"

/**
 * * sessionStore (Zustand)
 * TODO: Load sessions from API, manage start/end actions, and active session state.
 */

type Session = { id: string; name: string; starts_at: string; ends_at: string; status: "active" | "inactive" | "expired" }

type SessionStore = {
  sessions: Session[]
  activeSessionId: string | null
  setSessions: (sessions: Session[]) => void
  setActiveSession: (id: string | null) => void
  refresh: () => Promise<void>
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  activeSessionId: null,
  setSessions: (sessions) => set({ sessions }),
  setActiveSession: (id) => set({ activeSessionId: id }),
  refresh: async () => {
    // TODO: Fetch sessions from backend and update state
  }
}))


