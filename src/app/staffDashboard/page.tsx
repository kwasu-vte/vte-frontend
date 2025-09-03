// * Page Purpose: Staff/mentor dashboard with overview of assigned groups and students.
// ! Security: Should only render for authenticated mentors under `(authenticated)` layout.
// ? Data Sources: Staff details, assigned groups, student data via `api.ts` methods.
// TODO: Refactor to new architecture:
//   - Move under `src/app/(authenticated)/mentor/dashboard/page.tsx`.
//   - Integrate with `AppShell` layout.
//   - Replace legacy auth with server-side session management.
//   - Use `StateRenderer` for data display with loading/error states.
//   - Replace legacy sidebar components with unified `Sidebar`.
//   - Fetch staff data via `@tanstack/react-query` using `api.ts` methods.

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}