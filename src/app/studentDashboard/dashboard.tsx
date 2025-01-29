'use client';
import {
  CalendarMonth,
  Notifications,
  Search,
} from "@mui/icons-material";
import Image from "next/image"  ;
import Link from "next/link"; 
import React from "react";
import barchart from "@/assets/BarLineChart.png";
import group from "@/assets/Group.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import { useAuth } from "@/lib/auth";
import Typewriter from "../components/Typewriter";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

export default function Dashboard() {
  const { user } = useAuth();
  const lastName = user.last_name;
  const firstName = user.first_name;
  const level = user.level;
  const groupName = "";
  let groupNo = "";
  let groupWhatsappLink = "www.whatapp.me/yedhdgccvfcvhvg/2";
  let d = new Date();
  let currentDate = d.toDateString();

  return (
    <FadeInFromBottom>
      <div className=" w-full h-[100vh] overflow-scroll lg:pl-[20%] py-2 lg:pr-4">
        <div className=" h-[60px] w-full bg-white rounded-md hidden lg:flex items-center justify-between p-2 mb-4">
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

            <div className=" h-[50px] w-[50px] bg-green-700 profile rounded-full mx-1"></div>

            <div className=" mx-1 h-full flex flex-col items-start justify-center min-w-[100px]">
              <h1 className=" font-bold text-lg">
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
                </select>
              </div>
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
                  </select>
                </div>
              </div>
              <div className=" h-[30px] w-[30px] bg-green-700 profile rounded-full mx-1"></div>
            </div>
          </div>
        </div>

        <div className=" w-[97%] m-auto lg:w-full bg-transparent flex items-start justify-between p-2 mb-2 border-b-2 border-b-[#7ABE7A]">
          <div className=" hidden lg:block">
            <h1 className=" text-xl lg:text-4xl font-extrabold text-[#379E37] mb-2 flex">
              W<Typewriter text={`elcome back ${firstName} ${lastName}!`} speed={100} />👋🏽
            </h1>
            <p>
              Stay up to date with your VTE course
            </p>
          </div>
          <div className=" lg:hidden block">
            <h1 className=" text-xl lg:text-4xl font-extrabold text-[#379E37] mb-2 flex">
              Welcome back {firstName} {lastName}!👋🏽
            </h1>
            <p>
              Stay up to date with your VTE course
            </p>
          </div>

          <div className=" hidden lg:flex items-center justify-center bg-white p-2 rounded-md">
            <CalendarMonth className=" text-[#379E37]" />
            <select name="" id="" className=" mx-4 appearance-none">
              <option value="">{currentDate}</option>
            </select>
          </div>
        </div>

        <div className=" h-fit mb-4 lg:w-full w-[97%] m-auto flex flex-col lg:flex-row items-start justify-between">
          <div className=" lg:w-[58%] w-full flex flex-col items-start justify-between">
            <h1 className=" font-extrabold text-[#379E37] mb-4">
              Group Information
            </h1>

            <div className=" w-full flex items-center justify-between lg:h-[80px] mb-4">
              <div className=" px-2 w-[32%] flex flex-col lg:flex-row items-center justify-center min-h-[100px] lg:h-full rounded-lg shadow-sm shadow-slate-500 bg-white border-[4px] border-white hover:border-[#379E37] duration-500 cursor-pointer">
                <Image src={group} alt="" className=" w-[30px] lg:w-[50px]" />
                <div className=" text-center mx-4">
                  <h1 className=" text-sm lg:text-lg">Specialization</h1>
                  <h1 className=" font-bold text-xl">{groupName}</h1>
                </div>
              </div>
              <div className=" px-2 w-[32%] flex flex-col lg:flex-row items-center justify-center min-h-[100px] lg:h-full rounded-lg shadow-sm shadow-slate-500 bg-white border-[4px] border-white hover:border-[#379E37] duration-500 cursor-pointer">
                <Image src={group} alt="" className=" w-[30px] lg:w-[50px]" />
                <div className=" text-center mx-4">
                  <h1 className=" text-sm lg:text-lg">Group Number</h1>
                  <h1 className=" font-bold text-3xl">{groupNo}</h1>
                </div>
              </div>
              <div className=" px-2 w-[32%] flex flex-col lg:flex-row items-center justify-center min-h-[100px] lg:h-full rounded-lg shadow-sm shadow-slate-500 bg-white border-[4px] border-white hover:border-[#379E37] duration-500 cursor-pointer">
                <Image src={group} alt="" className=" w-[30px] lg:w-[50px]" />
                <div className=" text-center mx-4">
                  <h1 className=" text-sm lg:text-lg">Group</h1>
                  <h1 className=" font-semibold text-sm lg:text-lg">WhatsAppLink</h1>
                </div>
              </div>
            </div>

            <div className=" w-full bg-white min-h-[200px] rounded-md shadow-sm shadow-slate-500 px-2 py-4">
              <h1 className=" font-extrabold text-black mb-4">
                Task completion / Performance
              </h1>
              {/* <Image
                src={barchart}
                height={300}
                width={800}
                alt=""
                className=" my-4 max-w-[90%] m-auto"
              /> */}
            </div>

          </div>

          <div className=" w-full lg:w-[40%]">
            <h1 className=" font-extrabold text-[#379E37] mb-4">
              Group Information
            </h1>
            <div className=" w-full bg-white p-2 rounded-md mb-4">
              <h1 className=" font-extrabold text-black mb-4">
                List of available practicals
              </h1>
              <div className=" w-full flex items-center justify-between">
                <h1 className=" w-[60%]">Task</h1>
                <h1 className=" w-[40%] text-[#379E37]">Due Date</h1>
              </div>
              <div className=" max-h-[100px] overflow-scroll">
                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                  <h1 className=" w-[60%] flex items-center justify-start">
                    {" "}
                    <div className=" h-[20px] w-[20px] bg-[#E8BB78] mx-1 my-0 rounded-md"></div>{" "}
                    Breeding Tilapia Fish
                  </h1>
                  <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                </div>
              </div>
            </div>

            <div className=" w-full bg-white p-2 rounded-md mb-4">
              <h1 className=" font-extrabold text-black mb-4">
                List of completed practicals
              </h1>
              <div className=" w-full flex items-center justify-between">
                <h1 className=" w-[60%]">Task</h1>
                <h1 className=" w-[40%] text-[#379E37]">Due Date</h1>
              </div>
              <div className=" max-h-[100px] overflow-scroll">

                <div className=" w-full flex items-center justify-between py-2 border-b border-b-slate-300">
                  <h1 className=" w-[60%] flex items-center justify-start">
                    {" "}
                    <div className=" h-[20px] w-[20px] bg-[#7ABE7A] mx-1 my-0 rounded-md"></div>{" "}
                    Breeding Tilapia Fish
                  </h1>
                  <h1 className=" w-[40%]">Aug 17, 2024, 11:59pm</h1>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className=" max-h-[200px] w-full overflow-scroll py-4 rounded-md">
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

            </TableBody>
          </Table>
        </div>
      </div>
    </FadeInFromBottom>
  );
};