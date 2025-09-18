'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea } from '@nextui-org/react';

// * Test validation schema
const testSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(255, 'Description must be less than 255 characters').optional(),
  max_students_per_group: z.number().min(1, 'Maximum students must be at least 1'),
});

type TestFormData = z.infer<typeof testSchema>;

export default function TestValidationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: '',
      description: '',
      max_students_per_group: 10,
    },
  });

  const onSubmit = (data: TestFormData) => {
    // * Add min_students_per_group: 1 and max_groups: 100 silently to the request
    const requestData = {
      ...data,
      min_students_per_group: 1,
      max_groups: 100,
    };
    
    console.log('Form submitted:', requestData);
    console.log('Request data with silent fields:', requestData);
    
    // * Simulate API response with message key
    const mockApiResponse = {
      data: {
        message: 'Test validation successful! The form data has been processed.',
        success: true
      }
    };
    
    console.log('Mock API Response:', mockApiResponse);
    alert(`Form submitted successfully!\n\nAPI Response Message: "${mockApiResponse.data.message}"\n\nCheck console for full request data.`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>Validation Test Page</h1>
      <p>Test the updated validation schema.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('title')}
          label="Title"
          placeholder="Enter title"
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
          isRequired
        />
        
        <Textarea
          {...register('description')}
          label="Description"
          placeholder="Enter description (optional)"
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          minRows={3}
        />
        <p className="text-xs text-neutral-500">
          Optional: Provide a detailed description (max 255 characters)
        </p>
        
        <Input
          {...register('max_students_per_group', { valueAsNumber: true })}
          label="Maximum Students per Group"
          type="number"
          min="1"
          max="100"
          isInvalid={!!errors.max_students_per_group}
          errorMessage={errors.max_students_per_group?.message}
          isRequired
        />
        
        <Button type="submit" color="primary">
          Test Submit
        </Button>
      </form>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Test Cases:</h4>
        <ul>
          <li>Leave description empty - should work</li>
          <li>Enter description with 1-4 characters - should work</li>
          <li>Enter description with 256+ characters - should show error</li>
          <li>Leave max students empty - should show error</li>
        </ul>
      </div>
    </div>
  );
}
