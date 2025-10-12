"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Spinner, 
  Divider,
  Chip
} from '@heroui/react';
import { 
  Camera, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Trophy
} from 'lucide-react';
import { qrCodesApi } from "@/lib/api/qr-codes"
import type { ProcessQrScanPayload, QrScanResponse } from "@/lib/types"
import { Html5Qrcode } from "html5-qrcode"

export type StudentQRScannerProps = {
  studentId: string
  onScanSuccess: (result: { token: string; points: number; timestamp: string }) => void
  onScanError: (error: string) => void
  enrollment?: {
    status: string
    skill: { title: string }
    group_id: string
    payment_status: string
  }
}

function StudentQRScanner({ 
  studentId, 
  onScanSuccess, 
  onScanError, 
  enrollment
}: StudentQRScannerProps) {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  const [retryCount, setRetryCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const lastScanned = useRef('');
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerIdRef = useRef("qr-reader-" + Math.random().toString(36).substr(2, 9));

  // Debug enrollment data
  console.log('Enrollment data:', enrollment);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);


  // Check camera permissions when switching to camera mode
  useEffect(() => {
    if (scanMode === 'camera' && navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        setPermissionStatus(result.state);
      }).catch(() => {
        setPermissionStatus('unknown');
      });
    }
  }, [scanMode]);


  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === 2) { // SCANNING state
          await html5QrCodeRef.current.stop();
        }
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
  };

  const startScanner = async () => {
    try {
      setCameraError(null);
      setIsInitializing(true);

      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser or context.');
      }

      // Stop any existing scanner
      await stopScanner();

      // Wait for DOM element to be rendered with multiple attempts
      let element = null;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!element && attempts < maxAttempts) {
        element = document.getElementById(scannerIdRef.current);
        if (!element) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
      }

      if (!element) {
        throw new Error('Scanner element not found in DOM after multiple attempts. Please refresh the page and try again.');
      }

      // Additional check to ensure element is visible and has dimensions
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Scanner element is not properly rendered. Please try again.');
      }
      
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
        throw new Error('Scanner element is hidden. Please ensure the camera interface is visible.');
      }

      // Create new scanner instance
      html5QrCodeRef.current = new Html5Qrcode(scannerIdRef.current);

      // Start scanning
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText, decodedResult) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // Ignore common scanning errors (no QR code in frame)
          if (!errorMessage.includes("NotFoundException")) {
            console.debug("QR scan error:", errorMessage);
          }
        }
      );
      
      setCameraActive(true);
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera access denied. Please check your browser settings and ensure you are accessing the site via HTTPS.');
        setPermissionStatus('denied');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.');
      } else if (error.message?.includes('not supported') || error.message?.includes('policy')) {
        setCameraError('Camera access is blocked by browser security policy. Please ensure the app is running on HTTPS.');
      } else if (error.message?.includes('Scanner element not found') || error.message?.includes('not properly rendered') || error.message?.includes('Scanner element is hidden')) {
        setCameraError('Camera interface not ready. Please try again.');
      } else {
        setCameraError(`Unable to access camera: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const handleScan = async (scannedToken: string) => {
    if (!scannedToken.trim() || scannedToken === lastScanned.current) return;
    
    lastScanned.current = scannedToken;
    setIsSubmitting(true);
    setShowResult(false);

    try {
      const response = await qrCodesApi.processScan({ 
        token: scannedToken.trim(), 
        student_id: studentId 
      });

      console.log("API Response:", response);

      // Handle different possible response structures by normalizing payload
      type ScanPayload = {
        success?: boolean;
        message?: string;
        points_awarded?: string;
        scanned_at?: string;
        skill_title?: string;
      };
      const rawPayload = (response && typeof response === 'object')
        ? ((response as { data?: unknown })?.data as unknown)
        : undefined;
      const payload: ScanPayload = (rawPayload && typeof rawPayload === 'object' && (rawPayload as { data?: unknown })?.data)
        ? ((rawPayload as { data: unknown }).data as ScanPayload)
        : ((rawPayload as ScanPayload) || {});

      const success = payload.success ?? false;
      const points = payload.points_awarded ? parseInt(payload.points_awarded) : 0;
      const message = payload.message || (success ? 'Attendance recorded successfully' : 'Scan failed');

      setScanResult({
        success,
        points,
        message
      });
      setToken('');
      setShowResult(true);

      if (success && payload.scanned_at) {
        onScanSuccess({ token: scannedToken.trim(), points, timestamp: payload.scanned_at });
      } else if (!success) {
        onScanError(message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Scan failed';
      setScanResult({
        success: false,
        message
      });
      setShowResult(true);
      onScanError(message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        lastScanned.current = '';
      }, 3000);
    }
  };

  const handleManualSubmit = () => {
    if (!token.trim()) return;
    handleScan(token);
  };

  const handleStartCamera = () => {
    setCameraError(null);
    setRetryCount(prev => prev + 1);
    startScanner();
  };

  const handleRetryCamera = () => {
    setCameraError(null);
    setRetryCount(prev => prev + 1);
    startScanner();
  };

  const handleStopCamera = () => {
    stopScanner();
  };

  // Result modal component
  const ResultDisplay = () => {
    if (!showResult || !scanResult) return null;

      return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-6 text-center space-y-4">
            {scanResult.success ? (
              <>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    Attendance Recorded!
                  </h3>
                  <p className="text-neutral-600">
                    {scanResult.message}
                  </p>
                </div>
                <div className="bg-warning/10 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-warning-700">
                    <Trophy className="w-5 h-5" />
                    <span className="text-lg font-semibold">+{scanResult.points} Points</span>
                  </div>
                </div>
                <div className="text-sm text-neutral-500">
                  Attendance recorded successfully
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-danger" />
          </div>
          <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    Scan Failed
                  </h3>
                  <p className="text-neutral-600">
                    {scanResult.message}
                  </p>
                </div>
                <p className="text-sm text-neutral-500">
                  Please try again or contact your mentor
                </p>
              </>
            )}
            <Button
              color="primary"
              onPress={() => setShowResult(false)}
              className="w-full"
            >
              {scanResult.success ? 'Continue' : 'Try Again'}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Scan Attendance
          </h1>
          <p className="text-neutral-600">
            Mark your attendance by scanning your mentor's QR code
          </p>
        </div>


        {/* Main Scanner Card */}
        <Card shadow="sm">
          <CardBody className="p-0">
            {/* Mode Selector */}
            <div className="p-6 pb-4">
              <div className="flex gap-2">
                <Button
                  onPress={() => {
                    setScanMode('camera');
                    // Don't auto-start camera, let user click "Enable Camera" button
                  }}
                  variant={scanMode === 'camera' ? 'solid' : 'flat'}
                  color={scanMode === 'camera' ? 'primary' : 'default'}
                  startContent={<Camera className="w-4 h-4" />}
                  className="flex-1"
                >
                  Camera
                </Button>
                <Button
                  onPress={() => {
                    setScanMode('manual');
                    if (cameraActive) handleStopCamera();
                  }}
                  variant={scanMode === 'manual' ? 'solid' : 'flat'}
                  color={scanMode === 'manual' ? 'primary' : 'default'}
                  startContent={<KeyRound className="w-4 h-4" />}
                  className="flex-1"
                >
                  Manual Entry
                </Button>
              </div>
            </div>

            <Divider />

            {/* Scanner Content */}
            <div className="p-6">
              {scanMode === 'camera' ? (
                <div className="space-y-4">
                  {cameraError ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-10 h-10 text-danger" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">
                          Camera Access Issue
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4 max-w-sm mx-auto">
                          {cameraError}
                        </p>
                        {retryCount > 0 && (
                          <p className="text-xs text-neutral-500 mb-2">
                            Attempt {retryCount} of 3
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          color="primary"
                          onPress={handleRetryCamera}
                          startContent={<Camera className="w-4 h-4" />}
                          isDisabled={isInitializing}
                          isLoading={isInitializing}
                        >
                          {isInitializing ? 'Initializing...' : 'Try Again'}
                        </Button>
                        <Button
                          variant="flat"
                          onPress={() => setScanMode('manual')}
                          isDisabled={isInitializing}
                        >
                          Use Manual Entry
                        </Button>
                      </div>
                      {retryCount >= 3 && (
                        <div className="bg-blue-50 p-4 rounded-lg text-left">
                          <p className="text-sm font-medium text-blue-900 mb-2">Still having issues?</p>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Refresh the page and try again</li>
                            <li>• Check if another app is using the camera</li>
                            <li>• Ensure you're on HTTPS (required for camera access)</li>
                            <li>• Try using manual entry instead</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Always render scanner element when in camera mode */}
                      <div className="relative bg-neutral-900 rounded-lg overflow-hidden aspect-square max-w-sm mx-auto">
                        <div id={scannerIdRef.current} className="w-full h-full" />
                        
                        {/* Overlay for loading/inactive states */}
                        {(!cameraActive || isInitializing) && (
                          <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center gap-4 p-6">
                            {isInitializing ? (
                              <>
                                <Spinner size="lg" color="white" />
                                <p className="text-white text-sm">Initializing camera...</p>
                              </>
                            ) : (
                              <>
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Camera className="w-10 h-10 text-primary" />
                                </div>
                                <div className="text-center">
                                  <h3 className="font-semibold text-white mb-2">
                                    Camera Access Needed
                                  </h3>
                                  <p className="text-sm text-neutral-400 mb-4 max-w-sm">
                                    {permissionStatus === 'denied' 
                                      ? 'Camera access was denied. Please enable camera permissions in your browser settings.'
                                      : permissionStatus === 'granted'
                                      ? 'Camera permissions are granted. Click below to start scanning.'
                                      : 'Allow camera access to scan QR codes. Your browser will prompt for permission.'
                                    }
                                  </p>
                                </div>
                                
                                {permissionStatus === 'denied' ? (
                                  <div className="space-y-3 w-full max-w-sm">
                                    <div className="bg-blue-50 p-4 rounded-lg text-left">
                                      <p className="text-sm font-medium text-blue-900 mb-2">How to enable camera:</p>
                                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                        <li>Click the lock/info icon in your browser's address bar</li>
                                        <li>Find "Camera" in the permissions list</li>
                                        <li>Change the setting to "Allow"</li>
                                        <li>Refresh this page</li>
                                      </ol>
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                      <Button
                                        color="primary"
                                        onPress={() => window.location.reload()}
                                        startContent={<Camera className="w-4 h-4" />}
                                      >
                                        Refresh Page
                                      </Button>
                                      <Button
                                        variant="flat"
                                        onPress={() => setScanMode('manual')}
                                      >
                                        Use Manual Entry
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <Button
                                      color="primary"
                                      size="lg"
                                      onPress={handleStartCamera}
                                      startContent={<Camera className="w-5 h-5" />}
                                      isDisabled={isInitializing}
                                      isLoading={isInitializing}
                                    >
                                      Enable Camera
                                    </Button>
                                    <p className="text-xs text-neutral-400">
                                      You can also use manual entry if camera is unavailable
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        
                        {/* Scanning overlay */}
                        {isSubmitting && cameraActive && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Spinner size="lg" color="white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Camera controls - only show when active */}
                      {cameraActive && !isInitializing && (
                        <div className="text-center space-y-2">
                          <p className="text-sm text-neutral-600">
                            Position the QR code within the frame
                          </p>
                          <Button 
                            size="sm"
                            variant="flat"
                            onPress={handleStopCamera}
                          >
                            Stop Camera
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
        <div>
                    <label className="text-sm font-medium text-neutral-700 mb-2 block">
                      Enter Token Code
                    </label>
                    <div className="flex gap-2">
                <Input
                        placeholder="e.g., ABC123XYZ"
                  value={token}
                  onValueChange={setToken}
                  isDisabled={isSubmitting}
                        size="lg"
                        classNames={{
                          input: "text-center uppercase tracking-wider text-lg font-mono"
                        }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && token.trim() && !isSubmitting) {
                            handleManualSubmit();
                    }
                  }}
                />
                <Button 
                  color="primary" 
                        size="lg"
                  onPress={handleManualSubmit} 
                  isDisabled={!token.trim() || isSubmitting}
                        isLoading={isSubmitting}
                        className="min-w-24"
                >
                        Submit
                </Button>
              </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      Enter the code shown below your mentor's QR code
              </p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Your Group */}
          <Card shadow="sm">
            <CardBody className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Your Group</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Skill</p>
                  <p className="font-medium text-neutral-900">{enrollment?.skill?.title || 'Unknown Skill'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Group ID</p>
                  <p className="font-medium text-neutral-900">
                    {enrollment?.group_id 
                      ? `#${enrollment.group_id}` 
                      : 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <Chip color="success" size="sm" variant="flat">
                    {enrollment?.status || 'Unknown'}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Important Notes */}
          <Card shadow="sm">
            <CardBody className="p-6">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-neutral-900">Important</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 mt-1">•</span>
                  <span>Each QR code can only be scanned once</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 mt-1">•</span>
                  <span>Codes expire after a set time period</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 mt-1">•</span>
                  <span>Contact your mentor if issues occur</span>
                </li>
              </ul>
      </CardBody>
    </Card>
        </div>
      </div>

      {/* Result Modal */}
      <ResultDisplay />
    </div>
  );
}

export { StudentQRScanner }
export default StudentQRScanner