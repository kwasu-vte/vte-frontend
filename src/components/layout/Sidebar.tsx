// * Sidebar Component
// * Unified sidebar for all user roles
// * Navigation items filtered by user permissions

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, NavigationItem } from '@/lib/types';
import { filterNavigationByPermissions } from '@/lib/permissions';
import { signOutAction } from '@/lib/actions';
import { useApp } from '@/context/AppContext';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  BarChart3, 
  UserCheck,
  GraduationCap,
  Home,
  LogOut,
  QrCode,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  user: User;
}

// * Navigation items for each role
const navigationItems: NavigationItem[] = [
  // * Admin Navigation
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: Home,
    role: ['Admin'],
  },
  {
    href: '/admin/skills',
    label: 'Skills',
    icon: BookOpen,
    role: ['Admin'],
  },
  {
    href: '/admin/groups',
    label: 'Groups',
    icon: Users,
    role: ['Admin'],
  },
  {
    href: '/admin/enrollments',
    label: 'Enrollments',
    icon: ClipboardList,
    role: ['Admin'],
  },
  {
    href: '/admin/students',
    label: 'Students',
    icon: GraduationCap,
    role: ['Admin'],
  },
  {
    href: '/admin/mentors',
    label: 'Mentors',
    icon: UserCheck,
    role: ['Admin'],
  },
  {
    href: '/admin/qr-codes',
    label: 'QR Codes',
    icon: QrCode,
    role: ['Admin'],
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: BarChart3,
    role: ['Admin'],
  },
  {
    href: '/admin/sessions',
    label: 'System Settings',
    icon: Settings,
    role: ['Admin'],
  },

  // * Mentor Navigation
  {
    href: '/mentor/dashboard',
    label: 'Dashboard',
    icon: Home,
    role: ['Mentor'],
  },
  {
    href: '/mentor/my-skills',
    label: 'My Skills',
    icon: BookOpen,
    role: ['Mentor'],
  },
  {
    href: '/mentor/my-groups',
    label: 'My Groups',
    icon: Users,
    role: ['Mentor'],
  },
  {
    href: '/mentor/schedule',
    label: 'Schedule',
    icon: Calendar,
    role: ['Mentor'],
  },
  {
    href: '/mentor/calendar',
    label: 'Calendar',
    icon: Calendar,
    role: ['Mentor'],
  },
  {
    href: '/mentor/my-qr-codes',
    label: 'My QR Codes',
    icon: QrCode,
    role: ['Mentor'],
  },

  // * Student Navigation
  {
    href: '/student/dashboard',
    label: 'Dashboard',
    icon: Home,
    role: ['Student'],
  },
  {
    href: '/student/skills',
    label: 'My Skills',
    icon: BookOpen,
    role: ['Student'],
  },
  {
    href: '/student/my-group',
    label: 'My Group',
    icon: Users,
    role: ['Student'],
  },
  {
    href: '/student/scan-qr',
    label: 'Scan QR Code',
    icon: QrCode,
    role: ['Student'],
  },
];

export function Sidebar({ isOpen, user }: SidebarProps) {
  const pathname = usePathname();
  
  const { isSidebarOpen, toggleSidebar } = useApp();
  // * Filter navigation items by user role
  const userNavigation = filterNavigationByPermissions(navigationItems, user.role);

  return (
    <>
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-70 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${isOpen ? '-translate-x-full' : '-translate-x-0'} 
        md:relative md:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        {/* * Logo/Brand */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-primary">VTE System</h1>
        </div>

        {/* * User Info */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-neutral-600 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* * Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {userNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-neutral-200 text-neutral-700 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* * Footer Actions */}
        <div className="px-4 py-6 border-t border-neutral-200">
          
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center space-x-3 px-3 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 rounded-lg transition-colors w-full mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </form>
        </div>
      </div>
      
    </aside>
     {!isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      </>
  );
}
