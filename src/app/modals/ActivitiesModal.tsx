// * Modal Purpose: Display and manage student activities and calendar events.
// ! Security: Should only be accessible to authenticated users (role-based access).
// ? Data Sources: Activities data via `api.ts` methods; calendar events from backend.
// TODO: Refactor to new architecture:
//   - Replace legacy auth with server-side session management.
//   - Use NextUI Modal and Calendar components per Design Guide.
//   - Integrate with new authentication system.
//   - Remove legacy sidebar components in favor of unified `Sidebar`.
//   - Fetch activities via `@tanstack/react-query` using `api.ts` methods.

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivitiesModal({ isOpen, onClose }: ActivitiesModalProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Activities</h1>
      <p className="mt-4 text-base">This modal will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}