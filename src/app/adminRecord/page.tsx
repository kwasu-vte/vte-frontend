// * Page Purpose: Displays admin group records and member scores.
// ! Security: Renders only for authenticated users; must be moved under `(authenticated)` layout and rely on server-side auth via `middleware.ts`.
// ? Data Sources: Groups and group details fetched via `api.ts` through the `/api/[...proxy]` route.
// TODO: Refactor this page to the new architecture:
//   - Use `AppShell` via `src/app/(authenticated)/layout.tsx`.
//   - Fetch data with `@tanstack/react-query` using methods from `src/lib/api.ts`.
//   - Wrap lists in `StateRenderer` and display rows using `DataTable`.
//   - Replace any MUI/Radix usage with NextUI per Design Guide.
//   - Remove local sidebars; navigation comes from unified `Sidebar`.
//   - Ensure role-based access (admin-only) via `permissions.ts`.

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Records</h1>
      <p className="mt-4 text-base">This page is pending refactor to the new architecture. Legacy dependencies have been removed to unblock the build.</p>
    </div>
  );
}
