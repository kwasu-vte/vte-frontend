import React from 'react'
import Link from 'next/link'
import { CalendarMonth, Notifications } from '@mui/icons-material'
import { Search } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '700'], // Specify the weights you want to use
});

const page = () => {
    return (
        <div className={` w-full h-[100vh] overflow-hidden pl-[20%] pb-5 py-2 pr-4`}>
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

            <div className=' w-full flex items-center justify-between'>
                <div className=' w-[60%]'>
                    <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Course Code</h1>
                    <div className=' bg-white w-full px-3 flex items-center justify-start py-3 rounded-md mb-3'>
                        <Search />
                        <input type="text" className=' h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm' placeholder='Search here...' />
                    </div>
                    <div className={`${montserrat.className} text-sm font-thin w-full bg-white h-[250px] overflow-scroll rounded-md py-3 mb-4`}>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300'>GNS 203</h1>
                    </div>

                    <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Course Group</h1>
                    <div className=' bg-white w-full px-3 flex items-center justify-start py-3 rounded-md mb-3'>
                        <Search />
                        <input type="text" className=' h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm' placeholder='Search here...' />
                    </div>
                    <div className={`${montserrat.className} text-sm font-thin w-full bg-white h-[250px] overflow-scroll rounded-md py-3 mb-4`}>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                        <h1 className=' w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>Tailoring</h1>
                    </div>
                </div>

                <div className=' w-[40%] h-[100vh] flex flex-col items-center justify-start py-24'>
                    <div className=' w-full text-center mb-4'>
                        <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Selection Details</h1>
                        <div className=' w-[80%] m-auto py-4 bg-[#98c898] rounded-lg mb-4'>
                            <div className=' text-center mb-4'>
                                <p>Assigned Group Name</p>
                                <h1 className=' uppercase font-extrabold text-3xl'>xavier</h1>
                            </div>

                            <div className=' text-center mb-4'>
                                <p>Group Number</p>
                                <h1 className=' uppercase font-extrabold text-3xl'>39</h1>
                            </div>

                            <div className=' text-center mb-4'>
                                <p>Course Code</p>
                                <h1 className=' uppercase font-extrabold text-3xl'>gns303</h1>
                            </div>

                            <div className=' text-center mb-4'>
                                <p>Course Group</p>
                                <h1 className=' uppercase font-extrabold text-3xl'>tailoring</h1>
                            </div>

                            <div className=' text-center mb-4'>
                                <p>Amount To Be Paid</p>
                                <h1 className=' uppercase font-extrabold text-3xl'>N 1,100</h1>
                            </div>
                        </div>
                        <div className=' w-full flex flex-col items-center justify-center'>
                            <Link href={"/payment"} className=' w-[80%] bg-[#379E37] text-white mb-4 py-2 rounded-md'>Make Payment</Link>
                            <Link href={"/payment"} className=' text-sm text-[#379E37] underline'>Show Payment History</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
