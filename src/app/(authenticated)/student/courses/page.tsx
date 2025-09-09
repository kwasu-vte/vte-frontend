// * Page Purpose: Student course selection and payment interface.
// ! Security: Should only render for authenticated students under `(authenticated)` layout; rely on server-side auth via `middleware.ts`.
// ? Data Sources: Courses and specializations fetched via `api.ts` (proxy-backed). Payment processing via external service.
// TODO: Refactor to new architecture:
//   - Move under `src/app/(authenticated)/student/` and render via `AppShell`.
//   - Fetch courses using `@tanstack/react-query` with `api.courses.getAll()`.
//   - Use `StateRenderer` for loading/error/empty handling.
//   - Replace MUI/legacy components with NextUI per Design Guide.
//   - Remove client-side token usage (`js-cookie`) in favor of proxy pattern.
//   - Ensure role-based access (student-only) via `permissions.ts`.

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Course Selection</h1>
      <p className="mt-4 text-base">This page will be refactored to the new architecture. Legacy dependencies were removed to unblock the build.</p>
    </div>
  );
}
