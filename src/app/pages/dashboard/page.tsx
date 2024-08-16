"use client";
import React, { useState } from 'react'
import '../../../app/globals.css'
import Image from 'next/image';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import kwasulogo from '../../../assets/kwasulogo.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Dashboard = () => {
  const [menubarOpen, setMenubarOpen] = useState(false);
  return (
    <div className='home-bg h-[100vh] w-full'>
      <div className=' flex md:hidden items-center justify-between bg-white w-full h-[100px] px-2 sm:px-4'>
        <h1 className=' text-green-600 text-xl uppercase'>Kwasu vte</h1>
        <div onClick={() => setMenubarOpen(!menubarOpen)} className=' cursor-pointer w-fit hover:text-black text-green-700'>
          {
            menubarOpen ? (<CloseOutlinedIcon />) : (<MenuOutlinedIcon />)
          }
        </div>
      </div>
      {
        menubarOpen && (
          <div>
            <ul>
              <li></li>
            </ul>
          </div>
        )
      }
      <div className=' flex items-center justify-between h-[100vh] p-10'>
        <div className=' w-[18%] py-10 h-full bg-gradient-to-t from-green-600 to-green-200 rounded-md flex flex-col items-center justify-between'>
          <div className=' text-center'>
            <div>
              <Image src={kwasulogo} height={250} alt='kwara state university logo' />
            </div>
            <h1 className=' uppercase text-3xl text-white '>Kwasu VTE</h1>
          </div>

          <a href="/" className=' bg-white px-6 py-2 rounded-full border-green-700 hover:border-[5px] duration-500'>Logout</a>
        </div>

        <div className=' w-[80%] h-full'>
          <div className=' w-full flex items-center justify-between'>
            <input type="search" name="" id="" className=' px-4 py-2 rounded-full text-sm text-end focus:outline-none w-[45%]' placeholder='search' />
            <div className=' flex items-center justify-center bg-white rounded-lg mb-6'>
              <div>
                <Image src={kwasulogo} height={50} width={50} alt='kwara state university logo' />
              </div>
              <div className=' flex flex-col items-start justify-center  px-6 py-2 text-left'>
                <h1 className=' font-bold text-slate-600 text-sm'>John Doe</h1>
                <p className=' text-xs text-slate-400'>200LVL</p>
              </div>
            </div>
          </div>


          <div className=' px-10 py-8 mb-10 w-full h-[160px] bg-gradient-to-br from-green-700 to-green-200 rounded-lg flex items-center justify-between'>
            <div className=' w-[80%] h-full flex flex-col items-start justify-between'>
              <h1 className='font-thin text-sm text-white'>August 16, 2023</h1>

              <div>
                <h1 className=' text-white font-bold text-3xl'>Welcome back, John!</h1>
                <p className='font-thin text-sm text-white'>Stay up to date with your VTE course</p>
              </div>
            </div>
            <div>
              <Image src={kwasulogo} height={250} alt='kwara state university logo' />
            </div>
          </div>

          <div className=' flex items-start justify-between w-full'>
            <div className=' w-[65%]'>
              <h1 className=' capitalize font-extrabold text-white font-sans text-lg'>Group information</h1>
              <div className=' w-full flex items-center justify-between mb-10'>
                <div className=' h-[130px] w-[30%] bg-white rounded-lg shadow-md shadow-slate-600 flex flex-col items-center justify-center'>
                  <h1>Group number</h1>
                  <h1 className=' text-4xl font-extrabold text-green-700'>39</h1>
                </div>

                <div className=' h-[130px] w-[30%] bg-white rounded-lg shadow-md shadow-slate-600 flex flex-col items-center justify-center hover:shadow-none hover:border-[3px] hover:border-green-700 duration-500 cursor-pointer'>
                  <h1>Whatsapp Group Link</h1>
                  <h1 className=' text-4xl font-extrabold text-green-700'><WhatsAppIcon className=' text-5xl' /></h1>
                </div>

                <div className=' h-[130px] w-[30%] bg-white rounded-lg shadow-md shadow-slate-600 flex flex-col items-center justify-center'>
                  <h1>Tasks completed</h1>
                  <h1 className=' text-4xl font-extrabold text-green-700'>33%</h1>
                </div>
              </div>

              <h1 className=' capitalize font-extrabold text-white font-sans text-lg'>Practical information</h1>
              <div className=' w-full flex items-center justify-between'>
                <div className=' w-[45%] bg-gradient-to-r from-green-400 to-green-200 px-6 py-2 rounded-lg flex items-center justify-between'>
                  <div>
                    <h1 className=' text-green-900 font-extrabold'>List of available practicals</h1>
                    <button className=' bg-green-700 text-white px-6 py-1 rounded-full duration-500 hover:bg-green-400 hover:border-2 hover:border-green-700'>View</button>
                  </div>

                  <div>
                    <Image src={kwasulogo} height={150} alt='kwara state university logo' />
                  </div>
                </div>
                <div className=' w-[45%] bg-gradient-to-r from-green-400 to-green-200 px-6 py-2 rounded-lg flex items-center justify-between'>
                  <div>
                    <h1 className=' text-green-900 font-extrabold'>List of completed practicals</h1>
                    <button className=' bg-green-700 text-white px-6 py-1 rounded-full duration-500 hover:bg-green-400 hover:border-2 hover:border-green-700'>View</button>
                  </div>

                  <div>
                    <Image src={kwasulogo} height={150} alt='kwara state university logo' />
                  </div>
                </div>
              </div>
            </div>

            <div className=' w-[30%] '>
              <h1 className=' capitalize font-extrabold text-white font-sans text-lg mb-4'>Course Information & Updates</h1>
              <div className='max-h-[400px] overflow-scroll'>
                <div className=' w-full bg-white rounded-lg px-4 py-2 mb-6'>
                  <h1 className=' font-semibold'>Assignment!</h1>
                  <p className=' font-extrathin text-xs'>Assignments are due on the 30th August, 2023 at afghan.</p>
                </div>

                <div className=' w-full bg-white rounded-lg px-4 py-2 mb-6'>
                  <h1 className=' font-semibold'>Assignment!</h1>
                  <p className=' font-extrathin text-xs'>Assignments are due on the 30th August, 2023 at afghan.</p>
                </div>

                <div className=' w-full bg-white rounded-lg px-4 py-2 mb-6'>
                  <h1 className=' font-semibold'>Assignment!</h1>
                  <p className=' font-extrathin text-xs'>Assignments are due on the 30th August, 2023 at afghan.</p>
                </div>

                <div className=' w-full bg-white rounded-lg px-4 py-2 mb-6'>
                  <h1 className=' font-semibold'>Assignment!</h1>
                  <p className=' font-extrathin text-xs'>Assignments are due on the 30th August, 2023 at afghan.</p>
                </div>

                <div className=' w-full bg-white rounded-lg px-4 py-2 mb-6'>
                  <h1 className=' font-semibold'>Assignment!</h1>
                  <p className=' font-extrathin text-xs'>Assignments are due on the 30th August, 2023 at afghan.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard
