// * Admin Dashboard Page
// * Tests full AppShell integration with real admin functionality
// * Demonstrates the new architecture in action

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome to the new VTE Frontend architecture. This page demonstrates the AppShell integration.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Skills Management</h3>
          <p className="text-neutral-600 text-sm mb-4">Manage vocational skills and courses</p>
          <div className="text-2xl font-bold text-green-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Groups</h3>
          <p className="text-neutral-600 text-sm mb-4">Manage student groups</p>
          <div className="text-2xl font-bold text-blue-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Students</h3>
          <p className="text-neutral-600 text-sm mb-4">Manage student accounts</p>
          <div className="text-2xl font-bold text-purple-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Mentors</h3>
          <p className="text-neutral-600 text-sm mb-4">Manage mentor accounts</p>
          <div className="text-2xl font-bold text-orange-600">0</div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Architecture Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">AppShell Layout</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">Server-Side Authentication</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">Role-Based Navigation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">httpOnly Cookie Security</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">API Integration Testing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">Real Data Loading</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">State Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-neutral-700">Error Handling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
