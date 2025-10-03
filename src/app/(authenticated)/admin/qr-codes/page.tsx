"use client";

import { useState } from 'react';
import { Card, CardBody, CardHeader, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react';
import { QRCodeTable } from '@/components/features/admin/QRCodeTable';
import { QRWizard } from '@/components/features/admin/QRWizard';
import { useQuery } from '@tanstack/react-query';
import { skillsApi, skillGroupsApi } from '@/lib/api';

type WizardStep = 'purpose' | 'context' | 'configuration' | 'confirmation' | 'complete';

export default function AdminQrCodesPage() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [wizardData, setWizardData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState<WizardStep>('purpose');
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  // * Fetch skills
  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: () => skillsApi.list(),
  });

  // * Fetch groups for selected skill
  const { data: groupsData } = useQuery({
    queryKey: ['skill-groups', selectedSkillId],
    queryFn: () => skillGroupsApi.listBySkill(selectedSkillId!),
    enabled: !!selectedSkillId,
  });

  const skills = skillsData?.data?.items || [];
  const groups = groupsData?.data?.items || [];

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
    setCurrentStep('complete');
    // * Refresh the page to show new QR codes
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleCreateClick = () => {
    // * Pre-populate wizard with selected skill and group
    setWizardData({
      skillId: selectedSkillId,
      groupId: selectedGroupId,
    });
    setCurrentStep('purpose');
    onOpen();
  };

  const handleWizardClose = () => {
    onClose();
    setCurrentStep('purpose');
    setWizardData({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">QR Codes for Practical Sessions</h1>
        <p className="text-neutral-600 mt-1">Create and manage QR codes for student attendance tracking during practical training sessions.</p>
      </div>

      {/* * Skill and Group Selection */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Select Skill and Group</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Skill"
              placeholder="Select a skill"
              selectedKeys={selectedSkillId ? [selectedSkillId] : []}
              onChange={(e) => {
                setSelectedSkillId(e.target.value);
                setSelectedGroupId(null); // Reset group when skill changes
              }}
              isRequired
            >
              {skills.map((skill: any) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.title}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Group"
              placeholder="Select a group"
              selectedKeys={selectedGroupId ? [selectedGroupId] : []}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              isDisabled={!selectedSkillId}
              isRequired
            >
              {groups.map((group: any) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* * QR Codes Table */}
      <QRCodeTable
        skillId={selectedSkillId}
        groupId={selectedGroupId}
        onCreateClick={handleCreateClick}
      />

      {/* * QR Creation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleWizardClose}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          body: "py-6",
          backdrop: "bg-black/50 backdrop-opacity-40",
          base: "border border-neutral-200 bg-white",
          header: "border-b border-neutral-200",
          footer: "border-t border-neutral-200",
          closeButton: "hover:bg-neutral-100 active:bg-neutral-200",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Create QR Codes</h2>
                <p className="text-sm text-neutral-600">Generate QR codes for practical sessions</p>
              </ModalHeader>
              <ModalBody>
                <QRWizard
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  onComplete={(data) => {
                    handleWizardComplete(data);
                    onClose();
                  }}
                  initialData={wizardData}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}


