// * Student Profile Creation Page
// * One-time profile creation with FormStepper and ProfileForm
// * Follows design guide principles with NextUI components

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { studentsApi } from '@/lib/api';
import { ProfileForm } from '@/components/features/student/ProfileForm';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { Card, CardBody, CardHeader, Progress, Button } from '@heroui/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CreateStudentProfilePayload } from '@/lib/types';

export default function StudentProfileCreate() {
  const router = useRouter();
  const { addNotification } = useApp();
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [user, setUser] = React.useState<any>(null);

  // Fetch authenticated user via "me" endpoint on mount (required for student profile creation)
  React.useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/v1/users/auth/me', { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Failed to fetch current user');
        const json = await res.json();
        const me = json?.data;
        if (!me?.id) throw new Error('Invalid user payload');
        if (isMounted) setUser({ id: me.id, first_name: me.first_name || 'Student' });
      } catch (error) {
        console.error('Error fetching user:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load user data'
        });
      }
    };

    fetchUser();
    return () => { isMounted = false; };
  }, [addNotification]);

  const handleSubmit = async (data: CreateStudentProfilePayload) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await studentsApi.createProfile(user.id, data);
      
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Profile Created!',
          message: 'Your profile has been created successfully.'
        });
        
        // Move to success step
        setCurrentStep(2);
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          router.push('/student/dashboard');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create profile');
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Profile Information', description: 'Enter your personal and academic details' },
    { number: 2, title: 'Confirmation', description: 'Profile created successfully' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="ghost"
          onClick={() => router.back()}
          className="text-neutral-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Create Your Profile
          </h1>
          <p className="text-neutral-600">
            Complete your student profile to access all features.
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <Card shadow="sm" className="w-full">
        <CardHeader>
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step.number 
                      ? 'bg-primary text-white' 
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-neutral-900' : 'text-neutral-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-neutral-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress 
              value={(currentStep / steps.length) * 100} 
              className="w-full"
              color="primary"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Form Content */}
      {currentStep === 1 && (
        <ProfileForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}

      {currentStep === 2 && (
        <Card shadow="sm" className="w-full max-w-2xl mx-auto">
          <CardBody className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Profile Created Successfully!
            </h2>
            <p className="text-neutral-600 mb-6">
              Your student profile has been created. You can now access all features of the platform.
            </p>
            <Button
              color="primary"
              size="lg"
              onClick={() => router.push('/student/dashboard')}
            >
              Go to Dashboard
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}
