"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/page'
import { useMyProp } from './layout';
import AdminDashboard from '@/app/adminDashboard/page'

<<<<<<< HEAD
interface PageProps {
  customProp: string;
}

const page = ({customProp}: PageProps): JSX.Element => {
  console.log(`custom prop is ${customProp}`)
  if (customProp === 'someValue') {
=======
const page = () => {
  const myProp = useMyProp();
  console.log(myProp)

  if (myProp === "admin") {
>>>>>>> e2e800753b531902d0bd6ac7ed588b3e2218ed7b
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
