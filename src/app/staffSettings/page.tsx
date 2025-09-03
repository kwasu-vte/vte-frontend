// * Page Purpose: Staff/mentor profile settings and account management.
// ! Security: Should only render for authenticated mentors under `(authenticated)` layout.
// ? Data Sources: Staff profile data via `api.ts` methods; updates via Server Actions.
// TODO: Refactor to new architecture:
//   - Move under `src/app/(authenticated)/mentor/settings/page.tsx`.
//   - Integrate with `AppShell` layout.
//   - Replace legacy auth with server-side session management.
//   - Use NextUI Form components per Design Guide.
//   - Implement profile updates via Server Actions or `api.ts` methods.
//   - Remove legacy sidebar components in favor of unified `Sidebar`.

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Staff Settings</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}