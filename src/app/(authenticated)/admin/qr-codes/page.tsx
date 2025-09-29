"use client";

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Progress } from '@nextui-org/react';
import { QRWizard } from '@/components/features/admin/QRWizard';
import { QRDistributionTracker } from '@/components/features/admin/QRDistributionTracker';

type WizardStep = 'purpose' | 'context' | 'configuration' | 'confirmation' | 'complete';

export default function AdminQrCodesPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('purpose');
  const [wizardData, setWizardData] = useState<any>({});
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const steps = [
    { key: 'purpose', title: 'What do you want to do?', description: 'Choose your main task' },
    { key: 'context', title: 'Choose your training program', description: 'Select skill and group' },
    { key: 'configuration', title: 'Set up QR codes', description: 'Configure the details' },
    { key: 'confirmation', title: 'Review and create', description: 'Confirm your settings' },
    { key: 'complete', title: 'All done!', description: 'QR codes created successfully' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleWizardComplete = (data: any) => {
    setWizardData(data);
    setSelectedGroupId(data.groupId);
    setCurrentStep('complete');
  };

  const handleStartOver = () => {
    setCurrentStep('purpose');
    setWizardData({});
    setSelectedGroupId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">QR Codes for Practical Sessions</h1>
        <p className="text-neutral-600 mt-1">Create and manage QR codes for student attendance tracking during practical training sessions.</p>
      </div>

      {/* * Progress indicator */}
      {currentStep !== 'complete' && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardBody className="py-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {steps[currentStepIndex]?.title}
                </h3>
                <p className="text-sm text-blue-700">
                  {steps[currentStepIndex]?.description}
                </p>
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            </div>
            <Progress 
              value={progress} 
              className="w-full" 
              color="primary"
              size="sm"
            />
          </CardBody>
        </Card>
      )}

      {/* * Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* * Wizard - takes up 2 columns */}
        <div className="lg:col-span-2">
          <QRWizard
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onComplete={handleWizardComplete}
            initialData={wizardData}
          />
        </div>

        {/* * Distribution tracker - takes up 1 column */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <h3 className="text-lg font-semibold">QR Code Status</h3>
            </CardHeader>
            <CardBody>
              <QRDistributionTracker selectedGroupId={selectedGroupId} />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* * Start over button */}
      {currentStep === 'complete' && (
        <div className="flex justify-center">
          <Button 
            color="primary" 
            variant="bordered" 
            size="lg"
            onPress={handleStartOver}
          >
            Create More QR Codes
          </Button>
        </div>
      )}
    </div>
  );
}


