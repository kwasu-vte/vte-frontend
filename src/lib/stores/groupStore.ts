import { create } from "zustand"

/**
 * * groupStore (Zustand)
 * TODO: Manage groups, members, and utilization stats.
 */

type Group = { id: string; number?: number; current?: number; max?: number }

type GroupStore = {
  groups: Group[]
  setGroups: (groups: Group[]) => void
  refresh: () => Promise<void>
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  refresh: async () => {
    // TODO: Fetch groups from backend
  }
}))


