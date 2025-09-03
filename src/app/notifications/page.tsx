// * Page Purpose: User notifications and alerts display.
// ! Security: Should only render for authenticated users under `(authenticated)` layout.
// ? Data Sources: Notifications data via `api.ts` methods.
// TODO: Refactor to new architecture:
//   - Move under `src/app/(authenticated)/notifications/page.tsx`.
//   - Integrate with `AppShell` layout.
//   - Replace legacy auth with server-side session management.
//   - Use `StateRenderer` for notifications list with loading/error states.
//   - Replace legacy sidebar components with unified `Sidebar`.
//   - Fetch notifications via `@tanstack/react-query` using `api.ts` methods.

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}