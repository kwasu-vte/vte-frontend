// * AppShell Component
// * Main layout wrapper for all authenticated views
// * Receives user data as props from server-side
// * Client component for interactivity

'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NotificationContainer } from '@/components/shared/NotificationContainer';
import { User } from '@/lib/types';
import { useApp } from '@/context/AppContext';

interface AppShellProps {
  children: React.ReactNode;
  user: User; // * User data passed from server-side
}

export function AppShell({ children, user }: AppShellProps) {
  const { isSidebarOpen, toggleSidebar } = useApp();

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* * Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        user={user}
      />
      
      {/* * Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* * Header */}
        <Header 
          user={user}
          onMenuClick={toggleSidebar}
        />
        
        {/* * Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
      
      {/* * Notifications */}
      <NotificationContainer />
    </div>
  );
}
