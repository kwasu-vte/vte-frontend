// * Page Purpose: Admin student management — create, view, edit, delete students.
// ! Security: Admin-only; must render under `(authenticated)` layout with server-side auth.
// ? Data Sources: Students data via `api.ts` methods; mutations via Server Actions.
// TODO: Refactor to new architecture:
//   - Move under `src/app/(authenticated)/admin/students/page.tsx`.
//   - Integrate with `AppShell` layout.
//   - Replace legacy auth with server-side session management.
//   - Use `StateRenderer` and `DataTable` for students list.
//   - Replace legacy sidebar components with unified `Sidebar`.
//   - Implement student CRUD via Server Actions or `api.ts` methods.

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Student Management</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}