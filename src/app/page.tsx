"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/page'
import AdminDashboard from '@/app/adminDashboard/page'
import StaffDashboard from '@/app/staffDashboard/page'

import StaffSidebar from "./components/StaffSidebar";
import AdminSidebar from "./components/AdminSidebar";
import Sidebar from './components/Sidebar';

import { Protected } from '@/components/protected';
import { useAuth } from '@/lib/auth';

export default function Page() {
  const { loading, user } = useAuth();

  var role = "";
  if (!loading && user) {role = user.role; }
  return (
    <Protected>
      {role === 'admin'?
        <>
          <AdminSidebar />
          <AdminDashboard />
        </> : role === "staff"?
        <>
          <StaffSidebar />
          <StaffDashboard />
        </>: role === "student"?
        <>
          <Sidebar />
          <Dashboard />
        </>: 
        <p>Loading...</p>
      }
    </Protected>
  );
}
