import { create } from "zustand"

/**
 * * qrStore (Zustand)
 * TODO: Manage QR codes, batches, and scan history.
 */

type QRCode = { id: string; token: string; groupId?: string; date?: string; assignedMentorId?: string }
type QRBatch = { id: string; groupId: string; mentorId?: string; date: string; status: "distributed" | "pending" }
type Scan = { id: string; studentId: string; qrToken: string; timestamp: string; points?: number }

type QRStore = {
  codes: QRCode[]
  batches: QRBatch[]
  scans: Scan[]
  setCodes: (codes: QRCode[]) => void
  setBatches: (batches: QRBatch[]) => void
  setScans: (scans: Scan[]) => void
  refresh: () => Promise<void>
}

export const useQRStore = create<QRStore>((set) => ({
  codes: [],
  batches: [],
  scans: [],
  setCodes: (codes) => set({ codes }),
  setBatches: (batches) => set({ batches }),
  setScans: (scans) => set({ scans }),
  refresh: async () => {
    // TODO: Fetch QR codes/batches/scans from backend
  }
}))


