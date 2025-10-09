"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Input, Spinner, Tabs, Tab } from "@nextui-org/react"
import { Camera, AlertCircle } from "lucide-react"
import { qrCodesApi } from "@/lib/api/qr-codes"
import ScanResultModal from "./ScanResultModal"
import ScanConfirmationModal from "./ScanConfirmationModal"
import ScanProgressIndicator from "./ScanProgressIndicator"
import type { ProcessQrScanPayload, QrScanResponse } from "@/lib/types"
import { Html5Qrcode } from "html5-qrcode"

export type StudentQRScannerProps = {
  studentId: string
  onScanSuccess: (result: { token: string; points: number; timestamp: string }) => void
  onScanError: (error: string) => void
  requiredScansToday?: number
  completedScansToday?: number
}

function StudentQRScanner({ 
  studentId, 
  onScanSuccess, 
  onScanError, 
  requiredScansToday = 3, 
  completedScansToday = 0 
}: StudentQRScannerProps) {
  const [token, setToken] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [resultOpen, setResultOpen] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [scanResult, setScanResult] = React.useState<{ 
    success: boolean
    message?: string
    points?: number
    timestamp?: string
    studentName?: string 
  }>({ success: false })
  const [remainingScans, setRemainingScans] = React.useState(Math.max(0, requiredScansToday - completedScansToday))
  const [selectedTab, setSelectedTab] = React.useState("camera")
  const [cameraError, setCameraError] = React.useState<string | null>(null)
  const [showScanner, setShowScanner] = React.useState(false)
  const [isRequestingPermission, setIsRequestingPermission] = React.useState(false)
  
  const html5QrCodeRef = React.useRef<Html5Qrcode | null>(null)
  const scannerIdRef = React.useRef("qr-reader-" + Math.random().toString(36).substr(2, 9))
  const lastScannedRef = React.useRef<string>("")
  const scanCooldownRef = React.useRef<NodeJS.Timeout | null>(null)

  // Cleanup camera on unmount
  React.useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState()
        if (state === 2) { // SCANNING state
          await html5QrCodeRef.current.stop()
        }
      } catch (error) {
        console.error("Error stopping scanner:", error)
      }
      html5QrCodeRef.current = null
    }
  }

  const startScanner = async () => {
    try {
      setIsRequestingPermission(true)
      setCameraError(null)

      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser or context.')
      }

      // Stop any existing scanner
      await stopScanner()

      // Show scanner first to render the DOM element
      setShowScanner(true)

      // Wait for DOM element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check if element exists
      const element = document.getElementById(scannerIdRef.current)
      if (!element) {
        throw new Error('Scanner element not found in DOM')
      }

      // Create new scanner instance
      html5QrCodeRef.current = new Html5Qrcode(scannerIdRef.current)

      // Start scanning
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText, decodedResult) => {
          handleScan(decodedText)
        },
        (errorMessage) => {
          // Ignore common scanning errors (no QR code in frame)
          // Only log actual errors
          if (!errorMessage.includes("NotFoundException")) {
            console.debug("QR scan error:", errorMessage)
          }
        }
      )
      
    } catch (error: any) {
      console.error('Camera permission error:', error)
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera access denied. Please check your browser settings and ensure you are accessing the site via HTTPS.')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device.')
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.')
      } else if (error.message?.includes('not supported') || error.message?.includes('policy')) {
        setCameraError('Camera access is blocked by browser security policy. Please ensure the app is running on HTTPS.')
      } else {
        setCameraError(`Unable to access camera: ${error.message || 'Unknown error'}`)
      }
      
      setShowScanner(false)
    } finally {
      setIsRequestingPermission(false)
    }
  }

  const processToken = async (scannedToken: string) => {
    if (!scannedToken.trim()) return
    
    // Prevent duplicate scans (debouncing)
    if (lastScannedRef.current === scannedToken.trim()) {
      return
    }
    
    // Set cooldown
    lastScannedRef.current = scannedToken.trim()
    if (scanCooldownRef.current) {
      clearTimeout(scanCooldownRef.current)
    }
    scanCooldownRef.current = setTimeout(() => {
      lastScannedRef.current = ""
    }, 3000) // 3 second cooldown
    
    setIsSubmitting(true)
    try {
      const response = await qrCodesApi.processScan({ 
        token: scannedToken.trim(), 
        student_id: studentId 
      })

      console.log("API Response:", response) // Debug log

      // Handle different possible response structures
      let success = false
      let points: number | undefined
      let timestamp: string | undefined
      let studentName: string | undefined
      let message: string | undefined

      // Try to extract data from various possible structures
      if (response?.data?.data) {
        success = response.data.data.success ?? false
        points = response.data.data.points_awarded ? parseInt(response.data.data.points_awarded) : undefined
        timestamp = response.data.data.scanned_at
        studentName = response.data.data.skill_title
        message = response.data.data.message
      } else if (response?.data) {
        success = response.data.success ?? false
        points = response.data.points_awarded ? parseInt(response.data.points_awarded) : undefined
        timestamp = response.data.scanned_at
        studentName = response.data.skill_title
        message = response.data.message
      } else {
        throw new Error("Invalid API response structure")
      }

      setScanResult({ success, message, points, timestamp, studentName })

      if (success) {
        setConfirmOpen(true)
        setRemainingScans((r) => Math.max(0, r - 1))
        if (points && timestamp) {
          onScanSuccess({ token: scannedToken.trim(), points, timestamp })
        }
      } else {
        setResultOpen(true)
        onScanError(message || "Scan failed")
      }
      setToken("")
    } catch (error) {
      console.error("Scan error:", error) // Debug log
      const message = error instanceof Error ? error.message : "Network error"
      setScanResult({ success: false, message })
      setResultOpen(true)
      onScanError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScan = (decodedText: string) => {
    if (decodedText && !isSubmitting) {
      processToken(decodedText)
    }
  }

  const handleManualSubmit = () => {
    if (!token.trim()) {
      setScanResult({ success: false, message: "Enter a valid token" })
      setResultOpen(true)
      return
    }
    processToken(token)
  }

  const handleStopCamera = async () => {
    await stopScanner()
    setShowScanner(false)
  }

  const renderCameraTab = () => {
    // Show error state
    if (cameraError) {
      return (
        <div className="py-6 px-4 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Camera Access Issue</h3>
            <p className="text-sm text-neutral-600 mb-4">
              {cameraError}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <p className="text-sm font-medium text-blue-900 mb-2">How to enable camera:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click the lock/info icon in your browser's address bar</li>
              <li>Find "Camera" in the permissions list</li>
              <li>Change the setting to "Allow"</li>
              <li>Click "Try Again" below</li>
            </ol>
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              color="primary" 
              onPress={() => {
                setCameraError(null)
                startScanner()
              }}
              startContent={<Camera className="w-4 h-4" />}
            >
              Try Again
            </Button>
            <Button 
              variant="flat"
              onPress={() => setSelectedTab("manual")}
            >
              Use Manual Entry
            </Button>
          </div>
        </div>
      )
    }

    // Show scanner if permission granted
    if (showScanner) {
      return (
        <div className="py-4">
          <div className="relative w-full max-w-sm mx-auto">
            <div id={scannerIdRef.current} className="rounded-lg overflow-hidden" />
            {isSubmitting && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Spinner size="lg" color="white" />
              </div>
            )}
          </div>
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-neutral-600">Point camera at QR code</p>
            <Button 
              size="sm"
              variant="flat"
              onPress={handleStopCamera}
            >
              Stop Camera
            </Button>
          </div>
        </div>
      )
    }

    // Show permission request prompt
    return (
      <div className="py-6 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 mb-2">Camera Access Required</h3>
          <p className="text-sm text-neutral-600 mb-4">
            To scan QR codes with your camera, we need permission to access it. 
            Your browser will ask for permission when you click the button below.
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-lg text-left space-y-2">
          <p className="text-xs font-medium text-neutral-700">What happens next:</p>
          <ul className="text-xs text-neutral-600 space-y-1">
            <li>• Your browser will show a permission prompt</li>
            <li>• Click "Allow" to enable camera access</li>
            <li>• The camera will activate for QR scanning</li>
            <li>• You can always use manual entry instead</li>
          </ul>
        </div>
        <Button 
          color="primary" 
          size="lg"
          onPress={startScanner}
          isLoading={isRequestingPermission}
          startContent={!isRequestingPermission ? <Camera className="w-5 h-5" /> : undefined}
        >
          {isRequestingPermission ? 'Requesting Access...' : 'Enable Camera'}
        </Button>
        <p className="text-xs text-neutral-500">
          or use the <button 
            onClick={() => setSelectedTab("manual")}
            className="text-primary underline"
          >
            Manual Entry
          </button> tab
        </p>
      </div>
    )
  }

  return (
    <Card shadow="sm" className="w-full max-w-xl" id="student-scan">
      <CardHeader className="flex flex-col items-start gap-2">
        <p className="text-xl font-medium leading-normal">Scan Mentor QR</p>
        <p className="text-sm text-neutral-600">
          Scan a QR code or enter the token manually.
        </p>
      </CardHeader>
      <CardBody className="space-y-4">
        <ScanProgressIndicator 
          requiredScans={requiredScansToday} 
          completedScans={requiredScansToday - remainingScans} 
          date={new Date().toISOString()} 
        />

        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => {
            setSelectedTab(key as string)
            // Stop scanner when switching away from camera tab
            if (key !== "camera" && showScanner) {
              handleStopCamera()
            }
          }}
          aria-label="Scan options"
        >
          <Tab key="camera" title="Camera">
            {renderCameraTab()}
          </Tab>
          
          <Tab key="manual" title="Manual Entry">
            <div className="py-4 space-y-4">
              <div className="flex items-end gap-2">
                <Input
                  placeholder="Enter token (e.g., ABC123)"
                  value={token}
                  onValueChange={setToken}
                  isDisabled={isSubmitting}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && token.trim() && !isSubmitting) {
                      handleManualSubmit()
                    }
                  }}
                />
                <Button 
                  color="primary" 
                  onPress={handleManualSubmit} 
                  isDisabled={!token.trim() || isSubmitting}
                >
                  {isSubmitting ? <Spinner size="sm" /> : "Submit"}
                </Button>
              </div>
              <p className="text-xs text-neutral-500">
                Enter the alphanumeric code shown below the QR code
              </p>
            </div>
          </Tab>
        </Tabs>

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