import React from 'react'
import {
  CalendarMonth,
  CalendarViewDayRounded,
  Notifications,
  Search,
} from "@mui/icons-material";
import group from "@/assets/Group.png";
import Image from "next/image";
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
import barchart from "@/assets/BarLineChart.png";


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

      <div className=" w-full bg-transparent flex items-start justify-between p-2 mb-2 border-b-2 border-b-[#7ABE7A]">
        <div>
          <h1 className=" text-4xl font-extrabold text-[#379E37] mb-2">
            Welcome back {lastName} {firstName}! 👋🏽
          </h1>
        </div>
        <div className=" flex items-center justify-center bg-white p-2 rounded-md">
          <CalendarMonth className=" text-[#379E37]" />
          <select name="" id="" className=" mx-4 appearance-none">
            <option value="">August 16, 2024</option>
          </select>
        </div>
      </div>

      <div className=" h-fit mb-4 w-full flex items-start justify-between">
        <div className=" w-[45%] flex flex-col items-start justify-between">
          <div className=' border-b-2 border-b-[#7ABE7A] w-full py-4 mb-4'>
            <h1 className=" font-extrabold text-[#379E37] mb-4">
              Overview
            </h1>
            <div className=' w-full flex items-center justify-between mb-4'>
              <div className=' bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%]'>
                <Image src={group} width={50} alt="" height={30} />
                <div className=' text-center w-[80%] flex flex-col items-center justify-center'>
                  <h3 className=' text-sm font-semibold'>Total Students</h3>
                  <h1 className=' font-extrabold text-4xl'>1,595</h1>
                </div>
              </div>

              <div className=' bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%]'>
                <Image src={group} width={50} alt="" height={30} />
                <div className=' text-center w-[80%] flex flex-col items-center justify-center'>
                  <h3 className=' text-sm font-semibold'>Total Staff</h3>
                  <h1 className=' font-extrabold text-4xl'>52</h1>
                </div>
              </div>
            </div>
            <div className=' w-full flex items-center justify-between'>
              <div className=' bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%]'>
                <Image src={group} width={50} alt="" height={30} />
                <div className=' text-center w-[80%] flex flex-col items-center justify-center'>
                  <h3 className=' text-sm font-semibold'>Courses</h3>
                  <h1 className=' font-extrabold text-4xl'>17</h1>
                </div>
              </div>

              <div className=' bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%]'>
                <Image src={group} width={50} alt="" height={30} />
                <div className=' text-center w-[80%] flex flex-col items-center justify-center'>
                  <h3 className=' text-sm font-semibold'>Groups</h3>
                  <h1 className=' font-extrabold text-4xl'>150</h1>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full bg-white min-h-[200px] rounded-md shadow-sm shadow-slate-500 px-2 py-4">
            <h1 className=" font-extrabold text-black mb-4">
              Task completion / Performance
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
        <div className=" w-[45%]">
          <h1 className=" font-extrabold text-[#379E37] mb-4">
            Calendar and Tasks
          </h1>
          <div className=' w-full bg-white'></div>
        </div>
      </div>

      <h1 className=" font-extrabold text-[#379E37] mb-4">
        Recent Payments
      </h1>
      <div className=" h-[400px] w-full overflow-scroll rounded-md">
        <Table className=" rounded-md bg-white h-[200px] overflow-y-scroll">
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
  )
}

export default page
