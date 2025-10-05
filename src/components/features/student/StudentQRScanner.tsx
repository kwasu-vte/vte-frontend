"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Input, Spinner, Tabs, Tab } from "@nextui-org/react"
import { Camera, AlertCircle } from "lucide-react"
import { qrCodesApi } from "@/lib/api"
import ScanResultModal from "./ScanResultModal"
import ScanConfirmationModal from "./ScanConfirmationModal"
import ScanProgressIndicator from "./ScanProgressIndicator"
import dynamic from "next/dynamic"

// Dynamically import QR scanner to avoid SSR issues
const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false })

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

  const requestCameraPermission = async () => {
    try {
      setIsRequestingPermission(true)
      setCameraError(null)
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser or context.')
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      // Permission granted - stop the stream and show the scanner
      stream.getTracks().forEach(track => track.stop())
      setShowScanner(true)
      
    } catch (error: any) {
      console.error('Camera permission error:', error)
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera access denied. Please enable camera permissions in your browser settings and ensure you are using HTTPS.')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device.')
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.')
      } else if (error.message?.includes('not supported') || error.message?.includes('policy')) {
        setCameraError('Camera access is blocked by browser security policy. Please ensure the app is running on HTTPS.')
      } else {
        setCameraError(`Unable to access camera: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setIsRequestingPermission(false)
    }
  }

  const processToken = async (scannedToken: string) => {
    if (!scannedToken.trim()) {
      console.warn('Empty token provided')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      console.log('🔍 Processing token:', scannedToken.trim())
      console.log('👤 Student ID:', studentId)
      
      // Call the API - response is ApiResponse<QrScanResponse>
      const response = await qrCodesApi.processScan({ 
        token: scannedToken.trim(), 
        student_id: studentId 
      })
      
      console.log('✅ Full API response:', response)
      
      // Extract data from ApiResponse wrapper
      const scanData = response.data
      const success = scanData.success
      const message = scanData.message
      const points = scanData.points
      const timestamp = scanData.timestamp
      const studentName = scanData.student_name

      console.log('📊 Parsed scan data:', { success, message, points, timestamp, studentName })

      // Update scan result state
      setScanResult({ 
        success, 
        message, 
        points, 
        timestamp, 
        studentName 
      })

      if (success) {
        // Success - show confirmation modal
        console.log('✨ Scan successful! Earned points:', points)
        setConfirmOpen(true)
        setRemainingScans((prev) => Math.max(0, prev - 1))
        
        // Call success callback
        if (points && timestamp) {
          onScanSuccess({ 
            token: scannedToken.trim(), 
            points, 
            timestamp 
          })
        }
      } else {
        // Failed - show error modal
        console.warn('⚠️ Scan failed:', message)
        setResultOpen(true)
        onScanError(message || "Scan failed")
      }
      
      // Clear token input
      setToken("")
      
    } catch (error: any) {
      console.error('❌ Error processing scan:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data
      })
      
      // Parse error message from different possible locations
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.response?.data?.data?.message ||
        error.message || 
        'Network error. Please check your connection and try again.'
      
      console.error('📛 Final error message:', errorMessage)
      
      // Update scan result state
      setScanResult({ 
        success: false, 
        message: errorMessage 
      })
      
      // Show error modal
      setResultOpen(true)
      onScanError(errorMessage)
      
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScan = (data: any) => {
    if (data && !isSubmitting) {
      const scannedText = data.text || data
      console.log('QR code scanned:', scannedText)
      processToken(scannedText)
    }
  }

  const handleError = (err: any) => {
    console.error("Camera error:", err)
    setCameraError("Camera error occurred. Please try manual entry instead.")
    setShowScanner(false)
  }

  const handleManualSubmit = () => {
    if (!token.trim()) {
      setScanResult({ success: false, message: "Please enter a valid token" })
      setResultOpen(true)
      return
    }
    processToken(token)
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
            <p className="text-sm font-medium text-blue-900 mb-2">Troubleshooting:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Ensure you're using HTTPS (not HTTP)</li>
              <li>Click the lock icon in the address bar</li>
              <li>Set Camera permission to "Allow"</li>
              <li>Refresh the page and try again</li>
            </ol>
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              color="primary" 
              onPress={() => {
                setCameraError(null)
                setShowScanner(false)
                requestCameraPermission()
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
          <div className="relative w-full aspect-square max-w-sm mx-auto overflow-hidden rounded-lg bg-black">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
              constraints={{
                video: { facingMode: "environment" }
              }}
            />
            {isSubmitting && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Spinner size="lg" color="white" />
                <p className="text-white text-sm ml-3">Processing...</p>
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              Point camera at QR code
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button 
              size="sm"
              variant="flat"
              onPress={() => setShowScanner(false)}
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
          onPress={requestCameraPermission}
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
    <Card shadow="sm" className="w-full max-w-xl">
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
              setShowScanner(false)
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
                  label="QR Token"
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
                  isLoading={isSubmitting}
                >
                  Submit
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