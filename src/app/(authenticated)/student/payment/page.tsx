// * Student Payment Page
// * Payment handling with PaymentSummary and PaymentRedirect
// * Follows design guide principles with NextUI components

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { enrollmentsApi } from '@/lib/api';
import { PaymentRedirect } from '@/components/features/student/PaymentRedirect';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { Card, CardBody, CardHeader, Skeleton, Button, Divider } from '@nextui-org/react';
import { ArrowLeft, CreditCard, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PaymentPageData {
  enrollment: any;
}

async function getPaymentPageData(userId: string): Promise<PaymentPageData> {
  try {
    const enrollmentResponse = await enrollmentsApi.getUserEnrollment(userId);
    const enrollment = enrollmentResponse.success ? enrollmentResponse.data : null;

    return {
      enrollment
    };
  } catch (error) {
    console.error('Error fetching payment page data:', error);
    return {
      enrollment: null
    };
  }
}

export default async function StudentPayment() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Error: User not found</div>;
  }

  const data = await getPaymentPageData(user.id);

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
            Payment
          </h1>
          <p className="text-neutral-600">
            Complete your enrollment payment securely.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <StateRenderer
        data={data.enrollment}
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
              <CreditCard className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Payment Required</h3>
              <p className="text-neutral-600 mb-6">
                You don't have any pending payments at this time.
              </p>
              <Button
                as={Link}
                href="/student/skills"
                color="primary"
                startContent={<CreditCard className="h-4 w-4" />}
              >
                Browse Skills
              </Button>
            </CardBody>
          </Card>
        }
      >
        {(enrollment) => {
          // Check if payment is needed
          const needsPayment = enrollment.status === 'pending' || enrollment.payment_status === 'pending';
          
          if (!needsPayment) {
            return (
              <Card shadow="sm" className="w-full">
                <CardBody className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Payment Complete</h3>
                  <p className="text-neutral-600 mb-6">
                    Your payment has been processed successfully. You can now view your enrollment status.
                  </p>
                  <Button
                    as={Link}
                    href="/student/enrollment"
                    color="primary"
                    startContent={<CheckCircle className="h-4 w-4" />}
                  >
                    View Enrollment
                  </Button>
                </CardBody>
              </Card>
            );
          }

          return (
            <div className="space-y-6">
              {/* Payment Summary */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Payment Summary</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Skill</span>
                      <span className="font-medium text-neutral-900">
                        {enrollment.skill?.title || 'Unknown Skill'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Enrollment ID</span>
                      <span className="font-medium text-neutral-900">#{enrollment.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Amount</span>
                      <span className="text-2xl font-bold text-primary">₦5,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Status</span>
                      <span className="capitalize text-warning-600 font-medium">
                        {enrollment.payment_status}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Payment Gateway Selection */}
              <Card shadow="sm" className="w-full">
                <CardHeader className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <p className="text-xl font-medium leading-normal">Payment Gateway</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg">
                      <div className="w-12 h-8 bg-primary-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">PS</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">Paystack</p>
                        <p className="text-sm text-neutral-600">Secure payment processing</p>
                      </div>
                      <div className="text-sm text-neutral-500">
                        Recommended
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-1" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Secure Payment</p>
                          <p>Your payment information is encrypted and processed securely through Paystack.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Payment Action */}
              <PaymentRedirect
                enrollment={{ id: enrollment.id.toString() }}
                amount={5000}
                onProceed={() => {
                  // This would typically call the payment API and redirect to Paystack
                  console.log('Initiating payment for enrollment:', enrollment.id);
                  // In a real implementation, this would:
                  // 1. Call enrollmentsApi.payForUser(userId, { enrollment_id: enrollment.id })
                  // 2. Get the payment_url from the response
                  // 3. Redirect to the payment_url
                }}
              />
            </div>
          );
        }}
      </StateRenderer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
