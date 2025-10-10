// * SkillModal Component
// * Modal for creating and editing skills
// * Uses react-hook-form with zod validation

'use client';

import React, { useEffect, memo } from 'react';
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
  Accordion,
  AccordionItem,
} from '@heroui/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Skill, CreateSkillPayload, UpdateSkillPayload } from '@/lib/types';

// * Validation schema - simplified for max students per group only
const skillSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(255, 'Description must be less than 255 characters').optional(),
  max_students_per_group: z.number().min(1, 'Maximum students must be at least 1'),
  allowed_levels: z.array(z.string()).min(1, 'At least one level must be selected'),
  meta: z.array(z.string()).optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSkillPayload | UpdateSkillPayload) => Promise<void>;
  skill?: Skill | null;
  isLoading?: boolean;
}

export const SkillModal = memo(function SkillModal({
  isOpen,
  onClose,
  onSubmit,
  skill,
  isLoading = false,
}: SkillModalProps) {
  const isEdit = !!skill;
  
  // * Debug logging
  console.log('🎯 SkillModal rendered:', { isOpen, isEdit, isLoading });
  
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
      max_students_per_group: 10,
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
          max_students_per_group: skill.max_students_per_group || 10,
          allowed_levels: skill.allowed_levels || [],
          meta: skill.meta || [],
        });
      } else {
        // * Create mode - reset to defaults
        reset({
          title: '',
          description: '',
          max_students_per_group: 10,
          allowed_levels: [],
          meta: [],
        });
      }
    }
  }, [isOpen, skill, reset]);

  // * Handle form submission
  const onFormSubmit = async (data: SkillFormData) => {
    console.log('🎯 Form submitted with data:', data);
    
    // * Add min_students_per_group: 1 and max_groups: 100 silently to the request
    const requestData = {
      ...data,
      min_students_per_group: 1,
      max_groups: 100,
    };
    
    console.log('🎯 Request data with silent fields:', requestData);
    
    try {
      await onSubmit(requestData);
      console.log('🎯 Form submission successful, closing modal');
      onClose();
    } catch (error) {
      console.error('🎯 Error submitting skill:', error);
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
        base: 'max-h-[95vh]',
        body: 'py-6 max-h-[70vh] overflow-y-auto',
        footer: 'mt-4',
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
              <p className="text-xs text-neutral-500">
                Optional: Provide a detailed description of this skill (max 255 characters)
              </p>
            </div>

            <Divider />

            {/* * Group Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-900">Group Configuration</h3>
              
              {/* * Alert explaining max students per group */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 mt-0.5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">How Group Sizing Works</h4>
                    <p className="text-sm text-blue-800">
                      The maximum students per group determines how many students can be in any single group for this skill. 
                      For example, if you set this to 70 and have 100 students enrolled, the system will automatically create 
                      two groups: one with 70 students and another with 30 students.
                    </p>
                  </div>
                </div>
              </div>
              
              <Input
                {...register('max_students_per_group', { valueAsNumber: true })}
                label="Maximum Students per Group"
                type="number"
                min="1"
                max="100"
                isInvalid={!!errors.max_students_per_group}
                errorMessage={errors.max_students_per_group?.message}
                isRequired
                placeholder="e.g., 70"
              />
            </div>


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

            {/* * Additional Settings */}
            <Accordion>
              <AccordionItem 
                key="meta-tags" 
                aria-label="Meta Tags" 
                title="Additional Settings"
                subtitle="Optional tags and advanced configuration"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-neutral-900 mb-2">Meta Tags</h4>
                    <p className="text-sm text-neutral-600 mb-4">
                      Add optional tags to categorize this skill.
                    </p>
                    
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="light"
                        size="sm"
                        startContent={<Plus className="w-4 h-4" />}
                        onClick={handleAddMetaTag}
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
                </div>
              </AccordionItem>
            </Accordion>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onClick={onClose}
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
});
