"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/page'
import AdminDashboard from '@/app/adminDashboard/page'
import StaffDashboard from '@/app/staffDashboard/page'

import StaffSidebar from "./components/StaffSidebar";
import AdminSidebar from "./components/AdminSidebar";

import { Protected } from '@/components/protected';

{/* // <StaffDashboard />
  // <Dashboard /> */}

export default function Page() {
  return (
    <Protected>
      <AdminSidebar />
      <AdminDashboard />
    </Protected>
  );
}
