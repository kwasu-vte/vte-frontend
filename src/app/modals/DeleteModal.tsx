// * Modal Purpose: Confirmation dialog for deleting users (staff/students).
// ! Security: Should only be accessible to authenticated admins.
// ? Data Sources: User deletion via `api.ts` methods or Server Actions.
// TODO: Refactor to new architecture:
//   - Replace legacy mutation hooks with Server Actions or `api.ts` calls.
//   - Use NextUI Modal components per Design Guide.
//   - Integrate with new authentication system.
//   - Remove legacy toast system in favor of Sonner.

interface DeleteModalProps {
  setIsDeleteModal: (isOpen: boolean) => void;
  deleteType: string;
  selectedStaff: any | null;
}

export default function DeleteModal({
  setIsDeleteModal,
  deleteType,
  selectedStaff,
}: DeleteModalProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Delete {deleteType}</h1>
      <p className="mt-4 text-base">This modal will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}
