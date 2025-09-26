import { create } from "zustand"

/**
 * * enrollmentStore (Zustand)
 * TODO: Manage student enrollment status and actions.
 */

type Enrollment = { id?: string; status?: string; skillId?: string; paid?: boolean; groupId?: string }

type EnrollmentStore = {
  enrollment: Enrollment
  setEnrollment: (next: Enrollment) => void
  refresh: () => Promise<void>
}

export const useEnrollmentStore = create<EnrollmentStore>((set) => ({
  enrollment: {},
  setEnrollment: (next) => set({ enrollment: { ...next } }),
  refresh: async () => {
    // TODO: Fetch enrollment details from backend
  }
}))


