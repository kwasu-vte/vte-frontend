"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StudentProfile, User } from "@/lib/types";
import { toast } from "react-toastify";
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User as UserIcon, GraduationCap } from "lucide-react";

export default function StudentProfilesPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    matric_number: "",
    student_level: "",
    department: "",
    faculty: "",
    phone: "",
    gender: "male" as "male" | "female",
    meta: "",
  });

  // * Load students and profiles
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load students (this would need to be implemented in the API)
      // For now, we'll use mock data
      const mockStudents: User[] = [
        {
          id: "1",
          email: "student1@example.com",
          first_name: "John",
          last_name: "Doe",
          matric_number: null,
          level: "300",
          role: "Student",
          is_active: true,
          is_superuser: false,
        },
        {
          id: "2",
          email: "student2@example.com",
          first_name: "Jane",
          last_name: "Smith",
          matric_number: null,
          level: "400",
          role: "Student",
          is_active: true,
          is_superuser: false,
        },
      ];
      
      setStudents(mockStudents);
      
      // Load existing profiles (this would need to be implemented in the API)
      // For now, we'll use mock data
      const mockProfiles: StudentProfile[] = [];
      setProfiles(mockProfiles);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // * Create student profile
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      const response = await api.createStudentProfile(selectedStudent.id, {
        matric_number: formData.matric_number,
        student_level: formData.student_level,
        department: formData.department,
        faculty: formData.faculty,
        phone: formData.phone,
        gender: formData.gender,
        meta: formData.meta || null,
      });

      if (response.success) {
        toast.success("Student profile created successfully!");
        setIsCreateModalOpen(false);
        setSelectedStudent(null);
        setFormData({
          matric_number: "",
          student_level: "",
          department: "",
          faculty: "",
          phone: "",
          gender: "male",
          meta: "",
        });
        loadData();
      } else {
        toast.error(response.message || "Failed to create student profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create student profile");
    }
  };

  // * Open create modal
  const openCreateModal = (student: User) => {
    setSelectedStudent(student);
    setFormData({
      matric_number: "",
      student_level: student.level || "",
      department: "",
      faculty: "",
      phone: "",
      gender: "male",
      meta: "",
    });
    setIsCreateModalOpen(true);
  };

  // * Check if student has profile
  const hasProfile = (studentId: string) => {
    return profiles.some(profile => profile.id.toString() === studentId);
  };

  // * Get student profile
  const getStudentProfile = (studentId: string) => {
    return profiles.find(profile => profile.id.toString() === studentId);
  };

  return (
    <FadeInFromBottom>
      <div className="w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#379E37]">Student Profiles</h1>
            <p className="text-gray-600">Manage student academic profiles and information</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Students</h2>
            <p className="text-gray-600">Click to create or view student profiles</p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#379E37] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Profile Status</TableHead>
                  <TableHead>Matric Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const profile = getStudentProfile(student.id);
                  const hasStudentProfile = hasProfile(student.id);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#379E37] rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{student.first_name} {student.last_name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {student.level} Level
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hasStudentProfile
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {hasStudentProfile ? "Profile Created" : "No Profile"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {profile?.matric_number || "Not set"}
                      </TableCell>
                      <TableCell>
                        {profile?.department || "Not set"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => openCreateModal(student)}
                          size="sm"
                          className={hasStudentProfile ? "bg-blue-600 hover:bg-blue-700" : "bg-[#379E37] hover:bg-[#2d7a2d]"}
                        >
                          {hasStudentProfile ? (
                            <>
                              <GraduationCap className="w-4 h-4 mr-2" />
                              View Profile
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Profile
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Create/Edit Profile Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent ? `Create Profile for ${selectedStudent.first_name} ${selectedStudent.last_name}` : "Create Student Profile"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="matric_number">Matric Number</Label>
                  <Input
                    id="matric_number"
                    value={formData.matric_number}
                    onChange={(e) => setFormData({ ...formData, matric_number: e.target.value })}
                    placeholder="e.g., 20/123456"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="student_level">Student Level</Label>
                  <Select
                    value={formData.student_level}
                    onValueChange={(value) => setFormData({ ...formData, student_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 Level</SelectItem>
                      <SelectItem value="200">200 Level</SelectItem>
                      <SelectItem value="300">300 Level</SelectItem>
                      <SelectItem value="400">400 Level</SelectItem>
                      <SelectItem value="500">500 Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input
                    id="faculty"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    placeholder="e.g., Faculty of Engineering"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +234 801 234 5678"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "male" | "female") => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="meta">Additional Information (Optional)</Label>
                <Input
                  id="meta"
                  value={formData.meta}
                  onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                  placeholder="Any additional information about the student"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSelectedStudent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#379E37] hover:bg-[#2d7a2d]">
                  Create Profile
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </FadeInFromBottom>
  );
}
