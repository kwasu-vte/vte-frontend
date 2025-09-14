// * SkillModal Component
// * Modal for creating and editing skills
// * Uses react-hook-form with zod validation

'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Divider,
} from '@nextui-org/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Skill, CreateSkillPayload, UpdateSkillPayload } from '@/lib/types';

// * Validation schema
const skillSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  max_groups: z.number().min(1, 'Must have at least 1 group').max(100, 'Maximum 100 groups allowed'),
  min_students_per_group: z.number().min(1, 'Minimum 1 student per group').max(50, 'Maximum 50 students per group'),
  max_students_per_group: z.number().min(1, 'Maximum students must be at least 1').max(50, 'Maximum 50 students per group').optional(),
  date_range_start: z.string().min(1, 'Start date is required'),
  date_range_end: z.string().min(1, 'End date is required'),
  allowed_levels: z.array(z.string()).min(1, 'At least one level must be selected'),
  meta: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.max_students_per_group && data.min_students_per_group > data.max_students_per_group) {
    return false;
  }
  return true;
}, {
  message: 'Minimum students per group cannot be greater than maximum students per group',
  path: ['max_students_per_group'],
}).refine((data) => {
  const startDate = new Date(data.date_range_start);
  const endDate = new Date(data.date_range_end);
  return endDate > startDate;
}, {
  message: 'End date must be after start date',
  path: ['date_range_end'],
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSkillPayload | UpdateSkillPayload) => Promise<void>;
  skill?: Skill | null;
  isLoading?: boolean;
}

export function SkillModal({
  isOpen,
  onClose,
  onSubmit,
  skill,
  isLoading = false,
}: SkillModalProps) {
  const isEdit = !!skill;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: '',
      description: '',
      max_groups: 1,
      min_students_per_group: 1,
      max_students_per_group: 10,
      date_range_start: '',
      date_range_end: '',
      allowed_levels: [],
      meta: [],
    },
  });

  // * Reset form when modal opens/closes or skill changes
  useEffect(() => {
    if (isOpen) {
      if (skill) {
        // * Edit mode - populate form with existing data
        reset({
          title: skill.title,
          description: skill.description || '',
          max_groups: skill.max_groups,
          min_students_per_group: skill.min_students_per_group,
          max_students_per_group: skill.max_students_per_group || 10,
          date_range_start: skill.date_range_start || '',
          date_range_end: skill.date_range_end || '',
          allowed_levels: skill.allowed_levels || [],
          meta: skill.meta || [],
        });
      } else {
        // * Create mode - reset to defaults
        reset({
          title: '',
          description: '',
          max_groups: 1,
          min_students_per_group: 1,
          max_students_per_group: 10,
          date_range_start: '',
          date_range_end: '',
          allowed_levels: [],
          meta: [],
        });
      }
    }
  }, [isOpen, skill, reset]);

  // * Handle form submission
  const onFormSubmit = async (data: SkillFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting skill:', error);
    }
  };

  // * Handle level selection
  const handleLevelToggle = (level: string) => {
    const currentLevels = getValues('allowed_levels');
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level];
    setValue('allowed_levels', newLevels);
  };

  // * Handle meta tag addition
  const handleAddMetaTag = () => {
    const currentMeta = getValues('meta') || [];
    const newTag = prompt('Enter meta tag:');
    if (newTag && !currentMeta.includes(newTag)) {
      setValue('meta', [...currentMeta, newTag]);
    }
  };

  // * Handle meta tag removal
  const handleRemoveMetaTag = (tag: string) => {
    const currentMeta = getValues('meta') || [];
    setValue('meta', currentMeta.filter(t => t !== tag));
  };

  const allowedLevels = ['100', '200', '300', '400', '500'];
  const currentLevels = watch('allowed_levels') || [];
  const currentMeta = watch('meta') || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: 'max-h-[90vh]',
        body: 'py-6',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Edit Skill' : 'Create New Skill'}
          </h2>
          <p className="text-sm text-neutral-600">
            {isEdit 
              ? 'Update the skill details below.' 
              : 'Fill in the details to create a new vocational skill.'
            }
          </p>
        </ModalHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <ModalBody className="space-y-6">
            {/* * Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900">Basic Information</h3>
              
              <Input
                {...register('title')}
                label="Skill Title"
                placeholder="Enter skill title"
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                isRequired
              />

              <Textarea
                {...register('description')}
                label="Description"
                placeholder="Enter skill description (optional)"
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                minRows={3}
              />
            </div>

            <Divider />

            {/* * Group Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900">Group Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  {...register('max_groups', { valueAsNumber: true })}
                  label="Max Groups"
                  type="number"
                  min="1"
                  max="100"
                  isInvalid={!!errors.max_groups}
                  errorMessage={errors.max_groups?.message}
                  isRequired
                />

                <Input
                  {...register('min_students_per_group', { valueAsNumber: true })}
                  label="Min Students per Group"
                  type="number"
                  min="1"
                  max="50"
                  isInvalid={!!errors.min_students_per_group}
                  errorMessage={errors.min_students_per_group?.message}
                  isRequired
                />

                <Input
                  {...register('max_students_per_group', { valueAsNumber: true })}
                  label="Max Students per Group"
                  type="number"
                  min="1"
                  max="50"
                  isInvalid={!!errors.max_students_per_group}
                  errorMessage={errors.max_students_per_group?.message}
                />
              </div>
            </div>

            <Divider />

            {/* * Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900">Date Range</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register('date_range_start')}
                  label="Start Date"
                  type="date"
                  isInvalid={!!errors.date_range_start}
                  errorMessage={errors.date_range_start?.message}
                  isRequired
                />

                <Input
                  {...register('date_range_end')}
                  label="End Date"
                  type="date"
                  isInvalid={!!errors.date_range_end}
                  errorMessage={errors.date_range_end?.message}
                  isRequired
                />
              </div>
            </div>

            <Divider />

            {/* * Allowed Levels */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900">Allowed Levels</h3>
              <p className="text-sm text-neutral-600">
                Select which student levels can enroll in this skill.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {allowedLevels.map(level => (
                  <Chip
                    key={level}
                    color={currentLevels.includes(level) ? 'primary' : 'default'}
                    variant={currentLevels.includes(level) ? 'solid' : 'bordered'}
                    className="cursor-pointer"
                    onClick={() => handleLevelToggle(level)}
                  >
                    Level {level}
                  </Chip>
                ))}
              </div>
              {errors.allowed_levels && (
                <p className="text-sm text-red-500">{errors.allowed_levels.message}</p>
              )}
            </div>

            <Divider />

            {/* * Meta Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900">Meta Tags</h3>
              <p className="text-sm text-neutral-600">
                Add optional tags to categorize this skill.
              </p>
              
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="light"
                  size="sm"
                  startContent={<Plus className="w-4 h-4" />}
                  onPress={handleAddMetaTag}
                >
                  Add Tag
                </Button>
                
                {currentMeta.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentMeta.map(tag => (
                      <Chip
                        key={tag}
                        color="secondary"
                        variant="solid"
                        endContent={
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleRemoveMetaTag(tag)}
                          />
                        }
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              isDisabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting || isLoading}
              isDisabled={isSubmitting || isLoading}
            >
              {isEdit ? 'Update Skill' : 'Create Skill'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
