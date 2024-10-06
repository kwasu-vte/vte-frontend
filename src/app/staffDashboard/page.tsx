import {
    CalendarMonth,
    CalendarViewDayRounded,
    Notifications,
    Search,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import barchart from "@/assets/BarLineChart.png";
import group from "@/assets/Group.png";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import { useAuth } from "@/lib/auth";



export default function Page() {
    const { user, loading } = useAuth();

    if (loading) return "Loading...";

    const lastName = user.last_name;
    const firstName = user.first_name;
    const currentDate = (new Date()).toDateString();


    return (
        <FadeInFromBottom>
            <div className=" w-full h-[100vh] pl-[20%] py-2 pr-4">
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
                        <Link href={"/notifications/"}>
                            <Notifications className=" text-[#379E37] mx-4" />
                        </Link>
                        <div className=" h-[50px] w-[50px] bg-green-700 profile profile rounded-full mx-1"></div>
                        <div className=" mx-1 h-full flex flex-col items-start justify-center">
                            <h1 className=" font-bold text-lg">
                                {firstName} {lastName}
                            </h1>
                            <p className=" uppercase text-[#379E37] text-xs font-bold">
                                Staff
                            </p>
                        </div>
                    </div>
                </div>

                <div className=" w-full bg-transparent flex items-start justify-between p-2 mb-2 border-b-2 border-b-[#7ABE7A]">
                    <div>
                        <h1 className=" text-4xl font-extrabold text-[#379E37] mb-2">
                            Welcome back {firstName}! 👋
                        </h1>
                        <p>Manage student attendance</p>
                    </div>
                    <div className=" flex items-center justify-center bg-white p-2 rounded-md">
                        <CalendarMonth className=" text-[#379E37]" />
                        <select name="" id="" className=" mx-4 appearance-none">
                            <option value="">{currentDate}</option>
                        </select>
                    </div>
                </div>

                <div className=" h-fit mb-4 w-full flex items-start justify-between">
                    <div className=" w-[58%] flex flex-col items-start justify-between">
                        <h1 className=" font-extrabold text-[#379E37] mb-4">
                            Group Information
                        </h1>
                        <div className=" w-full flex items-center justify-between h-[80px] mb-4">
                            <div className=" px-2 w-[32%] flex items-center justify-center h-full rounded-lg shadow-sm shadow-slate-500 bg-white">
                                <Image src={group} width={50} alt="" height={30} />
                                <div className=" text-center mx-4">
                                    <h1>Groups Assigned</h1>
                                    <h1 className=" font-bold text-xl">24</h1>
                                </div>
                            </div>
                            <div className=" px-2 w-[32%] flex items-center justify-center h-full rounded-lg shadow-sm shadow-slate-500 bg-white">
                                <Image src={group} width={50} alt="" height={30} />
                                <div className=" text-center mx-4">
                                    <h1>Courses Assigned</h1>
                                    <h1 className=" font-bold text-3xl">12</h1>
                                </div>
                            </div>
                            <div className=" px-2 w-[32%] flex items-center justify-center h-full rounded-lg shadow-sm shadow-slate-500 bg-white">
                                <Image src={group} width={50} alt="" height={30} />
                                <div className=" text-center mx-4">
                                    <h1>Pending Attendance</h1>
                                    <h1 className=" font-semibold">1</h1>
                                </div>
                            </div>
                        </div>
                        <div className=" w-full bg-white min-h-[200px] rounded-md shadow-sm shadow-slate-500 px-2 py-4">
                            <h1 className=" font-extrabold text-black mb-4">
                                Attendance for the day/week
                            </h1>
                            <Image
                                src={barchart}
                                height={300}
                                width={800}
                                alt=""
                                className=" my-4 max-w-[90%] m-auto"
                            />
                        </div>
                    </div>

                    <div className=" w-[40%]">
                        <h1 className=" font-extrabold text-[#379E37] mb-4">
                            Attendance Information
                        </h1>
                        <div className=" w-full bg-white p-2 rounded-md mb-4">
                            <h1 className=" font-extrabold text-black mb-4">
                                List of Pending Attendance
                            </h1>
                            <div className=" w-full flex items-center justify-between">
                                <h1 className=" w-[60%]">Task</h1>
                                <h1 className=" w-[40%] text-[#379E37]">Due Date</h1>
                            </div>
                            <div className=" max-h-[330px] overflow-scroll">
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Tailoring Group A
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Tailoring Group B
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Adire Group G
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Fishery Group A
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Fishery Group B
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Hair Dressing / Barbing Group C
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Hair Dressing / Barbing Group E
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Autocad Group A
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Web / App Design Group A
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Poultry Group A
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                                    <h1 className=" w-[60%] flex items-center justify-start">
                                        {" "}
                                        <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                                        Baking Group C
                                    </h1>
                                    <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CourseInformationAndAttendance />        
            </div>
        </FadeInFromBottom>
    )
}


function CourseInformationAndAttendance() {
    return (
        <>
            <h1 className="font-extrabold text-[#379E37]">
                Recent Course information & Attendance
            </h1>
            <div className=" max-h-[200px] w-full overflow-scroll pb-6 rounded-md">
                <Table className=" rounded-md bg-white h-[200px] overflow-y-scroll">
                    <TableHeader className="">
                        <TableRow>
                            <TableHead className="">S/N</TableHead>
                            <TableHead className="">Course Title</TableHead>
                            <TableHead className="">Group</TableHead>
                            <TableHead className="">Course Description</TableHead>
                            <TableHead>Students No</TableHead>
                            <TableHead>Attendance Status</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">1</TableCell>
                            <TableCell>TAILORING</TableCell>
                            <TableCell>Group A</TableCell>
                            <TableCell>Basic Tailoring techni...</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell className="text-green-600">Completed</TableCell>
                            <TableCell className="text-right">View</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">2</TableCell>
                            <TableCell>TAILORING</TableCell>
                            <TableCell>Group B</TableCell>
                            <TableCell>Basic Tailoring techni...</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell className="text-green-600">Completed</TableCell>
                            <TableCell className="text-right">View</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">3</TableCell>
                            <TableCell>Hair Dressing / Barbing</TableCell>
                            <TableCell>Group A</TableCell>
                            <TableCell>Hairdressers are usually trained to be creative with the hair...</TableCell>
                            <TableCell>45</TableCell>
                            <TableCell className="text-red-600">Missing Attendance</TableCell>
                            <TableCell className="text-right">View</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    );
}