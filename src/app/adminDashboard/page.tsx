//attempt at making it responsive, above code is the original
"use client";
import React, { useState } from "react";
import {
  CalendarMonth,
  HeartBrokenSharp,
  Notifications,
  Menu,
  Search,
} from "@mui/icons-material";
import group from "@/assets/Group.png";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
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
import ResponsiveAdminSidebar from "../components/ResponsiveAdminSidebar";
import ActivitiesModal from "../modals/ActivitiesModal";

export default function Page() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isACtivitiesModalOpen, setIsActivitesModalOpen] = useState(false)
  const [autoAddStudents, setAutoAddStudents] = useState(false)

  var lastName = "";
  var firstName = "";

  if (!loading) {
    lastName = user.last_name;
    firstName = user.first_name;
  }

  return (
    <Protected>
      <FadeInFromBottom>
        {/* Main Content */}
        <div className={`w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4 ${sidebarOpen ? "overflow-hidden" : ""}`}>

          {
            !isACtivitiesModalOpen ?
              (
                <>
                  {/* Mobile header */}
                  <div className=" lg:hidden w-[100vw] h-[60px] px-3 flex items-center justify-between">
                    <ResponsiveAdminSidebar />

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
                            {/* <p className=" uppercase text-[#379E37] text-xs font-bold mr-4">
                      {level}LVL
                    </p> */}
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

                  {/* Top Navigation Bar (Visible on larger screens) */}
                  <div className="hidden sm:flex items-center justify-between bg-white rounded-md p-2 mb-4">
                    <div className="bg-[#BFE7BF7A] h-[50px] w-[30%] px-3 flex items-center">
                      <Search />
                      <input
                        type="text"
                        className="h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm"
                        placeholder="Search here..."
                      />
                    </div>
                    <div className="flex items-center">
                      <Link href={"/studentPages/notifications/"}>
                        <Notifications className="text-[#379E37] mx-4" />
                      </Link>
                      <div className="h-[50px] w-[50px] bg-green-700 rounded-full"></div>
                      <div className="mx-2 flex flex-col items-start">
                        <h1 className="font-bold text-lg text-[#379E37]">{lastName} {firstName}</h1>
                        <p className="uppercase text-[#379E37] text-xs font-bold">Admin</p>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Section */}
                  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 mb-2 border-b-2 border-[#7ABE7A]">
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 hidden lg:flex">
                      W<Typewriter text={`elcome back ${firstName} ${lastName}!`} speed={100} /> 👋🏽
                    </h1>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 lg:hidden flex">
                      Welcome back {firstName} {lastName}! 👋🏽
                    </h1>
                    <div className="flex items-center bg-white p-2 rounded-md">
                      <CalendarMonth className="text-[#379E37]" />
                      <select className="mx-2 sm:mx-4 appearance-none focus:outline-none">
                        <option>August 16, 2024</option>
                      </select>
                    </div>
                  </div>

                  {/* Overview and Calendar Section */}
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                    {/* Overview Section */}
                    <div className="w-full sm:w-[45%] flex flex-col">
                      <div className="border-b-2 border-[#7ABE7A] mb-8 pb-8">
                        <h1 className="font-extrabold text-[#379E37] mb-4">Overview</h1>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Card Components */}
                          {["Total Students", "Total Staff", "Courses", "Groups"].map((label, index) => (
                            <div key={index} className="bg-white flex items-center justify-between p-4 rounded-md hover:border-[#379E37] duration-500 cursor-pointer">
                              <Image src={group} width={55} alt="" height={30} />
                              <div className="text-center w-[70%] ml-4">
                                <h3 className="text-lg font-semibold">{label}</h3>
                                <h1 className="font-extrabold text-3xl">{index * 10 + 4}</h1> {/* Placeholder counts */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Chart */}
                      <div className="bg-white rounded-md shadow-sm px-2 py-4">
                        <h1 className="font-extrabold text-black mb-4">Task completion / Performance</h1>
                        <Image src={barchart} height={250} width={550} alt="Performance chart" />
                      </div>
                    </div>

                    {/* Calendar and Tasks */}
                    <div className="w-full sm:w-[50%]">
                      <h1 className="font-extrabold text-[#379E37] mb-4">Calendar and Tasks</h1>
                      <div onClick={() => setIsActivitesModalOpen(true)} className="bg-white p-3 rounded-lg">
                        <FullCalendar
                          plugins={[dayGridPlugin]}
                          initialView="dayGridMonth"
                          events={[{ title: "Test", date: "2024-09-20" }]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recent Payments Table */}
                  <h1 className="font-extrabold text-[#379E37] mb-4">Recent Payments</h1>
                  <div className="overflow-scroll rounded-md">
                    <Table className="rounded-md bg-white">
                      <TableHeader>
                        <TableRow>
                          <TableHead>S/N</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Task Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Time Status</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Sample Table Row */}
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
                </>
              )
              :
              (
                <>
                  {/* Mobile header */}
                  <div className=" lg:hidden w-[100vw] h-[60px] px-3 flex items-center justify-between">
                    <ResponsiveAdminSidebar />

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
                            {/* <p className=" uppercase text-[#379E37] text-xs font-bold mr-4">
                      {level}LVL
                    </p> */}
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

                  {/* Top Navigation Bar (Visible on larger screens) */}
                  <div className="hidden sm:flex items-center justify-between bg-white rounded-md p-2 mb-4">
                    <div className="bg-[#BFE7BF7A] h-[50px] w-[30%] px-3 flex items-center">
                      <Search />
                      <input
                        type="text"
                        className="h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm"
                        placeholder="Search here..."
                      />
                    </div>
                    <div className="flex items-center">
                      <Link href={"/studentPages/notifications/"}>
                        <Notifications className="text-[#379E37] mx-4" />
                      </Link>
                      <div className="h-[50px] w-[50px] bg-green-700 rounded-full"></div>
                      <div className="mx-2 flex flex-col items-start">
                        <h1 className="font-bold text-lg text-[#379E37]">{lastName} {firstName}</h1>
                        <p className="uppercase text-[#379E37] text-xs font-bold">Admin</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 mb-2 border-b-2 border-[#7ABE7A]">
                    <h1 className="text-2xl font-extrabold text-[#379E37] mb-2 sm:mb-0 flex">
                      <button className=" mr-2 font-extrabold" onClick={() => setIsActivitesModalOpen(false)}>Dashboard </button>  &gt;&gt; Calendar
                    </h1>
                    {/* <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 lg:hidden flex">
                      Welcome back {firstName} {lastName}! 👋🏽
                    </h1> */}
                    <div className="flex items-center bg-white p-2 rounded-md">
                      <CalendarMonth className="text-[#379E37]" />
                      <select className="mx-2 sm:mx-4 appearance-none focus:outline-none">
                        <option>August 16, 2024</option>
                      </select>
                    </div>
                  </div>

                  <div className=" w-full flex flex-col lg:flex-row items-center justify-between min-h-[90vh]">
                    <div className=" w-[49%] min-h-[95vh] flex flex-col items-start justify-between">
                      <div className=" w-full h-[44vh] bg-white rounded-lg">
                        <div className="w-full h-[60px] flex items-center justify-between px-3">
                          <h1 className=" text-[#379E37] font-bold text-xl">Daily Activites</h1>

                          <button className=" px-3 py-2 rounded-sm bg-[#379E37] text-white hover: bg-opacity-95 duration-500">Start Now</button>
                        </div>
                      </div>
                      <div className=" w-full h-[44vh] bg-white rounded-lg">
                        <div className="w-full h-[60px] flex items-center justify-between px-3">
                          <h1 className=" text-[#379E37] font-bold text-xl">Assign group to 300 level students</h1>

                          {/* <button className=" px-3 py-2 rounded-sm bg-[#379E37] text-white hover: bg-opacity-95 duration-500">Start Now</button> */}
                          <div
                            onClick={() => setAutoAddStudents(!autoAddStudents)}
                            className={`cursor-pointer w-[60px] h-[30px] rounded-full flex items-center px-2 ${autoAddStudents ? " justify-end bg-green-600" : " justify-start bg-slate-400"}`}
                          >
                            <div className={`${autoAddStudents ? "bg-white" : "bg-black"} h-[25px] w-[25px] rounded-full`}></div>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className=" w-[49%] min-h-[95vh] flex flex-col items-center justify-between">
                      <div className=" w-full min-h-[60vh] mb-6 bg-white rounded-lg">
                        <div className="w-full h-[60px] flex items-center justify-between px-3">
                          <h1 className=" text-[#379E37] font-bold text-xl">Limits</h1>
                        </div>
                        <form action="" className=" w-[90%] mx-auto">
                          <h1 className=" mb-2">Number of Practicals per day</h1>
                          <input
                            type="text"
                            className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                            placeholder="Enter the limit"
                          />

                          <h1 className=" mb-2">Number of Students in a group</h1>
                          <input
                            type="text"
                            className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                            placeholder="Enter the limit"
                          />

                          <h1 className=" mb-2">Number of Staffers in a group</h1>
                          <input
                            type="text"
                            className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                            placeholder="Enter the limit"
                          />

                          <h1 className=" mb-2">Number of Groups available for practical</h1>
                          <input
                            type="text"
                            className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                            placeholder="Enter the limit"
                          />

                          <button className=" px-3 py-2 rounded-sm bg-[#379E37] text-white hover: bg-opacity-95 duration-500">Save changes</button>
                        </form>
                      </div>
                      <div className=" w-full h-[38vh] bg-white rounded-lg">
                        <div className="w-full h-[60px] flex items-center justify-between px-3">
                          <h1 className=" text-[#379E37] font-bold text-xl">Available groups</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
          }
        </div>
      </FadeInFromBottom>
      {/* {
        isACtivitiesModalOpen && <ActivitiesModal setIsActivitesModalOpen={setIsActivitesModalOpen} />
      } */}
    </Protected>
  );
};
