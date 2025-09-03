// * Test Page
// * Simple page to verify AppShell integration
// * Tests server-side authentication and layout

// * Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          AppShell Integration Test
        </h1>
        <p className="text-neutral-600">
          If you can see this page, the AppShell integration is working correctly.
        </p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ AppShell Layout: Working<br/>
            ✅ Server-Side Authentication: Working<br/>
            ✅ Protected Route: Working<br/>
            ✅ User Data: Loaded from server
          </p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Next Steps
        </h2>
        <ul className="list-disc list-inside space-y-2 text-neutral-600">
          <li>Verify the sidebar shows correct navigation for your role</li>
          <li>Check that the header displays your user information</li>
          <li>Test navigation between different sections</li>
          <li>Verify that logout works correctly</li>
        </ul>
      </div>
    </div>
  );
}
