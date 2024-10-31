"use client";
import React, { useEffect, useState } from 'react'
import logo from '../../assets/kwasulogo.png'
import Image from 'next/image'
import Link from 'next/link'
import { Book, Group, HomeRounded, Layers, LogoutRounded, Person2, Settings, WalletRounded } from '@mui/icons-material'
import customer from '@/assets/customerSupport.png'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Logout } from '@/lib/utils';
import { FadeInFromLeft } from './FadeInFromLeft';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
    const { logout } = useAuth();
    let currentPath = usePathname();
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
                            <Link href="/">
                                <div
                                    className={
                                        currentPath === '/'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <HomeRounded className="mx-2" />
                                    Dashboard
                                </div>
                            </Link>

                            <Link href="/staffManagement">
                                <div
                                    className={
                                        currentPath === '/staffManagement'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <Person2 className=' mx-2' />
                                    Staff Mgt.
                                </div>
                            </Link>

                            <Link href="/studentManagement">
                                <div
                                    className={
                                        currentPath === '/studentManagement'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <Person2 className=' mx-2' />
                                    Student Mgt.
                                </div>
                            </Link>

                            {/* <Link href="/adminApproval">
                                <div
                                    className={
                                        currentPath === '/adminApproval'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <Layers className=' mx-2' />
                                    Approval
                                </div>
                            </Link> */}

                            <Link href="/courseManagement">
                                <div
                                    className={
                                        currentPath === '/courseManagement'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <Group className=' mx-2' />
                                    Course Mgt.
                                </div>
                            </Link>

                            <Link href="/groupManagement">
                                <div
                                    className={
                                        currentPath === '/groupManagement'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <Group className=' mx-2' />
                                    Group Mgt.
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

export default AdminSidebar