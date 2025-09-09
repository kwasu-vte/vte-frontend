// * Student Dashboard Page
// * Tests AppShell integration for student role
// * Demonstrates student-specific navigation and permissions

export const dynamic = 'force-dynamic';

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Student Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome to your student portal. This page demonstrates student-specific access.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">My Skills</h3>
          <p className="text-neutral-600 text-sm mb-4">View enrolled skills</p>
          <div className="text-2xl font-bold text-blue-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">My Group</h3>
          <p className="text-neutral-600 text-sm mb-4">View your assigned group</p>
          <div className="text-2xl font-bold text-green-600">0</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Payment</h3>
          <p className="text-neutral-600 text-sm mb-4">Manage payments</p>
          <div className="text-2xl font-bold text-purple-600">0</div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Student Permissions
        </h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-neutral-700">Enroll in skills</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-neutral-700">View my group</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-neutral-700">View payments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-neutral-700">View attendance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-neutral-700">Manage skills (restricted)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-neutral-700">Take attendance (restricted)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
