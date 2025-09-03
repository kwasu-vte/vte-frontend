// * Header Component
// * Sticky header at the top of the main content area
// * Contains breadcrumbs and user profile dropdown

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';
import { Menu, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

// * Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return [];
  
  const breadcrumbs = [];
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // * Format segment for display
    let label = segment;
    if (segment === 'admin') label = 'Admin';
    else if (segment === 'mentor') label = 'Mentor';
    else if (segment === 'student') label = 'Student';
    else if (segment === 'dashboard') label = 'Dashboard';
    else if (segment === 'skills') label = 'Skills';
    else if (segment === 'groups') label = 'Groups';
    else if (segment === 'students') label = 'Students';
    else if (segment === 'mentors') label = 'Mentors';
    else if (segment === 'attendance') label = 'Attendance';
    else if (segment === 'payments') label = 'Payments';
    else if (segment === 'settings') label = 'Settings';
    else if (segment === 'profile') label = 'Profile';
    else if (segment === 'payment') label = 'Payment';
    else if (segment === 'my-group') label = 'My Group';
    else if (segment === 'my-groups') label = 'My Groups';
    else if (segment === 'calendar') label = 'Calendar';
    
    // * Capitalize first letter
    label = label.charAt(0).toUpperCase() + label.slice(1);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isLast: i === segments.length - 1,
    });
  }
  
  return breadcrumbs;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* * Left Side - Menu Button and Breadcrumbs */}
        <div className="flex items-center space-x-4">
          {/* * Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
          
          {/* * Breadcrumbs */}
          <nav className="hidden md:flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                {index > 0 && (
                  <span className="text-neutral-400 mx-2">/</span>
                )}
                {breadcrumb.isLast ? (
                  <span className="text-neutral-900 font-medium">
                    {breadcrumb.label}
                  </span>
                ) : (
                  <a
                    href={breadcrumb.href}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {breadcrumb.label}
                  </a>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* * Right Side - Notifications and User Profile */}
        <div className="flex items-center space-x-4">
          {/* * Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <Bell className="w-5 h-5 text-neutral-600" />
            {/* * TODO: Add notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          {/* * User Profile Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-neutral-600 capitalize">
                  {user.role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-600" />
            </button>
            
            {/* * TODO: Implement dropdown menu */}
            {/* * This will contain: Profile, Settings, Logout */}
          </div>
        </div>
      </div>
    </header>
  );
}
