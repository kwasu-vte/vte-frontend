"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/dashboard'
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
  if (!loading && user) { role = user.role; }
  return (
    <Protected>
      {role === 'admin' ?
        <>
          <AdminSidebar />
          <AdminDashboard />
        </> : role === "staff" ?
          <>
            <StaffSidebar />
            <StaffDashboard />
          </> : role === "student" ?
            <>
              <Sidebar />
              <Dashboard />
            </> :
            <div className=" h-[100vh] w-[100vw] flex items-center justify-center home-bg">
              <div className="flex flex-col items-center text-center rounded-md justify-center h-[300px] w-[300px] bg-gray-100">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin duration-[10s] border-green-500 mb-4"></div>
                <h1>Loading...</h1>
              </div>
            </div>
      }
    </Protected>
  );
}
