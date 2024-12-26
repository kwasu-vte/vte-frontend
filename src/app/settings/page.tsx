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
import Sidebar from '../components/Sidebar'
import ResponsiveSidebar from '../components/ResponsiveSidebar'

const page = () => {
  return (
    <Protected>
      <Sidebar />
      <FadeInFromBottom>
        <div className='  w-full h-[100vh] overflow-hidden lg:pl-[20%] py-2 lg:pr-4 px-2 lg:px-0'>
          <div className=' h-[60px] w-full bg-transparent rounded-md hidden lg:flex items-center justify-between p-2 mb-4'>
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

          {/* Mobile header */}
          <div className=" lg:hidden w-[100vw] h-[60px] px-3 flex items-center justify-between">
            <ResponsiveSidebar />

            <div className=" h-[90%] w-fit bg-white rounded-lg px-2">
              <div className=" h-full flex items-center justify-center">
                <div className=" mx-2 bg-[#BFE7BF7A] h-[40px] w-[40px] rounded-md flex items-center justify-center p-2 cursor-pointer">
                  <Search />
                </div>

                <Link href={"/notifications/"}>
                  <Notifications className=" text-[#379E37] mr-3" />
                </Link>


                <div className=" mx-1 h-full flex flex-col items-start justify-center min-w-[100px]">
                  <h1 className=" font-bold text-md">
                    Olusanmi Pelumi
                  </h1>
                  <div className="flex">
                    <p className=" uppercase text-[#379E37] text-xs font-bold mr-4">
                      200LVL
                    </p>
                    <select className="text-xs uppercase font-semibold  text-[#B7802C] border-none focus:outline-none" name="course" id="course">
                      <option value="gns-202">gns202</option>
                      <option value="vte-202">vte202</option>
                      <option value=""></option>
                      <option value=""></option>
                    </select>
                  </div>
                </div>
                <div className=" h-[30px] w-[30px] bg-green-700 profile rounded-full mx-1"></div>
              </div>
            </div>
          </div>

          <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Settings</h1>
          <div className="w-full flex items-start justify-between">
            <div className=' w-[20%] hidden lg:block bg-white h-[250px] rounded-md py-2'>
              <div className=' py-2 text-left bg-[#E2FFE2] text-[#379E37] text-sm font-semibold'><h1 className=' flex items-center justify-center'><Person className=' mx-2' /> Profile Settings</h1></div>
            </div>
            <div className=' w-full lg:w-[78%] lg:h-[600px] bg-white py-10 px-16'>
              <div className=' w-full flex flex-col lg:flex-row items-start justify-between mb-6'>
                <div className=' flex flex-col lg:flex-row items-start justify-center'>
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

              <div className=" w-[80%] flex flex-col lg:flex-row items-start justify-between p-0 m-0 mb-4">
                <div className="relative w-full lg:w-[48%] mx-auto mb-6">
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
                <div className="relative w-full lg:w-[48%] mx-auto mb-6">
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

export default page
