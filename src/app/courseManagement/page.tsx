import React from 'react'
import {
    CalendarMonth,
    CalendarViewDayRounded,
    Notifications,
    Search,
} from "@mui/icons-material";
import Link from "next/link";
import { FadeInFromBottom } from '../components/FadeInFromBottom';
import { Protected } from '@/components/protected';
import AdminSidebar from '../components/AdminSidebar';
const lastName = "Ojuoye";
const firstName = "Moshood";
const level = "";
const groupName = "";
const groupNo = "40";
const groupWhatsappLink = "40";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";


const page = () => {
    return (
        <Protected>
            <AdminSidebar />
            <FadeInFromBottom>
                <div className=" w-full h-[100vh] overflow-scroll pl-[20%] py-2 pr-4">
                    <div className=" h-[60px] w-full bg-white rounded-md flex items-center justify-between p-2 mb-4">
                        <div className=" bg-[#BFE7BF7A] h-full w-[30%] px-3">
                            <Search />
                            <input
                                type="text"
                                className=" h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm"
                                placeholder="Search here..."
                            />
                        </div>
                        <div className=" flex items-center justify-center">
                            <Link href={"/studentPages/notifications/"}>
                                <Notifications className=" text-[#379E37] mx-4" />
                            </Link>
                            <div className=" h-[50px] w-[50px] bg-green-700 profile rounded-full mx-1"></div>
                            <div className=" mx-1 h-full flex flex-col items-start justify-center">
                                <h1 className=" font-bold text-lg">
                                    {lastName} {firstName}
                                </h1>
                                <p className=" uppercase text-[#379E37] text-xs font-bold">
                                    200LVL
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl">
                            Course Management
                        </h1>
                    </div>

                    <div className=' w-full h-[80vh] bg-white p-4 rounded-lg'>
                        <div className=' w-full flex items-center justify-end'>
                            <button className=' mx-6 bg-[#379E37] px-3 py-2 rounded-lg text-white cursor-pointer hover:bg-white hover:text-[#379E37] duration-500'>+ Add New Button</button>

                            <div className=" flex items-center justify-center bg-white p-2 rounded-md">
                                <CalendarMonth className=" text-[#379E37]" />
                                <select name="" id="" className=" mx-4 appearance-none">
                                    <option value="">August 16, 2024</option>
                                </select>
                            </div>
                        </div>
                        <div className='mt-2 h-[90%] w-full overflow-scroll'>
                            <Table>
                                <TableHeader className="">
                                    <TableRow>
                                        <TableHead className="">Course Title</TableHead>
                                        <TableHead className="">Staff</TableHead>
                                        <TableHead className="">Enrolled Students</TableHead>
                                        <TableHead className="">Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* {
                                        data.users.staff.map((staff, index) => ( */}
                                            <TableRow>
                                                <TableCell className="font-medium">EDD205</TableCell>
                                                <TableCell>Olusanmi Pelumi</TableCell>
                                                <TableCell>45</TableCell>
                                                <TableCell>Active</TableCell>
                                                <TableCell>
                                                    <div className=''>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        {/* ))
                                    } */}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </FadeInFromBottom>
        </Protected>
    )
}

export default page
