import React from 'react'
import { CalendarMonth, CalendarViewDayRounded, CloseRounded, Notifications, Search } from '@mui/icons-material'
import Link from 'next/link'
import { Clock, ClockIcon } from 'lucide-react'
import { FadeInFromBottom } from '../components/FadeInFromBottom'
import { useAuth } from '@/lib/auth'
import ResponsiveSidebar from '../components/ResponsiveSidebar'

const Page = () => {
    const lastName = "Olusanmi";
    const firstName = "Pelumi";
    const level = 300;
    const groupName = "";
    let groupNo = "";
    let groupWhatsappLink = "www.whatapp.me/yedhdgccvfcvhvg/2";
    let d = new Date();
    let currentDate = d.toDateString();
    return (
        <FadeInFromBottom>
            <div className=' w-full h-[100vh] overflow-hidden lg:pl-[20%] px-2 lg:px-0 py-2 lg:pr-4'>
                <div className=' hidden h-[60px] w-full bg-white rounded-md lg:flex items-center justify-between p-2 mb-4'>
                    <div className=' bg-[#BFE7BF7A] h-full w-[30%] px-3'>
                        <Search />
                        <input type="text" className=' h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm' placeholder='Search here...' />
                    </div>
                    <div className=' flex items-center justify-center'>
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
                                    {lastName} {firstName}
                                </h1>
                                <div className="flex">
                                    <p className=" uppercase text-[#379E37] text-xs font-bold mr-4">
                                        {level}LVL
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

                <div className=' w-full bg-transparent flex items-start justify-between p-2 mb-2'>
                    <div>
                        <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Notifications</h1>
                    </div>
                    <div className=' flex items-center justify-center bg-white p-2 rounded-md'>
                        <CalendarMonth className=' text-[#379E37]' />
                        <select name="" id="" className=' mx-4 appearance-none'>
                            <option value="">{currentDate}</option>
                        </select>
                    </div>
                </div>
                
                <div className=' h-[650px] overflow-scroll rounded-md shadow-sm shadow-slate-400 w-full bg-white p-3'>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>
                    <div className=' flex items-center justify-between px-3 py-2 border-b border-b-[#9292924D]'>
                        <div className=' w-[10%] h-full flex items-center justify-center'>
                            <div className=' p-2 rounded-md text-white bg-[#D4D4D4]'><CloseRounded /></div>
                        </div>
                        <div className=' w-[90%]'>
                            <div className=' w-full flex items-center justify-between mb-2'>
                                <h1 className=' bg-[#379E37] w-fit p-2 rounded-md text-sm text-white'>New Course Registration</h1>
                                <h1 className=' flex items-center justify-center text-sm text-[#6E6E6E]'><ClockIcon size={20} className=' mx-2' /> {currentDate} at 8:00 am</h1>
                            </div>
                            <h1 className=' font-bold mb-2'>GNS 203: Introduction to Barbing</h1>
                            <h1 className=' text-[#262626] text-sm'>This practical class will walk you through the basics, giving you the skills and confidence to start cutting and styling hair.</h1>
                        </div>
                    </div>

                </div>
            </div>
        </FadeInFromBottom>
    )
}

export default Page
