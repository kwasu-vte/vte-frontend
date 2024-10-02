import React from 'react'
import {
  CalendarMonth,
  CalendarViewDayRounded,
  Notifications,
  Search,
} from "@mui/icons-material";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <div className=" h-[50px] w-[50px] bg-green-700 rounded-full mx-1"></div>
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
          Staff Management
        </h1>
      </div>

      <div className=' w-full h-[80vh] bg-white p-4 rounded-lg'>
        <div className=' flex items-center justify-end'>
          <div className=" flex items-center justify-center bg-white p-2 rounded-md">
            <CalendarMonth className=" text-[#379E37]" />
            <select name="" id="" className=" mx-4 appearance-none">
              <option value="">August 16, 2024</option>
            </select>
          </div>
        </div>
        <div className=' h-[90%] w-full overflow-scroll'>
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead className="">S/N</TableHead>
                <TableHead className="">Course</TableHead>
                <TableHead className="">Task Title</TableHead>
                <TableHead className="">Description</TableHead>
                <TableHead>Time Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Breeding Of Tilapia Fish</TableCell>
                <TableCell>Choose healthy an...</TableCell>
                <TableCell>Submission Open</TableCell>
                <TableCell>Not Submitted</TableCell>
                <TableCell>---</TableCell>
                <TableCell className="text-right">View</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default page
