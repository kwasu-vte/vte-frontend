// * Page Purpose: Student dashboard with overview of courses, attendance, and progress.
// ! Security: Should only render for authenticated students under `(authenticated)` layout.
// ? Data Sources: Student details, courses, attendance via `api.ts` methods.
// TODO: Refactor to new architecture:
//   - Move under `src/app/(authenticated)/student/dashboard/page.tsx`.
//   - Integrate with `AppShell` layout.
//   - Replace legacy auth with server-side session management.
//   - Use `StateRenderer` for data display with loading/error states.
//   - Replace legacy sidebar components with unified `Sidebar`.
//   - Fetch student data via `@tanstack/react-query` using `api.ts` methods.

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Student Dashboard</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}