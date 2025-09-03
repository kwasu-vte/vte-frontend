// * Modal Purpose: Confirmation dialog for deleting courses/skills.
// ! Security: Admin-only; should only be accessible to authenticated admins.
// ? Data Sources: Course deletion via `api.ts` methods or Server Actions.
// TODO: Refactor to new architecture:
//   - Replace legacy mutation hooks with Server Actions or `api.ts` calls.
//   - Use NextUI Modal components per Design Guide.
//   - Integrate with new authentication system.
//   - Remove legacy toast system in favor of Sonner.

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: any | null;
}

export default function DeleteCourseModal({ isOpen, onClose, selectedCourse }: DeleteCourseModalProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Delete Course</h1>
      <p className="mt-4 text-base">This modal will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}