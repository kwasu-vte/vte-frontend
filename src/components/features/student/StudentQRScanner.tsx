"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Input, Spinner } from "@nextui-org/react"
import { api } from "@/lib/api"
import ScanResultModal from "./ScanResultModal"
import ScanConfirmationModal from "./ScanConfirmationModal"
import ScanProgressIndicator from "./ScanProgressIndicator"

/**
 * * StudentQRScanner
 * Camera scanner placeholder with manual token input fallback. Integrates with API.
 *
 * Props:
 * - studentId: string
 * - onScanSuccess: (result: { token: string; points: number; timestamp: string }) => void
 * - onScanError: (error: string) => void
 */
export type StudentQRScannerProps = {
  studentId: string
  onScanSuccess: (result: { token: string; points: number; timestamp: string }) => void
  onScanError: (error: string) => void
  requiredScansToday?: number
  completedScansToday?: number
}

function StudentQRScanner({ studentId, onScanSuccess, onScanError, requiredScansToday = 3, completedScansToday = 0 }: StudentQRScannerProps) {
  const [token, setToken] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [resultOpen, setResultOpen] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [scanResult, setScanResult] = React.useState<{ success: boolean; message?: string; points?: number; timestamp?: string; studentName?: string }>({ success: false })
  const [remainingScans, setRemainingScans] = React.useState(Math.max(0, requiredScansToday - completedScansToday))

  const handleSubmit = async () => {
    if (!token.trim()) {
      setScanResult({ success: false, message: "Enter a valid token" })
      setResultOpen(true)
      return
    }
    setIsSubmitting(true)
    try {
      const { data } = await api.processQrScan({ token: token.trim(), student_id: studentId })
      // data: QrScanResponse { success, message, points, timestamp, student_name }
      const success = Boolean((data as any)?.success)
      const points = (data as any)?.points as number | undefined
      const timestamp = (data as any)?.timestamp as string | undefined
      const studentName = (data as any)?.student_name as string | undefined
      const message = (data as any)?.message as string | undefined

      setScanResult({ success, message, points, timestamp, studentName })

      if (success) {
        setConfirmOpen(true)
        setRemainingScans((r) => Math.max(0, r - 1))
        if (points && timestamp) {
          onScanSuccess({ token: token.trim(), points, timestamp })
        }
      } else {
        setResultOpen(true)
        onScanError(message || "Scan failed")
      }
      setToken("")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error"
      setScanResult({ success: false, message })
      setResultOpen(true)
      onScanError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card shadow="sm" className="w-full max-w-xl">
      <CardHeader className="flex flex-col items-start gap-2">
        <p className="text-xl font-medium leading-normal">Scan Mentor QR</p>
        <p className="text-sm text-neutral-600">If camera scanning is unavailable, enter the token printed under the QR code.</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <ScanProgressIndicator requiredScans={requiredScansToday} completedScans={requiredScansToday - remainingScans} date={new Date().toISOString()} />
        <div className="flex items-end gap-2">
          <Input
            label="QR Token"
            placeholder="Enter token"
            value={token}
            onValueChange={setToken}
            isDisabled={isSubmitting}
          />
          <Button color="primary" onPress={handleSubmit} isDisabled={!token.trim() || isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </div>

        {/* TODO: Integrate camera scanner in future enhancement following design guide */}

        <ScanResultModal
          isOpen={resultOpen}
          scanResult={scanResult}
          onClose={() => setResultOpen(false)}
          onRescan={() => setResultOpen(false)}
        />
        <ScanConfirmationModal
          isOpen={confirmOpen}
          scanResult={{ points: scanResult.points || 0, mentorName: undefined }}
          remainingScans={remainingScans}
          onClose={() => setConfirmOpen(false)}
        />
      </CardBody>
    </Card>
  )
}

export { StudentQRScanner }
export default StudentQRScanner
