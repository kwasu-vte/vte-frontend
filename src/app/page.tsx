"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/page'
import { useMyProp } from './layout';
import AdminDashboard from '@/app/adminDashboard/page'
import StaffDashboard from '@/app/staffDashboard/page'

const page = () => {
  const myProp = useMyProp();
  console.log(myProp)

  if (myProp === "admin") {
    return (
      <div>
        <AdminDashboard />
      </div>
    )
  } else if (myProp === "staff") {
    return (
      <div>
        <StaffDashboard />
      </div>
    )
  } else {
    return (
      <div>
        <Dashboard />
      </div>
    )
  }



}

export default page
