// * Page Purpose: Admin skill/course management — list, create, edit, delete skills; enroll students.
// ! Security: Admin-only; must render under `(authenticated)` layout with server-side auth.
// ? Data Sources: Skills and admin info via `api.ts` methods; mutations via Server Actions or API service.
// TODO: Refactor to new architecture:
//   - Render via `AppShell` under `src/app/(authenticated)/`.
//   - Fetch skills with `@tanstack/react-query` using `api.skills.getAll()`.
//   - Use `StateRenderer` and `DataTable` for list with empty/error/loading states.
//   - Move modals to NextUI and wire to Server Actions or `api.ts` mutations.
//   - Remove legacy sidebars in favor of unified `Sidebar` and role-based navigation.

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Course Management</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}
