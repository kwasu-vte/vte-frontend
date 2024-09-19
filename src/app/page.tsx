"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/page'

interface PageProps {
  customProp: string;
}

const page = ({customProp}: PageProps): JSX.Element => {
  console.log(`custom prop is ${customProp}`)
  if (customProp === 'someValue') {
    return (
      <div>
        fuck
      </div>
    );
  } else {
    return (
      <div> 
        <Dashboard />
      </div>
    );
  }
}

export default page
