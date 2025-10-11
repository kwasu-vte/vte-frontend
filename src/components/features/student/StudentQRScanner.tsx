"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Spinner, 
  Progress,
  Chip,
  Divider
} from '@heroui/react';
import { 
  Camera, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Trophy,
  Clock,
  Target
} from 'lucide-react';
import { qrCodesApi } from "@/lib/api/qr-codes"
import type { ProcessQrScanPayload, QrScanResponse } from "@/lib/types"
import { Html5Qrcode } from "html5-qrcode"

export type StudentQRScannerProps = {
  studentId: string
  onScanSuccess: (result: { token: string; points: number; timestamp: string }) => void
  onScanError: (error: string) => void
  requiredScansToday?: number
  completedScansToday?: number
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
  requiredScansToday = 3, 
  completedScansToday = 0,
  enrollment
}: StudentQRScannerProps) {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const lastScanned = useRef('');
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerIdRef = useRef("qr-reader-" + Math.random().toString(36).substr(2, 9));
  
  const completedScans = completedScansToday;
  const requiredScans = requiredScansToday;
  const progress = (completedScans / requiredScans) * 100;
  const remainingScans = Math.max(0, requiredScans - completedScans);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

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

      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser or context.');
      }

      // Stop any existing scanner
      await stopScanner();

      // Wait for DOM element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if element exists
      const element = document.getElementById(scannerIdRef.current);
      if (!element) {
        throw new Error('Scanner element not found in DOM');
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
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera access denied. Please check your browser settings and ensure you are accessing the site via HTTPS.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.');
      } else if (error.message?.includes('not supported') || error.message?.includes('policy')) {
        setCameraError('Camera access is blocked by browser security policy. Please ensure the app is running on HTTPS.');
      } else {
        setCameraError(`Unable to access camera: ${error.message || 'Unknown error'}`);
      }
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
                  {remainingScans > 0 
                    ? `${remainingScans} more scan${remainingScans !== 1 ? 's' : ''} needed today`
                    : "All scans completed for today! ✓"}
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

        {/* Progress Card */}
        <Card shadow="sm">
          <CardBody className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Today's Progress</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {completedScans} / {requiredScans}
                </p>
              </div>
              <Chip 
                color={remainingScans === 0 ? "success" : "warning"}
                variant="flat"
                startContent={remainingScans === 0 ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
              >
                {remainingScans === 0 ? 'Complete' : `${remainingScans} remaining`}
              </Chip>
            </div>
            <Progress 
              value={progress} 
              color={remainingScans === 0 ? "success" : "primary"}
              size="sm"
              className="mb-2"
            />
            <p className="text-xs text-neutral-500">
              Scan {remainingScans} more time{remainingScans !== 1 ? 's' : ''} to complete today's attendance
            </p>
          </CardBody>
        </Card>

        {/* Main Scanner Card */}
        <Card shadow="sm">
          <CardBody className="p-0">
            {/* Mode Selector */}
            <div className="p-6 pb-4">
              <div className="flex gap-2">
                <Button
                  onPress={() => {
                    setScanMode('camera');
                    if (!cameraActive) handleStartCamera();
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
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          color="primary"
                          onPress={() => {
                            setCameraError(null);
                            handleStartCamera();
                          }}
                          startContent={<Camera className="w-4 h-4" />}
                        >
                          Try Again
                        </Button>
                        <Button
                          variant="flat"
                          onPress={() => setScanMode('manual')}
                        >
                          Use Manual Entry
                        </Button>
                      </div>
                    </div>
                  ) : !cameraActive ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-10 h-10 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">
                          Camera Access Needed
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4 max-w-sm mx-auto">
                          Allow camera access to scan QR codes. Your browser will prompt for permission.
                        </p>
                      </div>
                      <Button
                        color="primary"
                        size="lg"
                        onPress={handleStartCamera}
                        startContent={<Camera className="w-5 h-5" />}
                      >
                        Enable Camera
                      </Button>
                      <p className="text-xs text-neutral-500">
                        You can also use manual entry if camera is unavailable
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-neutral-900 rounded-lg overflow-hidden aspect-square max-w-sm mx-auto">
                        <div id={scannerIdRef.current} className="w-full h-full" />
                        {isSubmitting && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Spinner size="lg" color="white" />
                          </div>
                        )}
                      </div>
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
                    </div>
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
                  <p className="font-medium text-neutral-900">#{enrollment?.group_id || 'Not assigned'}</p>
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