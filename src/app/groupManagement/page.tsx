import React from 'react'
import {
  CalendarMonth,
  CalendarViewDayRounded,
  Notifications,
  Search,
} from "@mui/icons-material";
import Link from "next/link";
const lastName = "Ojuoye";
const firstName = "Moshood";
const level = "";
const groupName = "";
const groupNo = "40";
const groupWhatsappLink = "40";


const page = () => {
    return (
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
                    Group Management
                </h1>
            </div>

            <div className=' w-full h-[80vh] bg-white p-4 rounded-lg'>
                
            </div>
        </div>
    )
}

export default page
