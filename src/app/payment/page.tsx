import React from 'react'
import { CalendarMonth, CalendarViewDayRounded, Filter, Filter1Rounded, Notifications, Search, Sort } from '@mui/icons-material'
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

const page = () => {
    return (
        <div className={`  w-full h-[100vh] overflow-hidden pl-[20%] py-2 pr-4`}>
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
                    <div className=' h-[50px] w-[50px] bg-green-700 rounded-full mx-1'></div>
                    <div className=' mx-1 h-full flex flex-col items-start justify-center'>
                        <h1 className=' font-bold text-lg'>Olusanmi Pelumi</h1>
                        <p className=' uppercase text-[#379E37] text-xs font-bold'>200LVL</p>
                    </div>
                </div>
            </div>

            <div className=' w-full flex items-start justify-between'>
                <div className=' w-[70%]'>
                    <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Payment</h1>
                    <div className=' w-full bg-white rounded-md flex items-center justify-between px-3 py-2 mb-8'>
                        <div className=''>
                            <h1 className=' text-sm mb-5'>To make payment for the selected course(s), kindly click the link below and follow the prompt.</h1>
                            <Link href={''} className=' bg-[#379E37] text-white font-semibold uppercase text-sm px-10 py-2 rounded-md duration-500 border hover:border-[#379E37] hover:bg-transparent hover:text-[#379E37]'>web payment</Link>
                        </div>

                        <div className=' flex flex-col items-center justify-center w-[30%] bg-gradient-to-b from-[#379E3780] to-[#73F57380] rounded-md px-2 py-3'>
                            <h1>Amount to be paid</h1>
                            <h1 className=' text-3xl font-extrabold py-2'>N 1,100</h1>
                        </div>
                    </div>
                    <div className=' bg-white rounded-md w-full p-4'>
                        <div className=' w-full flex items-end justify-end text-sm'>
                            <div className=' flex items-center justify-center text-[#DC9935] mx-2'>
                                <FilterAltIcon />
                                <select name="" id="" className=' focus:outline-none'>
                                    <option value="">Filter By</option>
                                </select>
                            </div>

                            <button className=' text-[#379E37] mx-2'>Download All</button>
                        </div>
                        <div className=' h-[480px] overflow-scroll'>
                            <Table className=' rounded-md bg-white'>
                                <TableHeader className=''>
                                    <TableRow>
                                        <TableHead className="">Date</TableHead>
                                        <TableHead className="">Description</TableHead>
                                        <TableHead className="">Payment Method</TableHead>
                                        <TableHead className="">Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                    <TableRow className=' h-fit'>
                                        <TableCell className="font-medium">16/08/2024</TableCell>
                                        <TableCell>GNS 303</TableCell>
                                        <TableCell>Transfer to Bank</TableCell>
                                        <TableCell>N1100</TableCell>
                                        <TableCell>Success</TableCell>
                                        <TableCell className="text-right">Download</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className=' w-[30%] h-[100vh] flex flex-col items-center justify-start py-4'>
                    <div className=' w-full text-center'>
                        <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Payment Status</h1>
                        <div className=' w-[80%] m-auto py-4 bg-[#98c898] rounded-lg flex flex-col items-center justify-center'>
                            <Image
                            src={paid}
                            alt=''
                            height={30}
                            width={100}
                            className=' mb-4'
                            />
                            <h1 className=' font-bold text-[#379E37] text-lg mb-4'>Paid</h1>
                            <Link href={''} className=' bg-[#379E37] text-white font-semibold uppercase text-sm px-10 py-2 rounded-md duration-500 border border-transparent hover:border-[#379E37] hover:bg-transparent hover:text-[#379E37]'>Print payment receipt</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default page