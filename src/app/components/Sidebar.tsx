import React from 'react'
import logo from '../../assets/kwasulogo.png'
import Image from 'next/image'
import Link from 'next/link'
import { Book, Dashboard, ExitToAppRounded, Home, HomeRounded, LogoutRounded, Settings, WalletRounded } from '@mui/icons-material'
import customer from '@/assets/customerSupport.png'

const Sidebar = () => {
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
                        <Link href={"/studentDashboard"} className=' flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'><HomeRounded className=' mx-2'/> Dashboard</Link>
                        <Link href={"/courses"} className=' flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'><Book className=' mx-2'/> Course</Link>
                        <Link href={""} className=' flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'><WalletRounded className=' mx-2'/> Payment</Link>
                        <Link href={""} className=' flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'><Settings className=' mx-2'/> Settings</Link>
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

                <Link href={""} className=' bg-[#9BCE9B] text-[#0B200B] px-2 rounded-md py-1 hover:px-4 duration-500'><LogoutRounded className=' mx-2'/> Logout</Link>
            </div>
        </div>
    )
}

export default Sidebar
