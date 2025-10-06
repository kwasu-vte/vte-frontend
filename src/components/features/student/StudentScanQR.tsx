// * Student QR Scanner Page
// * Scan mentor QR for attendance with StudentQRScanner and scan modals
// * Follows design guide principles with NextUI components

'use client';

import React, { useEffect, useState } from 'react';
import { enrollmentsApi } from '@/lib/api';
import { StudentQRScanner } from '@/components/features/student/StudentQRScanner';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button } from '@nextui-org/react';
import { ArrowLeft, QrCode, Users, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StudentScanQRProps {
  userId: string;
}

export default function StudentScanQR({ userId }: StudentScanQRProps) {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEnrollment() {
      try {
        setIsLoading(true);
        const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
        setEnrollment(enrollmentResponse.success ? enrollmentResponse.data : null);
      } catch (err) {
        console.error('Error fetching enrollment:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch enrollment'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnrollment();
  }, [userId]);

  const handleScanSuccess = (result: any) => {
    console.log('Scan successful:', result);
    // Show success notification or update UI
    router.refresh(); // Refresh to update attendance data
  };

  const handleScanError = (error: any) => {
    console.error('Scan error:', error);
    // Show error notification
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          as={Link}
          href="/student/dashboard"
          isIconOnly
          variant="ghost"
          className="text-neutral-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Scan QR Code
          </h1>
          <p className="text-neutral-600">
            Scan your mentor&apos;s QR code to mark attendance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <StateRenderer
        isLoading={isLoading}
        error={error}
        data={enrollment}
        loadingComponent={
          <div className="space-y-6">
            <Card shadow="sm" className="w-full">
              <CardBody className="p-6">
                <Skeleton className="h-40 w-full" />
              </CardBody>
            </Card>
            <Card shadow="sm" className="w-full">
              <CardBody className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardBody>
            </Card>
          </div>
        }
        emptyComponent={
          <Card shadow="sm" className="w-full">
            <CardBody className="p-8 text-center">
              <QrCode className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Active Enrollment</h3>
              <p className="text-neutral-600 mb-6">
                You need to be enrolled in a skill to scan QR codes for attendance.
              </p>
              <Button
                as={Link}
                href="/student/skills"
                color="primary"
                startContent={<QrCode className="h-4 w-4" />}
              >
                Browse Skills
              </Button>
            </CardBody>
          </Card>
        }
      >
        {(enrollment) => {
          // Check if student is in a group (assigned or active)
          const isInGroup = enrollment.status === 'assigned' || enrollment.status === 'active';
          
          if (!isInGroup) {
            return (
              <Card shadow="sm" className="w-full">
                <CardBody className="p-8 text-center">
                  <Users className="h-12 w-12 text-warning-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Group Assignment Required</h3>
                  <p className="text-neutral-600 mb-6">
                    You need to be assigned to a group before you can scan QR codes for attendance.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-500">
                      Current status: <span className="font-medium capitalize">{enrollment.status}</span>
                    </p>
                    <p className="text-sm text-neutral-500">
                      Payment status: <span className="font-medium capitalize">{enrollment.payment_status}</span>
                    </p>
                  </div>
                </CardBody>
              </Card>
            );
          }

          return (
            <div className="space-y-6">
              {/* QR Scanner */}
              <div className="flex justify-center">
                <StudentQRScanner
                  studentId={userId}
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                  requiredScansToday={3} // This would come from enrollment/group data
                  completedScansToday={0} // This would come from attendance data
                />
              </div>

              {/* Instructions */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">How to Scan</p>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Get the QR Code</p>
                          <p className="text-sm text-neutral-600">
                            Ask your mentor for the QR code displayed on their device or printed material.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Enter the Token</p>
                          <p className="text-sm text-neutral-600">
                            If camera scanning is unavailable, enter the token printed under the QR code.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">Submit</p>
                          <p className="text-sm text-neutral-600">
                            Click submit to record your attendance and earn points.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-1" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Important Notes:</p>
                          <ul className="mt-1 space-y-1">
                            <li>• Each QR code can only be scanned once per student</li>
                            <li>• QR codes expire after a certain time period</li>
                            <li>• Make sure you&apos;re scanning the correct QR code for your group</li>
                            <li>• Contact your mentor if you encounter any issues</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Group Information */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Your Group</p>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Skill</span>
                      <span className="font-medium text-neutral-900">
                        {enrollment.skill?.title || 'Unknown Skill'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Group ID</span>
                      <span className="font-medium text-neutral-900">
                        {enrollment.group_id ? `Group ${enrollment.group_id}` : 'Not assigned'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Status</span>
                      <span className="capitalize text-success-600 font-medium">
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        }}
      </StateRenderer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}