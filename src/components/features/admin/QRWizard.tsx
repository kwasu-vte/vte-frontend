"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Select, 
  SelectItem, 
  Input, 
  Chip,
  Divider,
  Spinner,
  Tooltip
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { skillsApi, skillGroupsApi, mentorsApi, qrCodesApi } from '@/lib/api';
import { z } from 'zod';
import type { Skill, MentorProfile, SkillGroup, PaginatedResponse } from '@/lib/types';

type WizardStep = 'purpose' | 'context' | 'configuration' | 'confirmation' | 'complete';

interface WizardData {
  purpose?: 'single' | 'bulk';
  skillId?: string;
  groupId?: number;
  mentorId?: string;
  count?: number;
  expiresInDays?: number;
  pointsPerScan?: number;
}

interface QRWizardProps {
  currentStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
  onComplete: (data: WizardData) => void;
  initialData?: WizardData;
}

// * Validation schema for wizard data
const WizardDataSchema = z.object({
  purpose: z.enum(['single', 'bulk']),
  skillId: z.string().optional(),
  groupId: z.number().optional(),
  mentorId: z.string().optional(),
  count: z.number().min(1).max(500).default(20),
  expiresInDays: z.number().min(1).max(90).default(7),
  pointsPerScan: z.number().min(1).max(100).default(1),
});

export function QRWizard({ currentStep, onStepChange, onComplete, initialData = {} }: QRWizardProps) {
  const [data, setData] = useState<WizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // * Load skills for context selection
  const { data: skillsResp } = useQuery({
    queryKey: ['qr-wizard-skills'],
    queryFn: async () => (await skillsApi.getAll()).data,
  });
  const skills: Skill[] = (skillsResp as PaginatedResponse<Skill>)?.items ?? [];

  // * Load groups for selected skill
  const { data: groupsResp } = useQuery({
    queryKey: ['qr-wizard-groups', data.skillId],
    queryFn: async () => {
      if (!data.skillId) return [];
      const res = await skillsApi.getGroupsBySkill(data.skillId, { include_full: true });
      return res.data ?? [];
    },
    enabled: !!data.skillId,
  });
  const groups: SkillGroup[] = groupsResp ?? [];

  // * Load mentors
  const { data: mentorsResp } = useQuery({
    queryKey: ['qr-wizard-mentors'],
    queryFn: async () => {
      const res = await mentorsApi.list({ per_page: '100' });
      return res.data ?? [];
    },
  });
  const mentors: MentorProfile[] = mentorsResp ?? [];

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev: WizardData) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'purpose':
        return !!data.purpose;
      case 'context':
        return !!data.skillId && (data.purpose === 'bulk' || !!data.groupId);
      case 'configuration':
        return !!data.count && !!data.expiresInDays && !!data.pointsPerScan;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 'confirmation') {
      handleSubmit();
    } else {
      const steps: WizardStep[] = ['purpose', 'context', 'configuration', 'confirmation', 'complete'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        onStepChange(steps[currentIndex + 1]);
      }
    }
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['purpose', 'context', 'configuration', 'confirmation', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      onStepChange(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const validatedData = WizardDataSchema.parse(data);
      
      if (validatedData.purpose === 'single') {
        if (!validatedData.groupId) throw new Error('Group is required for single mode');
        await qrCodesApi.generateForGroup(validatedData.groupId, {
          quantity: validatedData.count,
          mark_value: validatedData.pointsPerScan,
          expires_at: new Date(Date.now() + validatedData.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
        });
      } else {
        await qrCodesApi.bulkGenerate({
          skill_id: validatedData.skillId!,
          mark_value: validatedData.pointsPerScan,
          codes_per_group: validatedData.count,
          expires_at: new Date(Date.now() + validatedData.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      
      onComplete(validatedData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate QR codes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPurposeStep = () => (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">What would you like to do?</h2>
        <p className="text-neutral-600 mt-2">Choose how you want to create QR codes for practical session attendance tracking.</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              data.purpose === 'single' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            isPressable
            onPress={() => updateData({ purpose: 'single' })}
          >
            <CardBody className="text-center p-6">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="text-lg font-semibold mb-2">Create for One Training Group</h3>
              <p className="text-sm text-neutral-600">
                Generate QR codes for a specific training group. Perfect when you want to track attendance for just one practical session.
              </p>
            </CardBody>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              data.purpose === 'bulk' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            isPressable
            onPress={() => updateData({ purpose: 'bulk' })}
          >
            <CardBody className="text-center p-6">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-semibold mb-2">Create for All Training Groups</h3>
              <p className="text-sm text-neutral-600">
                Generate QR codes for all groups in a vocational skill. Great when you want to prepare codes for multiple practical sessions at once.
              </p>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );

  const renderContextStep = () => (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Choose Your Training Program</h2>
        <p className="text-neutral-600 mt-2">Select the vocational skill and specific training group you&apos;re managing.</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <Select
          label="Which vocational skill are you managing?"
          placeholder="Select a skill"
          selectedKeys={data.skillId ? [data.skillId] : []}
          onChange={(e) => {
            const skillId = e.target.value || null;
            updateData({ skillId: skillId || undefined, groupId: undefined }); // Reset group when skill changes
          }}
          size="lg"
          isRequired
        >
          {skills.map((skill: Skill) => (
            <SelectItem key={String(skill.id)}>
              {skill.title}
            </SelectItem>
          ))}
        </Select>

        {data.purpose === 'single' && (
          <Select
            label="Which training group?"
            placeholder="Select a group"
            selectedKeys={data.groupId ? [String(data.groupId)] : []}
            onChange={(e) => updateData({ groupId: e.target.value ? Number(e.target.value) : undefined })}
            size="lg"
            isDisabled={!data.skillId}
            isRequired
          >
            {groups.map((group: SkillGroup) => (
              <SelectItem key={String(group.id)}>
                {group.group_display_name || `Group ${group.group_number}`}
              </SelectItem>
            ))}
          </Select>
        )}

        {data.purpose === 'bulk' && data.skillId && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Training groups that will get QR codes:</h4>
            <div className="flex flex-wrap gap-2">
              {groups.map((group: SkillGroup) => (
                <Chip key={group.id} color="primary" variant="flat">
                  {group.group_display_name || `Group ${group.group_number}`}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );

  const renderConfigurationStep = () => (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Set Up Your QR Codes</h2>
        <p className="text-neutral-600 mt-2">Configure the details for your attendance tracking codes.</p>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="How many QR codes do you need?"
          type="number"
          value={String(data.count || 20)}
          onChange={(e) => updateData({ count: Number(e.target.value) })}
          min={1}
          max={500}
          size="lg"
          description="Usually one per trainee, plus a few extras for practical sessions"
          isRequired
        />

        <Input
          label="How long should they be valid?"
          type="number"
          value={String(data.expiresInDays || 7)}
          onChange={(e) => updateData({ expiresInDays: Number(e.target.value) })}
          min={1}
          max={90}
          size="lg"
          description="Days until trainees can no longer scan these codes for attendance"
          isRequired
        />
        </div>

        <Input
          label="Attendance points per scan"
          type="number"
          value={String(data.pointsPerScan || 1)}
          onChange={(e) => updateData({ pointsPerScan: Number(e.target.value) })}
          min={1}
          max={100}
          size="lg"
          description="How many attendance points each scan gives to trainees"
          isRequired
        />

        <Select
          label="Assign to instructor (optional)"
          placeholder="Select an instructor"
          selectedKeys={data.mentorId ? [data.mentorId] : []}
          onChange={(e) => updateData({ mentorId: e.target.value || undefined })}
          size="lg"
        >
          {mentors.map((mentor: MentorProfile) => (
            <SelectItem key={String(mentor.user_id || mentor.id)}>
              {mentor.full_name || `${mentor.user?.first_name} ${mentor.user?.last_name}`}
            </SelectItem>
          ))}
        </Select>
      </CardBody>
    </Card>
  );

  const renderConfirmationStep = () => {
    const selectedSkill = skills.find((s: Skill) => String(s.id) === data.skillId);
    const selectedGroup = groups.find((g: SkillGroup) => String(g.id) === String(data.groupId));
    const selectedMentor = mentors.find((m: MentorProfile) => String(m.user_id || m.id) === data.mentorId);

    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Review Your Settings</h2>
          <p className="text-neutral-600 mt-2">Please review everything before creating your QR codes.</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Mode:</span>
              <span>{data.purpose === 'single' ? 'Single Training Group' : 'All Training Groups'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Vocational Skill:</span>
              <span>{selectedSkill?.title || 'Not selected'}</span>
            </div>
            
            {data.purpose === 'single' && (
              <div className="flex justify-between">
                <span className="font-medium">Training Group:</span>
                <span>{selectedGroup?.group_display_name || `Group ${selectedGroup?.group_number}` || 'Not selected'}</span>
              </div>
            )}
            
            {data.purpose === 'bulk' && (
              <div className="flex justify-between">
                <span className="font-medium">Training Groups:</span>
                <span>{groups.length} groups will get codes</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="font-medium">Number of codes:</span>
              <span>{data.count || 20}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Valid for:</span>
              <span>{data.expiresInDays || 7} days</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Points per scan:</span>
              <span>{data.pointsPerScan || 1}</span>
            </div>
            
            {selectedMentor && (
              <div className="flex justify-between">
                <span className="font-medium">Assigned instructor:</span>
                <span>{selectedMentor.full_name || `${selectedMentor.user?.first_name} ${selectedMentor.user?.last_name}`}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </CardBody>
      </Card>
    );
  };

  const renderCompleteStep = () => (
    <Card className="bg-green-50 border-green-200">
      <CardBody className="text-center py-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-semibold text-green-800 mb-2">QR Codes Created Successfully!</h2>
        <p className="text-green-700 mb-4">
          Your practical session attendance tracking codes have been generated and are ready to use.
        </p>
        <div className="bg-white p-4 rounded-lg inline-block">
          <p className="text-sm text-gray-600">
            You can now print these codes or view them in the QR Code Status panel on the right.
          </p>
        </div>
      </CardBody>
    </Card>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'purpose':
        return renderPurposeStep();
      case 'context':
        return renderContextStep();
      case 'configuration':
        return renderConfigurationStep();
      case 'confirmation':
        return renderConfirmationStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStep()}
      
      {/* * Navigation buttons */}
      {currentStep !== 'complete' && (
        <Card>
          <CardBody>
            <div className="flex justify-between">
              <Button
                variant="bordered"
                onPress={handleBack}
                isDisabled={currentStep === 'purpose'}
              >
                Back
              </Button>
              
              <Button
                color="primary"
                onPress={handleNext}
                isDisabled={!canProceed()}
                isLoading={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    Creating QR Codes...
                  </>
                ) : currentStep === 'confirmation' ? (
                  'Create QR Codes'
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
