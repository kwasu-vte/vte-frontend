// * Page Purpose: Generate and manage attendance QR codes for selected groups.
// ! Security: Should only render for authenticated users under `(authenticated)` layout; rely on server-side auth via `middleware.ts`.
// ? Data Sources: Groups listing from `api.ts` (proxy-backed). QR is client-generated for display/print.
// TODO: Refactor to new architecture:
//   - Move under `src/app/(authenticated)/` and render via `AppShell`.
//   - Fetch groups using `@tanstack/react-query` with `api.groups.getAll()`.
//   - Use `StateRenderer` for loading/error/empty handling.
//   - Replace ad-hoc buttons/inputs with NextUI components per Design Guide.
//   - Ensure role-based access and visibility via `permissions.ts`.

export default function Attendance() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Attendance</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}
