"use client";
import React from 'react'
import Dashboard from '@/app/studentDashboard/page'

const page = (props) => {
  console.log(`custom prop is ${props.customProp}`)
  if (typeof props.customProp === 'string' && props.customProp === 'someValue') {
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
