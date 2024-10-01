"use client";
import React, { useEffect, useState } from 'react'
import logo from '../../assets/kwasulogo.png'
import Image from 'next/image'
import Link from 'next/link'
import { Book, CalendarMonth, Group, HomeRounded, Layers, LogoutRounded, Person2, Settings, WalletRounded } from '@mui/icons-material'
import customer from '@/assets/customerSupport.png'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Calendar, CalendarCog } from 'lucide-react';

const StaffSidebar = ({ setIsAuthenticated }) => {
    const [currentPath, setCurrentPath] = useState('');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);


    return (
        <div className=' z-50 fixed h-[100vh] py-2 w-[18%]'>
            <div className=' h-full w-full bg-gradient-to-t from-[#133813] to-[#379E37] mx-2 rounded-md flex flex-col items-center justify-between pb-10'>
                <div className=' w-full'>
                    <Image
                        src={logo}
                        height={200}
                        width={200}
                        alt=''
                        className=' m-auto'
                    />
                    <div className=' w-full'>
                        <Link href="/adminDashboard" onClick={() => setCurrentPath('/adminDashboard')}>
                            <div
                                className={
                                    currentPath === '/adminDashboard'
                                        ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                        : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                }
                            >
                                <HomeRounded className="mx-2" />
                                Dashboard
                            </div>
                        </Link>

                        <Link href="/staffManagement" onClick={() => setCurrentPath('/staffManagement')}>
                            <div
                                className={
                                    currentPath === '/staffManagement'
                                        ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                        : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                }
                            >
                                <CalendarMonth className=' mx-2' />
                                Attendance
                            </div>
                        </Link>

                        <Link href="/groupManagement" onClick={() => setCurrentPath('/groupManagement')}>
                            <div
                                className={
                                    currentPath === '/groupManagement'
                                        ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                        : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                }
                            >
                                <Settings className=' mx-2' />
                                Settings
                            </div>
                        </Link>
                    </div>
                </div>

                <div className=' flex flex-col items-center justify-center'>
                    <Image
                        src={customer}
                        alt=''
                        width={60}
                        height={60}
                    />
                    <h1 className=' text-white mt-4'>Customer Support</h1>
                </div>

                <Link href={'/'}><button onClick={() => setIsAuthenticated(false)} className=' bg-[#9BCE9B] text-[#0B200B] px-2 rounded-md py-1 hover:px-4 duration-500'><LogoutRounded className=' mx-2' /> Logout</button></Link>
            </div>
        </div>
    )
}

export default StaffSidebar
