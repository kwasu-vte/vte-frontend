"use client";
import React from "react";
import {
  CalendarMonth,
  CalendarViewDayRounded,
  HeartBrokenSharp,
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
import "@/app/Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FadeInFromBottom } from "../components/FadeInFromBottom";

import { Protected } from "@/components/protected";
import { useAuth } from "@/lib/auth";
import Typewriter from "../components/Typewriter";
import data from "@/helpers/demodata";

export default function Page() {
  const { user, loading } = useAuth();


  var lastName = "";
  var firstName = "";

  if (!loading) {
    lastName = user.last_name;
    firstName = user.first_name;
  }

  return (
    <Protected>
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
              <div className=" h-[50px] w-[50px] bg-green-700  profile rounded-full mx-1"></div>
              <div className=" mx-1 h-full flex flex-col items-start justify-center">
                <h1 className=" font-bold text-lg">
                  {lastName} {firstName}
                </h1>
                <p className=" uppercase text-[#379E37] text-xs font-bold">
                  Admin
                </p>
              </div>
            </div>
          </div>

          <div className=" w-full bg-transparent flex items-start justify-between p-2 mb-2 border-b-2 border-b-[#7ABE7A]">
            <div>
              <h1 className=" text-4xl font-extrabold text-[#379E37] mb-2">
                <Typewriter text={`Welcome back ${firstName} ${lastName}! 👋🏽`} speed={100} />
              </h1>
            </div>
            <div className=" flex items-center justify-center bg-white p-2 rounded-md">
              <CalendarMonth className=" text-[#379E37]" />
              <select name="" id="" className=" mx-4 appearance-none">
                <option value="">August 16, 2024</option>
              </select>
            </div>
          </div>

          <div className=" h-[70vh] mb-4 w-full flex items-start justify-between">
            <div className=" w-[45%] flex flex-col items-start justify-start ">
              <div className=" border-b-2 border-b-[#7ABE7A] w-full mb-8 pb-8">
                <h1 className=" font-extrabold text-[#379E37] mb-4">Overview</h1>
                <div className=" w-full flex items-center justify-between mb-4">
                  <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
                    <Image src={group} width={50} alt="" height={30} />
                    <div className=" text-center w-[80%] flex flex-col items-center justify-center">
                      <h3 className=" text-sm font-semibold">Total Students</h3>
                      <h1 className=" font-extrabold text-4xl">{data.users.student.length}</h1>
                    </div>
                  </div>

                  <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
                    <Image src={group} width={50} alt="" height={30} />
                    <div className=" text-center w-[80%] flex flex-col items-center justify-center">
                      <h3 className=" text-sm font-semibold">Total Staff</h3>
                      <h1 className=" font-extrabold text-4xl">{data.users.staff.length}</h1>
                    </div>
                  </div>
                </div>
                <div className=" w-full flex items-center justify-between">
                  <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
                    <Image src={group} width={50} alt="" height={30} />
                    <div className=" text-center w-[80%] flex flex-col items-center justify-center">
                      <h3 className=" text-sm font-semibold">Courses</h3>
                      <h1 className=" font-extrabold text-4xl">{data.courses.length}</h1>
                    </div>
                  </div>

                  <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
                    <Image src={group} width={50} alt="" height={30} />
                    <div className=" text-center w-[80%] flex flex-col items-center justify-center">
                      <h3 className=" text-sm font-semibold">Groups</h3>
                      <h1 className=" font-extrabold text-4xl">{data.assignments.grouped.length}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full bg-white min-h-[200px] rounded-md shadow-sm shadow-slate-500 px-2 py-4 hover:px-1 hover:py-1 duration-500">
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
            <div className=" w-[50%] h-full">
              <h1 className=" font-extrabold text-[#379E37] mb-4">
                Calendar and Tasks
              </h1>
              <div className=" w-full bg-white p-3 rounded-lg">
                <div className=" w-full flex items-end justify-between bg-white rounded-lg mb-4">
                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                      { title: "Test", date: "2024-09-20" },
                      { title: "Pract.", date: "2024-09-25" },
                      { title: "Assgn.", date: "2024-10-02" },
                    ]}
                  />

                  <div className=" w-[25%]">
                    <h1 className=" font-extrabold text-[#379E37] mb-4 text-sm">
                      Task / Reminder
                    </h1>
                    <div className=" h-[300px] w-full overflow-scroll bg-[#D7ECD7] rounded-md"></div>
                  </div>
                </div>
                <div className=" w-full overflow-scroll h-[150px]">
                  <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
                    <div className=" flex items-center justify-center">
                      <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
                      <div>
                        <h1 className=" p-0 m-0 font-semibold text-lg">
                          New Payment
                        </h1>
                        <p className=" text-xs p-0 m-0">
                          Adepoju Raphael paid 1,100 for Tailoring ...
                        </p>
                      </div>
                    </div>

                    <h1 className=" font-thin text-xs">Just Now</h1>
                  </div>

                  <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
                    <div className=" flex items-center justify-center">
                      <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
                      <div>
                        <h1 className=" p-0 m-0 font-semibold text-lg">
                          New Payment
                        </h1>
                        <p className=" text-xs p-0 m-0">
                          Adepoju Raphael paid 1,100 for Tailoring ...
                        </p>
                      </div>
                    </div>

                    <h1 className=" font-thin text-xs">Just Now</h1>
                  </div>

                  <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
                    <div className=" flex items-center justify-center">
                      <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
                      <div>
                        <h1 className=" p-0 m-0 font-semibold text-lg">
                          New Payment
                        </h1>
                        <p className=" text-xs p-0 m-0">
                          Adepoju Raphael paid 1,100 for Tailoring ...
                        </p>
                      </div>
                    </div>

                    <h1 className=" font-thin text-xs">Just Now</h1>
                  </div>

                  <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
                    <div className=" flex items-center justify-center">
                      <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
                      <div>
                        <h1 className=" p-0 m-0 font-semibold text-lg">
                          New Payment
                        </h1>
                        <p className=" text-xs p-0 m-0">
                          Adepoju Raphael paid 1,100 for Tailoring ...
                        </p>
                      </div>
                    </div>

                    <h1 className=" font-thin text-xs">Just Now</h1>
                  </div>

                  <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
                    <div className=" flex items-center justify-center">
                      <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
                      <div>
                        <h1 className=" p-0 m-0 font-semibold text-lg">
                          New Payment
                        </h1>
                        <p className=" text-xs p-0 m-0">
                          Adepoju Raphael paid 1,100 for Tailoring ...
                        </p>
                      </div>
                    </div>

                    <h1 className=" font-thin text-xs">Just Now</h1>
                  </div>

                  <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
                    <div className=" flex items-center justify-center">
                      <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
                      <div>
                        <h1 className=" p-0 m-0 font-semibold text-lg">
                          New Payment
                        </h1>
                        <p className=" text-xs p-0 m-0">
                          Adepoju Raphael paid 1,100 for Tailoring ...
                        </p>
                      </div>
                    </div>

                    <h1 className=" font-thin text-xs">Just Now</h1>
                  </div>

                  <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
                    <div className=" flex items-center justify-center">
                      <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
                      <div>
                        <h1 className=" p-0 m-0 font-semibold text-lg">
                          New Payment
                        </h1>
                        <p className=" text-xs p-0 m-0">
                          Adepoju Raphael paid 1,100 for Tailoring ...
                        </p>
                      </div>
                    </div>

                    <h1 className=" font-thin text-xs">Just Now</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br /><br /><br />
          <h1 className=" font-extrabold text-[#379E37] mb-4">Recent Payments</h1>
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
      </FadeInFromBottom>
    </Protected>
  );
};
