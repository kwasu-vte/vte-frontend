"use client"
import React from "react"
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button, Divider } from "@nextui-org/react"
import { AlertTriangle, User, GraduationCap, Building, Phone, Users } from "lucide-react"
import { CreateStudentProfilePayload } from "@/lib/types"
import { faculties, type Faculty } from "@/lib/data/faculties"

// * Normalizes phone numbers to an E.164-like format.
// * Rules (Nigeria-focused, but permissive):
// * - If starts with '+', keep digits if length 10-15
// * - If starts with '234' and 13 digits, prefix '+'
// * - If starts with '0' and 11 digits, convert to '+234' + without leading 0
// * - Otherwise, if 10-15 digits, return with '+'
function normalizePhone(input: string): string | null {
  const only = input.replace(/[^0-9+]/g, '')
  if (!only) return null
  if (only.startsWith('+')) {
    const digits = only.replace(/[^0-9]/g, '')
    return digits.length >= 10 && digits.length <= 15 ? only : null
  }
  if (only.startsWith('234') && only.length === 13) {
    return `+${only}`
  }
  if (only.startsWith('0') && only.length === 11) {
    return `+234${only.slice(1)}`
  }
  const digits = only.replace(/[^0-9]/g, '')
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`
  }
  return null
}

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

function ProfileForm({ onSubmit, initialData, isLoading = false }: ProfileFormProps) {
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

  // Dependent select state (store IDs internally but submit names expected by payload)
  const [selectedFacultyId, setSelectedFacultyId] = React.useState<string>("")
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<string>("")

  React.useEffect(() => {
    // Initialize select IDs from initialData names if provided
    if (!selectedFacultyId && formData.faculty) {
      const f = faculties.find(x => x.name === formData.faculty || x.id === formData.faculty || x.slug === formData.faculty)
      if (f) setSelectedFacultyId(f.id)
    }
    if (!selectedDepartmentId && formData.department) {
      // Try match within selected faculty first
      const fac: Faculty | undefined = faculties.find(f => f.id === selectedFacultyId) || faculties.find(f => f.departments.some(d => d.name === formData.department || d.id === formData.department || d.slug === formData.department))
      const dep = fac?.departments.find(d => d.name === formData.department || d.id === formData.department || d.slug === formData.department)
      if (dep) setSelectedDepartmentId(dep.id)
    }
  }, [formData.faculty, formData.department, selectedFacultyId, selectedDepartmentId])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateStudentProfilePayload, string>> = {}

    // Matric number validation (format: 11/22AB/12345)
    if (!formData.matric_number.trim()) {
      newErrors.matric_number = 'Matric number is required'
    } else if (!/^\d{2}\/\d{2}[A-Z]{2}\/\d{5}$/i.test(formData.matric_number.trim())) {
      newErrors.matric_number = 'Format must be like 11/22AB/12345'
    }

    // Level validation
    if (!formData.student_level) {
      newErrors.student_level = 'Student level is required'
    }

    // Faculty validation (must pick from list)
    if (!selectedFacultyId) {
      newErrors.faculty = 'Faculty is required'
    }
    // Department validation (must pick from list)
    if (!selectedDepartmentId) {
      newErrors.department = 'Department is required'
    }

    // Phone validation (Nigerian local format e.g., 07012345678)
    const rawPhone = formData.phone.trim()
    if (!rawPhone) {
      newErrors.phone = 'Phone number is required'
    } else {
      const digits = rawPhone.replace(/[^0-9]/g, '')
      if (!(digits.length === 11 && digits.startsWith('0'))) {
        newErrors.phone = 'Please enter a valid Nigerian phone number in local format e.g. 07012345678.'
      }
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
      // Prepare submission: map selected IDs to names and keep local-format phone
      const faculty = faculties.find(f => f.id === selectedFacultyId)
      const department = faculty?.departments.find(d => d.id === selectedDepartmentId)
      onSubmit({
        ...formData,
        faculty: faculty?.name || formData.faculty,
        department: department?.name || formData.department,
        phone: formData.phone.trim().replace(/[^0-9]/g, '')
      })
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
                placeholder="e.g., 25/67CE/00150"
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
                placeholder="e.g., 07012345678"
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
              <Select
                label="Faculty"
                placeholder="Select faculty"
                selectedKeys={selectedFacultyId ? [selectedFacultyId] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string
                  setSelectedFacultyId(value)
                  setSelectedDepartmentId("")
                  const fac = faculties.find(f => f.id === value)
                  handleInputChange('faculty', fac?.name || '')
                }}
                isInvalid={!!errors.faculty}
                errorMessage={errors.faculty}
                isRequired
              >
                {faculties.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Department"
                placeholder={selectedFacultyId ? "Select department" : "Select faculty first"}
                selectedKeys={selectedDepartmentId ? [selectedDepartmentId] : []}
                isDisabled={!selectedFacultyId}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string
                  setSelectedDepartmentId(value)
                  const fac = faculties.find(f => f.id === selectedFacultyId)
                  const dep = fac?.departments.find(d => d.id === value)
                  handleInputChange('department', dep?.name || '')
                }}
                isInvalid={!!errors.department}
                errorMessage={errors.department}
                isRequired
              >
                {(faculties.find(f => f.id === selectedFacultyId)?.departments || []).map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </Select>
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

export { ProfileForm }
export default ProfileForm
