"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/page'
import { useMyProp } from './layout';
import AdminDashboard from '@/app/adminDashboard/page'

const page = () => {
  const myProp = useMyProp();
  console.log(myProp)

  if (myProp === "admin") {
    return (
      <div>
        <AdminDashboard />
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
