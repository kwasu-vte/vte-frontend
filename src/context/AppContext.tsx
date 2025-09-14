// * Application Context
// * Manages global UI state (notifications, sidebar, modals, etc.)
// * Separate from authentication concerns

'use client';

import React, { createContext, useContext, useState } from 'react';

// * Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // Auto-dismiss after X ms
  action?: {
    label: string;
    onClick: () => void;
  };
}

// * App Context Type
interface AppContextType {
  // * Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // * Sidebar State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  
  // * Modal State
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // * Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // * Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // * Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // * Notification Functions
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // Default 5 seconds
    };

    setNotifications(prev => [...prev, newNotification]);

    // * Auto-dismiss after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // * Sidebar Functions
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // * Modal Functions
  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const value: AppContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    activeModal,
    openModal,
    closeModal,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
