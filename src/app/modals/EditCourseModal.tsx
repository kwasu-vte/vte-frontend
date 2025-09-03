// * Modal Purpose: Form for editing course/skill information.
// ! Security: Admin-only; should only be accessible to authenticated admins.
// ? Data Sources: Course updates via `api.ts` methods or Server Actions.
// TODO: Refactor to new architecture:
//   - Replace legacy mutation hooks with Server Actions or `api.ts` calls.
//   - Use NextUI Modal and Form components per Design Guide.
//   - Integrate with new authentication system.
//   - Remove legacy toast system in favor of Sonner.

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: any | null;
}

export default function EditCourseModal({ isOpen, onClose, selectedCourse }: EditCourseModalProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Edit Course</h1>
      <p className="mt-4 text-base">This modal will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}