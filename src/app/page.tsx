"use client";
import React, { useState } from "react";
import Dashboard from "@/app/studentDashboard/page";
import AdminDashboard from "@/app/adminDashboard/page";
import StaffDashboard from "@/app/staffDashboard/page";

import StaffSidebar from "./components/StaffSidebar";
import AdminSidebar from "./components/AdminSidebar";
import Sidebar from "./components/Sidebar";

import { Protected } from "@/components/protected";
import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function Page() {
  const { userDetails } = useAuth();
  const [roles, setRoles] = useState("");
  const { isLoggedIn, mounted } = useAuth();
  const router = useRouter();

  if (mounted && isLoggedIn === false) {
    router.push("/auth/sign_in");
  }
  return (
    <Protected>
      {userDetails?.role === "admin" || roles === "admin" ? (
        <>
          <AdminSidebar /> {/*  role={role} setRoles={setRoles}/> */}
          <AdminDashboard />
        </>
      ) : userDetails?.role === "mentor" ? (
        <>
          <StaffSidebar />
          <StaffDashboard />
        </>
      ) : userDetails?.role === "student" ? (
        <>
          <Sidebar />
          <Dashboard />
        </>
      ) : (
        <div className=" h-[100vh] w-[100vw] flex items-center justify-center home-bg">
          <div
            className={`bg-green-500 md:hover:bg-green-500 w-[90%] md:w-[50%] lg:w-[30%] text-white text-[0.85rem] duration-150 py-[1rem] px-[2.3rem] font-semibold tracking-wider md:tracking-widest mt-[1rem] md:mt-[1.5rem] uppercase flex items-center justify-center`}
          >
            <div>
              <div className="animate-spin h-5 w-5 mx-auto border-2 border-white rounded-full border-t-transparent"></div>
              <h1>Loading</h1>
            </div>
          </div>
        </div>
      )}
    </Protected>
  );
}
