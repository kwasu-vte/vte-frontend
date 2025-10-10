"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { studentsApi } from "@/lib/api";
import type { StudentProfile } from "@/lib/types";
import ProfileView from "@/components/features/student/ProfileView";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export function StudentProfileModal({ isOpen, onClose, userId }: StudentProfileModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["student-profile", userId],
    queryFn: async () => {
      if (!userId) return null as unknown as StudentProfile;
      const res = await studentsApi.getProfile(userId);
      return res.data;
    },
    enabled: isOpen && !!userId,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Student Profile</h2>
          <p className="text-sm text-neutral-600">Read-only profile details</p>
        </ModalHeader>
        <ModalBody>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-neutral-600">Loading...</span>
            </div>
          )}
          {error && (
            <div className="text-center p-8">
              <div className="text-error text-5xl mb-2">⚠️</div>
              <div className="text-neutral-700">Failed to load profile</div>
            </div>
          )}
          {!isLoading && !error && data && <ProfileView profile={{
            matric_number: data.matric_number,
            student_level: data.student_level || "",
            department: data.department,
            faculty: data.faculty || "",
            phone: data.phone || "",
            gender: (data.gender as any) || "",
          }} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}


