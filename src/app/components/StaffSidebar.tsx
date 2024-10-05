"use client";
import React, { useEffect, useState } from 'react'
import logo from '../../assets/kwasulogo.png'
import Image from 'next/image'
import Link from 'next/link'
import { Book, CalendarMonth, Group, HomeRounded, Layers, LogoutRounded, Person2, Settings, WalletRounded } from '@mui/icons-material'
import customer from '@/assets/customerSupport.png'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Calendar, CalendarCog } from 'lucide-react';
import { Logout } from '@/lib/utils';
import { FadeInFromLeft } from './FadeInFromLeft';
import { useAuth } from '@/lib/auth';

const StaffSidebar = () => {
    const { logout } = useAuth();
    const [currentPath, setCurrentPath] = useState('');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);


    return (
        <div className=' z-50 fixed h-[100vh] py-2 w-[18%]'>
            <FadeInFromLeft>
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
                            <Link href="/staffDashboard" onClick={() => setCurrentPath('/staffDashboard')}>
                                <div
                                    className={
                                        currentPath === '/staffDashboard'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <HomeRounded className="mx-2" />
                                    Dashboard
                                </div>
                            </Link>

                            <Link href="/staffAttendance" onClick={() => setCurrentPath('/staffAttendance')}>
                                <div
                                    className={
                                        currentPath === '/staffAttendance'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <CalendarMonth className=' mx-2' />
                                    Attendance
                                </div>
                            </Link>

                            <Link href="/staffSettings" onClick={() => setCurrentPath('/staffSettings')}>
                                <div
                                    className={
                                        currentPath === '/staffSettings'
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

                    <button onClick={logout} className=' bg-[#9BCE9B] text-[#0B200B] px-2 rounded-md py-1 hover:px-4 duration-500'><LogoutRounded className=' mx-2' /> Logout</button>
                </div>
            </FadeInFromLeft>
        </div>
    )
}

export default StaffSidebar
