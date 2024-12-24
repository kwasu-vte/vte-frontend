// "use client";
// import React from "react";
// import {
//   CalendarMonth,
//   CalendarViewDayRounded,
//   HeartBrokenSharp,
//   Notifications,
//   Search,
// } from "@mui/icons-material";
// import group from "@/assets/Group.png";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Table,
//   TableBody,
//   // TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import barchart from "@/assets/BarLineChart.png";
// import "@/app/Calendar.css";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { FadeInFromBottom } from "../components/FadeInFromBottom";

// import { Protected } from "@/components/protected";
// import { useAuth } from "@/lib/auth";
// import Typewriter from "../components/Typewriter";
// import data from "@/helpers/demodata";

// export default function Page() {
//   const { user, loading } = useAuth();


//   var lastName = "";
//   var firstName = "";

//   if (!loading) {
//     lastName = user.last_name;
//     firstName = user.first_name;
//   }

//   return (
//     <Protected>
//       <FadeInFromBottom>
//         <div className=" w-full h-[100vh] overflow-scroll pl-[20%] py-2 pr-4">
//           <div className=" h-[60px] w-full bg-white rounded-md flex items-center justify-between p-2 mb-4">
//             <div className=" bg-[#BFE7BF7A] h-full w-[30%] px-3">
//               <Search />
//               <input
//                 type="text"
//                 className=" h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm"
//                 placeholder="Search here..."
//               />
//             </div>
//             <div className=" flex items-center justify-center">
//               <Link href={"/studentPages/notifications/"}>
//                 <Notifications className=" text-[#379E37] mx-4" />
//               </Link>
//               <div className=" h-[50px] w-[50px] bg-green-700  profile rounded-full mx-1"></div>
//               <div className=" mx-1 h-full flex flex-col items-start justify-center">
//                 <h1 className=" font-bold text-lg">
//                   {lastName} {firstName}
//                 </h1>
//                 <p className=" uppercase text-[#379E37] text-xs font-bold">
//                   Admin
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className=" w-full bg-transparent flex items-start justify-between p-2 mb-2 border-b-2 border-b-[#7ABE7A]">
//             <div>
//               <h1 className=" text-4xl font-extrabold text-[#379E37] mb-2 flex">
//                 W<Typewriter text={`elcome back ${firstName} ${lastName}!`} speed={100} />👋🏽
//               </h1>
//             </div>
//             <div className=" flex items-center justify-center bg-white p-2 rounded-md">
//               <CalendarMonth className=" text-[#379E37]" />
//               <select name="" id="" className=" mx-4 appearance-none">
//                 <option value="">August 16, 2024</option>
//               </select>
//             </div>
//           </div>

//           <div className=" h-[70vh] mb-4 w-full flex items-start justify-between">
//             <div className=" w-[45%] flex flex-col items-start justify-start ">
//               <div className=" border-b-2 border-b-[#7ABE7A] w-full mb-8 pb-8">
//                 <h1 className=" font-extrabold text-[#379E37] mb-4">Overview</h1>
//                 <div className=" w-full flex items-center justify-between mb-4">
//                   <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
//                     <Image src={group} width={50} alt="" height={30} />
//                     <div className=" text-center w-[80%] flex flex-col items-center justify-center">
//                       <h3 className=" text-sm font-semibold">Total Students</h3>
//                       <h1 className=" font-extrabold text-4xl">{data.users.student.length}</h1>
//                     </div>
//                   </div>

//                   <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
//                     <Image src={group} width={50} alt="" height={30} />
//                     <div className=" text-center w-[80%] flex flex-col items-center justify-center">
//                       <h3 className=" text-sm font-semibold">Total Staff</h3>
//                       <h1 className=" font-extrabold text-4xl">{data.users.staff.length}</h1>
//                     </div>
//                   </div>
//                 </div>
//                 <div className=" w-full flex items-center justify-between">
//                   <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
//                     <Image src={group} width={50} alt="" height={30} />
//                     <div className=" text-center w-[80%] flex flex-col items-center justify-center">
//                       <h3 className=" text-sm font-semibold">Courses</h3>
//                       <h1 className=" font-extrabold text-4xl">{data.courses.length}</h1>
//                     </div>
//                   </div>

//                   <div className=" bg-white flex items-center justify-between rounded-md py-2 px-6 w-[45%] hover:border-[4px] hover:border-[#379E37] border-[4px] border-white duration-500 cursor-pointer">
//                     <Image src={group} width={50} alt="" height={30} />
//                     <div className=" text-center w-[80%] flex flex-col items-center justify-center">
//                       <h3 className=" text-sm font-semibold">Groups</h3>
//                       <h1 className=" font-extrabold text-4xl">{data.assignments.grouped.length}</h1>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className=" w-full bg-white min-h-[200px] rounded-md shadow-sm shadow-slate-500 px-2 py-4 hover:px-1 hover:py-1 duration-500">
//                 <h1 className=" font-extrabold text-black mb-4">
//                   Task completion / Performance
//                 </h1>
//                 <Image
//                   src={barchart}
//                   height={300}
//                   width={800}
//                   alt=""
//                   className=" my-4 max-w-[90%] m-auto"
//                 />
//               </div>
//             </div>
//             <div className=" w-[50%] h-full">
//               <h1 className=" font-extrabold text-[#379E37] mb-4">
//                 Calendar and Tasks
//               </h1>
//               <div className=" w-full bg-white p-3 rounded-lg">
//                 <div className=" w-full flex items-end justify-between bg-white rounded-lg mb-4">
//                   <FullCalendar
//                     plugins={[dayGridPlugin]}
//                     initialView="dayGridMonth"
//                     events={[
//                       { title: "Test", date: "2024-09-20" },
//                       { title: "Pract.", date: "2024-09-25" },
//                       { title: "Assgn.", date: "2024-10-02" },
//                     ]}
//                   />

//                   <div className=" w-[25%]">
//                     <h1 className=" font-extrabold text-[#379E37] mb-4 text-sm">
//                       Task / Reminder
//                     </h1>
//                     <div className=" h-[300px] w-full overflow-scroll bg-[#D7ECD7] rounded-md"></div>
//                   </div>
//                 </div>
//                 <div className=" w-full overflow-scroll h-[150px]">
//                   <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
//                     <div className=" flex items-center justify-center">
//                       <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
//                       <div>
//                         <h1 className=" p-0 m-0 font-semibold text-lg">
//                           New Payment
//                         </h1>
//                         <p className=" text-xs p-0 m-0">
//                           Adepoju Raphael paid 1,100 for Tailoring ...
//                         </p>
//                       </div>
//                     </div>

//                     <h1 className=" font-thin text-xs">Just Now</h1>
//                   </div>

//                   <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
//                     <div className=" flex items-center justify-center">
//                       <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
//                       <div>
//                         <h1 className=" p-0 m-0 font-semibold text-lg">
//                           New Payment
//                         </h1>
//                         <p className=" text-xs p-0 m-0">
//                           Adepoju Raphael paid 1,100 for Tailoring ...
//                         </p>
//                       </div>
//                     </div>

//                     <h1 className=" font-thin text-xs">Just Now</h1>
//                   </div>

//                   <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
//                     <div className=" flex items-center justify-center">
//                       <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
//                       <div>
//                         <h1 className=" p-0 m-0 font-semibold text-lg">
//                           New Payment
//                         </h1>
//                         <p className=" text-xs p-0 m-0">
//                           Adepoju Raphael paid 1,100 for Tailoring ...
//                         </p>
//                       </div>
//                     </div>

//                     <h1 className=" font-thin text-xs">Just Now</h1>
//                   </div>

//                   <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
//                     <div className=" flex items-center justify-center">
//                       <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
//                       <div>
//                         <h1 className=" p-0 m-0 font-semibold text-lg">
//                           New Payment
//                         </h1>
//                         <p className=" text-xs p-0 m-0">
//                           Adepoju Raphael paid 1,100 for Tailoring ...
//                         </p>
//                       </div>
//                     </div>

//                     <h1 className=" font-thin text-xs">Just Now</h1>
//                   </div>

//                   <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
//                     <div className=" flex items-center justify-center">
//                       <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
//                       <div>
//                         <h1 className=" p-0 m-0 font-semibold text-lg">
//                           New Payment
//                         </h1>
//                         <p className=" text-xs p-0 m-0">
//                           Adepoju Raphael paid 1,100 for Tailoring ...
//                         </p>
//                       </div>
//                     </div>

//                     <h1 className=" font-thin text-xs">Just Now</h1>
//                   </div>

//                   <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
//                     <div className=" flex items-center justify-center">
//                       <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
//                       <div>
//                         <h1 className=" p-0 m-0 font-semibold text-lg">
//                           New Payment
//                         </h1>
//                         <p className=" text-xs p-0 m-0">
//                           Adepoju Raphael paid 1,100 for Tailoring ...
//                         </p>
//                       </div>
//                     </div>

//                     <h1 className=" font-thin text-xs">Just Now</h1>
//                   </div>

//                   <div className=" cursor-pointer group hover:text-white duration-500 hover:bg-[#379E37] bg-[#D7D6FF4D] w-full rounded-md flex items-end justify-between  px-4 py-6 mb-4 shadow-sm shadow-slate-400">
//                     <div className=" flex items-center justify-center">
//                       <HeartBrokenSharp className=" text-[#379E37] mx-4 group-hover:text-white duration-500" />
//                       <div>
//                         <h1 className=" p-0 m-0 font-semibold text-lg">
//                           New Payment
//                         </h1>
//                         <p className=" text-xs p-0 m-0">
//                           Adepoju Raphael paid 1,100 for Tailoring ...
//                         </p>
//                       </div>
//                     </div>

//                     <h1 className=" font-thin text-xs">Just Now</h1>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <br /><br /><br />
//           <h1 className=" font-extrabold text-[#379E37] mb-4">Recent Payments</h1>
//           <div className=" h-[400px] w-full overflow-scroll rounded-md">
//             <Table className=" rounded-md bg-white h-[200px] overflow-y-scroll">
//               <TableHeader className="">
//                 <TableRow>
//                   <TableHead className="">S/N</TableHead>
//                   <TableHead className="">Course</TableHead>
//                   <TableHead className="">Task Title</TableHead>
//                   <TableHead className="">Description</TableHead>
//                   <TableHead>Time Status</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Score</TableHead>
//                   <TableHead className="text-right">Details</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </FadeInFromBottom>
//     </Protected>
//   );
// };

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

// export default function Page() {
//   const { user, loading } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   var lastName = "";
//   var firstName = "";

//   if (!loading) {
//     lastName = user.last_name;
//     firstName = user.first_name;
//   }

//   return (
//     <Protected>
//       <FadeInFromBottom>
//         {/* Sidebar Overlay */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
        
//         {/* Sidebar / Drawer */}
//         <div
//           className={`fixed inset-y-0 left-0 w-[70%] sm:w-[20%] bg-green-700 p-4 z-50 transform ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           } transition-transform duration-300`}
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-white text-xl font-bold">KWASU Dashboard</h1>
//             {/* Close Button for Sidebar on Mobile */}
//             <button
//               className="text-white sm:hidden"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ✕
//             </button>
//           </div>
//           <ul className="space-y-4 text-white">
//             <li>Dashboard</li>
//             <li>Staff Mgt.</li>
//             <li>Student Mgt.</li>
//             <li>Course Mgt.</li>
//             <li>Group Mgt.</li>
//             <li>Customer Support</li>
//             <li>Logout</li>
//           </ul>
//         </div>

//         {/* Main Content */}
//         <div className={`w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4 ${sidebarOpen ? "overflow-hidden" : ""}`}>
//           {/* Hamburger Icon */}
//           <div className="flex items-center justify-between sm:hidden bg-white p-4 rounded-md mb-4">
//             <button onClick={() => setSidebarOpen(!sidebarOpen)}>
//               <Menu className="text-[#379E37]" />
//             </button>
//             <div className="flex items-center">
//               <Link href={"/studentPages/notifications/"}>
//                 <Notifications className="text-[#379E37] mx-2" />
//               </Link>
//               <div className="h-[40px] w-[40px] bg-green-700 rounded-full"></div>
//             </div>
//           </div>

//           {/* Top Navigation Bar (for larger screens) */}
//           <div className="hidden sm:flex items-center justify-between bg-white rounded-md p-2 mb-4">
//             <div className="bg-[#BFE7BF7A] h-full w-[30%] px-3 flex items-center">
//               <Search />
//               <input
//                 type="text"
//                 className="h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm"
//                 placeholder="Search here..."
//               />
//             </div>
//             <div className="flex items-center">
//               <Link href={"/studentPages/notifications/"}>
//                 <Notifications className="text-[#379E37] mx-4" />
//               </Link>
//               <div className="h-[50px] w-[50px] bg-green-700 rounded-full"></div>
//               <div className="mx-2 flex flex-col items-start">
//                 <h1 className="font-bold text-lg">{lastName} {firstName}</h1>
//                 <p className="uppercase text-[#379E37] text-xs font-bold">Admin</p>
//               </div>
//             </div>
//           </div>

//           {/* Welcome Section */}
//           <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 mb-2 border-b-2 border-[#7ABE7A]">
//             <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 flex">
//               W<Typewriter text={`elcome back ${firstName} ${lastName}!`} speed={100} /> 👋🏽
//             </h1>
//             <div className="flex items-center bg-white p-2 rounded-md">
//               <CalendarMonth className="text-[#379E37]" />
//               <select className="mx-2 sm:mx-4 appearance-none">
//                 <option>August 16, 2024</option>
//               </select>
//             </div>
//           </div>

//           {/* Overview and Calendar */}
//           <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
//             {/* Overview Section */}
//             <div className="w-full sm:w-[45%] flex flex-col">
//               <div className="border-b-2 border-[#7ABE7A] mb-8 pb-8">
//                 <h1 className="font-extrabold text-[#379E37] mb-4">Overview</h1>
//                 <div className="grid grid-cols-2 gap-4 sm:flex sm:justify-between">
//                   {/* Card Components */}
//                   <div className="bg-white flex items-center p-4 rounded-md hover:border-[#379E37] duration-500 cursor-pointer">
//                     <Image src={group} width={40} alt="" height={30} />
//                     <div className="text-center w-full ml-4">
//                       <h3 className="text-sm font-semibold">Total Students</h3>
//                       <h1 className="font-extrabold text-2xl">{data.users.student.length}</h1>
//                     </div>
//                   </div>
//                   <div className="bg-white flex items-center p-4 rounded-md hover:border-[#379E37] duration-500 cursor-pointer">
//                     <Image src={group} width={40} alt="" height={30} />
//                     <div className="text-center w-full ml-4">
//                       <h3 className="text-sm font-semibold">Total Staff</h3>
//                       <h1 className="font-extrabold text-2xl">{data.users.staff.length}</h1>
//                     </div>
//                   </div>
//                   <div className="bg-white flex items-center p-4 rounded-md hover:border-[#379E37] duration-500 cursor-pointer">
//                     <Image src={group} width={40} alt="" height={30} />
//                     <div className="text-center w-full ml-4">
//                       <h3 className="text-sm font-semibold">Courses</h3>
//                       <h1 className="font-extrabold text-2xl">{data.courses.length}</h1>
//                     </div>
//                   </div>
//                   <div className="bg-white flex items-center p-4 rounded-md hover:border-[#379E37] duration-500 cursor-pointer">
//                     <Image src={group} width={40} alt="" height={30} />
//                     <div className="text-center w-full ml-4">
//                       <h3 className="text-sm font-semibold">Groups</h3>
//                       <h1 className="font-extrabold text-2xl">{data.assignments.grouped.length}</h1>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Performance Chart */}
//               <div className="bg-white rounded-md shadow-sm px-2 py-4">
//                 <h1 className="font-extrabold text-black mb-4">Task completion / Performance</h1>
//                 <Image src={barchart} height={250} width={350} alt="Performance chart" />
//               </div>
//             </div>

//             {/* Calendar and Tasks */}
//             <div className="w-full sm:w-[50%]">
//               <h1 className="font-extrabold text-[#379E37] mb-4">Calendar and Tasks</h1>
//               <div className="bg-white p-3 rounded-lg">
//                 <FullCalendar
//                   plugins={[dayGridPlugin]}
//                   initialView="dayGridMonth"
//                   events={[
//                     { title: "Test", date: "2024-09-20" },
//                     { title: "Pract.", date: "2024-09-25" },
//                     { title: "Assgn.", date: "2024-10-02" },
//                   ]}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Recent Payments Table */}
//           <h1 className="font-extrabold text-[#379E37] mb-4">Recent Payments</h1>
//           <div className="overflow-scroll rounded-md">
//             <Table className="rounded-md bg-white">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>S/N</TableHead>
//                   <TableHead>Course</TableHead>
//                   <TableHead>Task Title</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Time Status</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Score</TableHead>
//                   <TableHead className="text-right">Details</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell className="font-medium">1</TableCell>
//                   <TableCell>EDD</TableCell>
//                   <TableCell>Breeding Of Tilapia Fish</TableCell>
//                   <TableCell>Choose healthy an...</TableCell>
//                   <TableCell>Submission Open</TableCell>
//                   <TableCell>Not Submitted</TableCell>
//                   <TableCell>---</TableCell>
//                   <TableCell className="text-right">View</TableCell>
//                 </TableRow>
//                 {/* Add more rows as necessary */}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </FadeInFromBottom>
//     </Protected>
//   );
// };

//mobile view v1


export default function Page() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  var lastName = "";
  var firstName = "";

  if (!loading) {
    lastName = user.last_name;
    firstName = user.first_name;
  }

  return (
    <Protected>
      <FadeInFromBottom>
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar / Drawer */}
        <div
          className={`fixed inset-y-0 left-0 w-[70%] sm:w-[20%] bg-green-700 p-4 z-50 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-xl font-bold">KWASU Dashboard</h1>
            {/* Close Button for Sidebar on Mobile */}
            <button
              className="text-white sm:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
          <ul className="space-y-4 text-white">
            <li>Dashboard</li>
            <li>Staff Mgt.</li>
            <li>Student Mgt.</li>
            <li>Course Mgt.</li>
            <li>Group Mgt.</li>
            <li>Customer Support</li>
            <li>Logout</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4 ${sidebarOpen ? "overflow-hidden" : ""}`}>
          {/* Hamburger Icon for Mobile */}
          <div className="flex items-center justify-between sm:hidden bg-white p-4 rounded-md mb-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="text-[#379E37]" />
            </button>
            <div className="flex items-center">
              <Link href={"/studentPages/notifications/"}>
                <Notifications className="text-[#379E37] mx-2" />
              </Link>
              <div className="h-[40px] w-[40px] bg-green-700 rounded-full"></div>
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
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 flex">
              W<Typewriter text={`elcome back ${firstName} ${lastName}!`} speed={100} /> 👋🏽
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
              <div className="bg-white p-3 rounded-lg">
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
        </div>
      </FadeInFromBottom>
    </Protected>
  );
};
