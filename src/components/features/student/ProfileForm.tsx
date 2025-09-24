"use client"
import React from "react"
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button, Divider } from "@nextui-org/react"
import { AlertTriangle, User, GraduationCap, Building, Phone, Users } from "lucide-react"
import { CreateStudentProfilePayload } from "@/lib/types"

/**
 * * ProfileForm
 * One-time profile creation form with validation.
 * Shows warning about permanent fields and validates all required fields.
 *
 * Props:
 * - onSubmit: (data: CreateStudentProfilePayload) => void
 * - initialData?: Partial<CreateStudentProfilePayload>
 * - isLoading?: boolean
 */
export type ProfileFormProps = {
  onSubmit: (data: CreateStudentProfilePayload) => void
  initialData?: Partial<CreateStudentProfilePayload>
  isLoading?: boolean
}

export default function ProfileForm({ onSubmit, initialData, isLoading = false }: ProfileFormProps) {
  const [formData, setFormData] = React.useState<CreateStudentProfilePayload>({
    matric_number: initialData?.matric_number || '',
    student_level: initialData?.student_level || '',
    department: initialData?.department || '',
    faculty: initialData?.faculty || '',
    phone: initialData?.phone || '',
    gender: initialData?.gender || 'male',
    meta: initialData?.meta || null
  })

  const [errors, setErrors] = React.useState<Partial<Record<keyof CreateStudentProfilePayload, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateStudentProfilePayload, string>> = {}

    // Matric number validation (basic format check)
    if (!formData.matric_number.trim()) {
      newErrors.matric_number = 'Matric number is required'
    } else if (!/^[A-Z0-9]{6,12}$/i.test(formData.matric_number.trim())) {
      newErrors.matric_number = 'Matric number must be 6-12 alphanumeric characters'
    }

    // Level validation
    if (!formData.student_level) {
      newErrors.student_level = 'Student level is required'
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required'
    }

    // Faculty validation
    if (!formData.faculty.trim()) {
      newErrors.faculty = 'Faculty is required'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof CreateStudentProfilePayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const levelOptions = [
    { value: '100', label: '100 Level' },
    { value: '200', label: '200 Level' },
    { value: '300', label: '300 Level' },
    { value: '400', label: '400 Level' },
    { value: '500', label: '500 Level' }
  ]

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]

  return (
    <Card shadow="sm" className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <p className="text-xl font-medium leading-normal">Create Your Profile</p>
        </div>
        <div className="flex items-center gap-2 text-warning-600 bg-warning-50 p-2 rounded-lg w-full">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm font-medium">Important: Check all information carefully - you cannot edit this later!</p>
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Matric Number"
                placeholder="e.g., 20/12345"
                value={formData.matric_number}
                onValueChange={(value) => handleInputChange('matric_number', value)}
                isInvalid={!!errors.matric_number}
                errorMessage={errors.matric_number}
                isRequired
                startContent={<GraduationCap className="h-4 w-4 text-neutral-400" />}
              />
              
              <Select
                label="Student Level"
                placeholder="Select your level"
                selectedKeys={formData.student_level ? [formData.student_level] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string
                  handleInputChange('student_level', value)
                }}
                isInvalid={!!errors.student_level}
                errorMessage={errors.student_level}
                isRequired
              >
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Gender"
                placeholder="Select gender"
                selectedKeys={formData.gender ? [formData.gender] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string
                  handleInputChange('gender', value)
                }}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender}
                isRequired
              >
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Phone Number"
                placeholder="e.g., +234 801 234 5678"
                value={formData.phone}
                onValueChange={(value) => handleInputChange('phone', value)}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
                isRequired
                startContent={<Phone className="h-4 w-4 text-neutral-400" />}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Academic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Department"
                placeholder="e.g., Computer Science"
                value={formData.department}
                onValueChange={(value) => handleInputChange('department', value)}
                isInvalid={!!errors.department}
                errorMessage={errors.department}
                isRequired
              />
              
              <Input
                label="Faculty"
                placeholder="e.g., Faculty of Engineering"
                value={formData.faculty}
                onValueChange={(value) => handleInputChange('faculty', value)}
                isInvalid={!!errors.faculty}
                errorMessage={errors.faculty}
                isRequired
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="min-w-32"
            >
              {isLoading ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}


