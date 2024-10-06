import React from 'react'
import { CalendarMonth, CalendarViewDayRounded, Filter, Filter1Rounded, Notifications, Person, Search, Sort } from '@mui/icons-material'
import Image from 'next/image'
import Link from 'next/link'
import barchart from '@/assets/BarLineChart.png'
import group from '@/assets/Group.png'
import { FuelIcon } from 'lucide-react'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import paid from '@/assets/paid.png'
import { Avatar } from '@mui/material'
import { FadeInFromBottom } from '../components/FadeInFromBottom'

import { Protected } from '@/components/protected'
import StaffSidebar from '../components/StaffSidebar'

export default function Page() {

  return (
    <Protected>
      <StaffSidebar />
      <FadeInFromBottom>
        <div className='  w-full h-[100vh] overflow-hidden pl-[20%] py-2 pr-4'>
          <div className=' h-[60px] w-full bg-transparent rounded-md flex items-center justify-between p-2 mb-4'>
            <div className=' flex items-center justify-center bg-white p-2 rounded-md'>
              <CalendarMonth className=' text-[#379E37]' />
              <select name="" id="" className=' mx-4 appearance-none'>
                <option value="">August 16, 2024</option>
              </select>
            </div>
            <div className=' flex items-center justify-center bg-white rounded-md py-2 px-3'>
              <Link href={'/notifications/'}>
                <Notifications className=' text-[#379E37] mx-4' />
              </Link>
              <div className=' h-[50px] w-[50px] bg-green-700 profile rounded-full mx-1'></div>
              <div className=' mx-1 h-full flex flex-col items-start justify-center'>
                <h1 className=' font-bold text-lg'>Olusanmi Pelumi</h1>
                <p className=' uppercase text-[#379E37] text-xs font-bold'>200LVL</p>
              </div>
            </div>
          </div>
          <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Settings</h1>
          <div className="w-full flex items-start justify-between">
            <div className=' w-[20%] bg-white h-[250px] rounded-md py-2'>
              <div className=' py-2 text-left bg-[#E2FFE2] text-[#379E37] text-sm font-semibold'><h1 className=' flex items-center justify-center'><Person className=' mx-2' /> Profile Settings</h1></div>
            </div>
            <div className=' w-[78%] h-[600px] bg-white py-10 px-16'>
              <div className=' w-full flex items-start justify-between mb-6'>
                <div className=' flex items-start justify-center'>
                  <div className=' h-[100px] w-[100px] bg-red-800 profile rounded-full'></div>
                  <div className=' mx-4 py-2'>
                    <h1 className=' text-lg font-semibold'>Olusanmi Pelumi</h1>
                    <h1>Biological Science</h1>
                    <h1>200LVL</h1>
                  </div>
                </div>
                <button className=' text-white bg-[#379E37] px-5 text-center py-2 rounded-sm mb-4'>Save Changes</button>
              </div>

              <div className="relative w-[80%] mb-6">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-[#929292] border border-[#58AE58] rounded-lg focus:outline-none peer"
                  placeholder="Enter your email"
                  value={"Olusanmi  Pelumi"}
                />
                <label

                  className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                >
                  Name
                </label>
              </div>

              <div className="relative w-[80%] mb-6">
                <input
                  type="email"
                  id="name"
                  name="name"
                  className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-[#929292] border border-[#58AE58] rounded-lg focus:outline-none peer"
                  placeholder="Enter your email"
                  value={"Joshuasangbeto@gmail.com"}
                />
                <label

                  className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                >
                  Email
                </label>
              </div>

              <div className="relative w-[80%] mb-6">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-[#929292] border border-[#58AE58] rounded-lg focus:outline-none peer"
                  placeholder="Enter your email"
                  value={"Olusanmi  Pelumi"}
                />
                <label

                  className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                >
                  GNS Course
                </label>
              </div>

              <div className="relative w-[80%] mb-6">
                <input
                  type="password"
                  id="name"
                  name="name"
                  className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-[#929292] border border-[#58AE58] rounded-lg focus:outline-none peer"
                  placeholder="Enter your email"
                  value={"Olusanmi  Pelumi"}
                />
                <label

                  className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                >
                  Password
                </label>
              </div>

              <div className=" w-[80%] flex items-start justify-between p-0 m-0 mb-4">
                <div className="relative w-[48%] mx-auto mb-6">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-[#929292] border border-[#58AE58] rounded-lg focus:outline-none peer"
                    placeholder="Enter your matric number"
                    value={"Kwas/bio/218"}
                  />
                  <label

                    className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                  >
                    Matric Number
                  </label>
                </div>
                <div className="relative w-[48%] mx-auto mb-6">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-[#929292] border border-[#58AE58] rounded-lg focus:outline-none peer"
                    placeholder="Enter your level"
                    value={'200 level'}
                  />
                  <label

                    className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                  >
                    Level
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </FadeInFromBottom>
    </Protected>
  )
}
