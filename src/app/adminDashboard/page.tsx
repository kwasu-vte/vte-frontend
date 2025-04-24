//attempt at making it responsive, above code is the original
"use client";
import React, { useEffect, useState } from "react";
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
import useAuth from "@/lib/useAuth";
import Typewriter from "../components/Typewriter";
import data from "@/helpers/demodata";
import ResponsiveAdminSidebar from "../components/ResponsiveAdminSidebar";
import ActivitiesModal from "../modals/ActivitiesModal";
import { useFetchStudentDetails } from "@/hooks/queries/useFetchStudentDetails";
import { useFetchAdminDetails } from "@/hooks/queries/useFetchAdminDetails";
import { useFetchStudents } from "@/hooks/queries/useFetchStudents";
import AdminDashboardCard from "../components/AdminDashboardCard";
import { useFetchCourses } from "@/hooks/queries/useFetchCourses";
import { useFetchMentors } from "@/hooks/queries/useFetchMentors";
import { useFetchGroups } from "@/hooks/queries/useFetchGroups";
import { useCreateGroupSetting } from "@/hooks/mutations/useCreateGroupSetting";
import { toast } from "react-toastify";
import { useFetchGroupLimit } from "@/hooks/queries/useFetchGroupLimit";
import { useFetchSkills } from "@/hooks/queries/useFetchSkills";
import { useFetchAllPayments } from "@/hooks/queries/useFetchAllPayments";
import { formatDate } from "@fullcalendar/core/index.js";
import { useUpdateSkillSetting } from "@/hooks/mutations/useUpdateSkillSetting";
import { useFetchSkillSetting } from "@/hooks/queries/useFetchSkillSetting";

export default function Page() {
  const { userDetails } = useAuth();
  const id = userDetails?.id;

  const { data, isLoading, error } = useFetchAdminDetails(id ?? "");
  console.log({ data });

  const { first_name, last_name, username, email, role } = data?.data || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isACtivitiesModalOpen, setIsActivitesModalOpen] = useState(false);
  const [autoAddStudents, setAutoAddStudents] = useState(false);

  let d = new Date();
  let currentDate = d.toDateString();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (endDate && e.target.value > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (startDate && e.target.value < startDate) {
      alert("End date must be after start date");
    } else {
      setEndDate(e.target.value);
    }
  };

  const { data: students, isLoading: isFetchingStudents } = useFetchStudents();

  console.log({ students });

  const { data: courses, isLoading: isFetchingCourses } = useFetchCourses();
  const { data: skills, isLoading: isFetchingSkills } = useFetchSkills();
  const { data: mentors, isLoading: isFetchingMentors } = useFetchMentors();
  const { data: groups, isLoading: isFetchingGroups } = useFetchGroups();
  const { data: groupLimits, isLoading: isFetchingGroupLimits } =
    useFetchGroupLimit();
  const { data: skillSettingData, isLoading: isFetchingSkillSettingData } =
    useFetchSkillSetting();

  const lastGroupLimit = groupLimits?.data;
  const lastSkillSetting = skillSettingData?.data;

  console.log({ groupLimits });
  console.log({ skillSettingData });

  const { mutate, isPending } = useCreateGroupSetting();
  const { mutate: updateSkillSetting, isPending: isPendingUpdateSkillSetting } =
    useUpdateSkillSetting();

  const [groupSettingInfo, setGroupSettingInfo] = useState({
    practicals_per_day: 0,
    students_per_group: 0,
    staffers_per_group: 0,
    groups_per_day: 0,
    must_be_in_the_same_level: true,
  });

  console.log({ groupSettingInfo });

  const [skillSettingInfo, setSkillSettingInfo] = useState({
    max_skills_per_student: 0,
    allow_300_level_selection: true,
    enrollment_start_date: "",
    enrollment_end_date: "",
  });

  console.log({ skillSettingInfo });

  useEffect(() => {
    if (lastGroupLimit) {
      setGroupSettingInfo({
        practicals_per_day: lastGroupLimit?.practicals_per_day || 0,
        students_per_group: lastGroupLimit?.students_per_group || 0,
        staffers_per_group: lastGroupLimit?.staffers_per_group || 0,
        groups_per_day: lastGroupLimit?.groups_per_day || 0,
        must_be_in_the_same_level:
          lastGroupLimit?.must_be_in_the_same_level || true,
      });
    }
  }, [lastGroupLimit]);

  useEffect(() => {
    if (lastSkillSetting) {
      setSkillSettingInfo({
        max_skills_per_student: lastSkillSetting?.max_skills_per_student || 0,
        enrollment_start_date: lastSkillSetting?.enrollment_start_date || "",
        enrollment_end_date: lastSkillSetting?.enrollment_end_date || "",
        allow_300_level_selection:
          lastSkillSetting?.allow_300_level_selection || true,
      });
    }
  }, [lastSkillSetting]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setGroupSettingInfo((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  const handleSkillDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSkillSettingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleGroupLevel = () => {
    setGroupSettingInfo((prev) => ({
      ...prev,
      must_be_in_the_same_level: !prev.must_be_in_the_same_level,
    }));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formattedData = {
      practicals_per_day: Number(groupSettingInfo.practicals_per_day),
      students_per_group: Number(groupSettingInfo.students_per_group),
      staffers_per_group: Number(groupSettingInfo.staffers_per_group),
      groups_per_day: Number(groupSettingInfo.groups_per_day),
      must_be_in_the_same_level: true,
    };

    mutate(formattedData, {
      onSuccess: (data) => {
        toast.success("Group settings updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        setGroupSettingInfo({
          practicals_per_day: 0,
          students_per_group: 0,
          staffers_per_group: 0,
          groups_per_day: 0,
          must_be_in_the_same_level: true,
        });

        console.log({ data });
      },
      onError: (error: any) => {
        console.log({ error });

        toast.error(error?.response?.data?.detail || "Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      },
    });
  }

  const toggleSelection = () => {
    setSkillSettingInfo((prev) => ({
      ...prev,
      allow_300_level_selection: !prev.allow_300_level_selection,
    }));
  };

  const handleUpdateSkillSetting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedData = {
      max_skills_per_student: Number(skillSettingInfo.max_skills_per_student),
      allow_300_level_selection: true,
      enrollment_start_date: skillSettingInfo.enrollment_start_date,
      enrollment_end_date: skillSettingInfo.enrollment_end_date,
    };

    updateSkillSetting(formattedData, {
      onSuccess: () => {
        toast.success("Skill settings updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      },
      onError: (error: any) => {
        console.log({ error });

        toast.error(error?.response?.data?.detail || "Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      },
    });
  };

  const { data: payments, isLoading: isLoadingPayments } =
    useFetchAllPayments();

  console.log({ payments });

  return (
    <Protected>
      <FadeInFromBottom>
        {/* Main Content */}
        <div
          className={`w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4 ${
            sidebarOpen ? "overflow-hidden" : ""
          }`}
        >
          {!isACtivitiesModalOpen ? (
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
                        {last_name} {first_name}
                      </h1>
                      <div className="flex">
                        {/* <p className=" uppercase text-[#379E37] text-xs font-bold mr-4">
                      {level}LVL
                    </p> */}
                        <select
                          className="text-xs uppercase font-semibold  text-[#B7802C] border-none focus:outline-none"
                          name="course"
                          id="course"
                        >
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
                    <h1 className="font-bold text-lg text-[#379E37]">
                      {last_name} {first_name}
                    </h1>
                    <p className="uppercase text-[#379E37] text-xs font-bold">
                      Admin
                    </p>
                  </div>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 mb-2 border-b-2 border-[#7ABE7A]">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 hidden lg:flex">
                  W
                  <Typewriter
                    text={`elcome back ${first_name} ${last_name}!`}
                    speed={100}
                  />{" "}
                  👋🏽
                </h1>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 lg:hidden flex">
                  Welcome back
                  {first_name} {last_name}! 👋🏽
                </h1>
                <div className="flex items-center bg-white p-2 rounded-md">
                  <CalendarMonth className="text-[#379E37]" />
                  <select className="mx-2 sm:mx-4 appearance-none focus:outline-none">
                    <option>{currentDate}</option>
                  </select>
                </div>
              </div>

              {/* Overview and Calendar Section */}
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                {/* Overview Section */}
                <div className="w-full sm:w-[45%] flex flex-col">
                  <div className="border-b-2 border-[#7ABE7A] mb-8 pb-8">
                    <h1 className="font-extrabold text-[#379E37] mb-4">
                      Overview
                    </h1>
                    <div className="grid grid-cols-2 gap-4">
                      <AdminDashboardCard
                        title="Total Students"
                        image={group}
                        number={students?.data?.length || "0"}
                      />

                      <AdminDashboardCard
                        title="Total Mentors"
                        image={group}
                        number={mentors?.data?.length || "0"}
                      />

                      <AdminDashboardCard
                        title="Skills"
                        image={group}
                        number={skills?.data?.length || "0"}
                      />

                      <AdminDashboardCard
                        title="Groups"
                        image={group}
                        number={groups?.data?.length || "0"}
                      />
                      {/* Card Components */}
                      {/* {[
                        "Total Students",
                        "Total Staff",
                        "Courses",
                        "Groups",
                      ].map((label, index) => (
                        <div
                          key={index}
                          className="bg-white flex items-center justify-between p-4 rounded-md hover:border-[#379E37] duration-500 cursor-pointer"
                        >
                          <Image src={group} width={55} alt="" height={30} />
                          <div className="text-center w-[70%] ml-4">
                            <h3 className="text-lg font-semibold">{label}</h3>
                            <h1 className="font-extrabold text-3xl">
                              {index * 10 + 4}
                            </h1>{" "}
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-white rounded-md shadow-sm px-2 py-4">
                    <h1 className="font-extrabold text-black mb-4">
                      Task completion / Performance
                    </h1>
                    <Image
                      src={barchart}
                      height={250}
                      width={550}
                      alt="Performance chart"
                    />
                  </div>
                </div>

                {/* Calendar and Tasks */}
                <div className="w-full sm:w-[50%]">
                  <div>
                    <h1 className="font-extrabold text-[#379E37] mb-4">
                      Calendar and Tasks
                    </h1>
                    <div className="bg-white p-3 rounded-lg ">
                      <div onClick={() => setIsActivitesModalOpen(true)}>
                        <FullCalendar
                          plugins={[dayGridPlugin]}
                          initialView="dayGridMonth"
                          events={[{ title: "Test", date: "2024-09-20" }]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Payments Table */}
              <h1 className="font-extrabold text-[#379E37] mb-4">
                Recent Payments
              </h1>
              <div className="overflow-scroll rounded-md">
                <Table className="rounded-md bg-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead>S/N</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Task Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.data?.map((payment) => (
                      <TableRow key={payment?.id}>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>{payment?.reference}</TableCell>
                        <TableCell>{payment?.paystack_reference}</TableCell>
                        <TableCell>{payment?.reference}</TableCell>
                        <TableCell>{payment?.amount}</TableCell>
                        <TableCell>{payment?.status}</TableCell>
                        <TableCell>{formatDate(payment?.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
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
                        {last_name} {first_name}
                      </h1>
                      <div className="flex">
                        <select
                          className="text-xs uppercase font-semibold  text-[#B7802C] border-none focus:outline-none"
                          name="course"
                          id="course"
                        >
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
                    <h1 className="font-bold text-lg text-[#379E37]">
                      {last_name} {first_name}
                    </h1>
                    <p className="uppercase text-[#379E37] text-xs font-bold">
                      Admin
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 mb-2 border-b-2 border-[#7ABE7A]">
                <h1 className="text-2xl font-extrabold text-[#379E37] mb-2 sm:mb-0 flex">
                  <button
                    className=" mr-2 font-extrabold"
                    onClick={() => setIsActivitesModalOpen(false)}
                  >
                    Dashboard{" "}
                  </button>{" "}
                  &gt;&gt; Configuration
                </h1>
                {/* <h1 className="text-2xl sm:text-4xl font-extrabold text-[#379E37] mb-2 sm:mb-0 lg:hidden flex">
                      Welcome back {firstName} {lastName}! 👋🏽
                    </h1> */}
                <div className="flex items-center bg-white p-2 rounded-md">
                  <CalendarMonth className="text-[#379E37]" />
                  <select className="mx-2 sm:mx-4 appearance-none focus:outline-none">
                    <option>{currentDate}</option>
                  </select>
                </div>
              </div>

              <div className=" w-full flex flex-col lg:flex-row items-center justify-between min-h-[90vh]">
                {/* <div className=" w-[49%] min-h-[95vh] flex flex-col items-start justify-between">
                  <div className=" w-full h-[44vh] bg-white rounded-lg">
                    <div className="w-full h-[60px] flex items-center justify-between px-3">
                      <h1 className=" text-[#379E37] font-bold text-xl">
                        Daily Activites
                      </h1>

                      <button className=" px-3 py-2 rounded-sm bg-[#379E37] text-white hover: bg-opacity-95 duration-500">
                        Start Now
                      </button>
                    </div>
                  </div>
                  <div className=" w-full h-[44vh] bg-white rounded-lg">
                    <div className="w-full h-[60px] flex items-center justify-between px-3">
                      <h1 className=" text-[#379E37] font-bold text-xl">
                        Assign group to 300 level students
                      </h1>

                      <button className=" px-3 py-2 rounded-sm bg-[#379E37] text-white hover: bg-opacity-95 duration-500">
                        Start Now
                      </button>
                      <div
                        onClick={() => setAutoAddStudents(!autoAddStudents)}
                        className={`cursor-pointer w-[60px] h-[30px] rounded-full flex items-center px-2 ${
                          autoAddStudents
                            ? " justify-end bg-green-600"
                            : " justify-start bg-slate-400"
                        }`}
                      >
                        <div
                          className={`${
                            autoAddStudents ? "bg-white" : "bg-black"
                          } h-[25px] w-[25px] rounded-full`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="w-[49%] min-h-[95vh] flex flex-col items-start justify-between">
                  <div className=" w-full mb-6 bg-white rounded-lg pb-4">
                    <div className="w-full h-[60px] flex items-center justify-between px-3">
                      <h1 className=" text-[#379E37] font-bold text-xl">
                        Skill Settings
                      </h1>
                    </div>
                    <form
                      className=" w-[90%] mx-auto"
                      onSubmit={handleUpdateSkillSetting}
                    >
                      <h1 className=" mb-2">Number of Skills per student</h1>
                      <input
                        type="number"
                        className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                        placeholder="Enter the limit"
                        name="max_skills_per_student"
                        onChange={handleSkillDataChange}
                        value={skillSettingInfo.max_skills_per_student}
                        required
                      />

                      <h1 className=" mb-2">Enrollment Start Date</h1>
                      <input
                        type="date"
                        className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                        placeholder="Choose start date"
                        name="enrollment_start_date"
                        onChange={handleSkillDataChange}
                        value={skillSettingInfo.enrollment_start_date}
                        required
                      />

                      <h1 className=" mb-2">Enrollment End Date</h1>
                      <input
                        type="date"
                        className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                        placeholder="Choose end date"
                        name="enrollment_end_date"
                        onChange={handleSkillDataChange}
                        value={skillSettingInfo.enrollment_end_date}
                        required
                      />

                      <div className="flex items-center justify-between w-full sm:w-[400px] mb-3">
                        <div>
                          <h3 className="text-[#1D1D1D] font-semibold">
                            Skill selection access
                          </h3>
                          <span className="text-[#1D1D1D] text-sm">
                            Allow 300l to select skill
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleSelection}
                          className={`relative inline-flex items-center h-6 rounded-full w-10 transition-all border-[#C2CBCD] ${
                            skillSettingInfo.allow_300_level_selection
                              ? "bg-[#379E37]"
                              : "bg-[#585555]"
                          }`}
                        >
                          <span
                            className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
                              skillSettingInfo.allow_300_level_selection
                                ? "translate-x-5"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <button
                        className=" px-3 py-2 rounded-sm bg-[#379E37] text-white hover: bg-opacity-95 duration-500"
                        disabled={isPendingUpdateSkillSetting}
                      >
                        {isPendingUpdateSkillSetting
                          ? "Loading..."
                          : "Save changes"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className=" w-[49%] min-h-[95vh] flex flex-col items-center justify-between">
                  <div className=" w-full mb-6 bg-white rounded-lg pb-4">
                    <div className="w-full h-[60px] flex items-center justify-between px-3">
                      <h1 className=" text-[#379E37] font-bold text-xl">
                        Group Settings
                      </h1>
                    </div>
                    <form className=" w-[90%] mx-auto" onSubmit={handleSubmit}>
                      <h1 className=" mb-2">Number of Practicals per day</h1>
                      <input
                        type="number"
                        className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                        placeholder="Enter the limit"
                        name="practicals_per_day"
                        onChange={handleChange}
                        value={groupSettingInfo.practicals_per_day}
                        required
                      />

                      <h1 className=" mb-2">Number of Students in a group</h1>
                      <input
                        type="number"
                        className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                        placeholder="Enter the limit"
                        name="students_per_group"
                        onChange={handleChange}
                        value={groupSettingInfo.students_per_group}
                        required
                      />

                      <h1 className=" mb-2">Number of Staffers in a group</h1>
                      <input
                        type="number"
                        className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                        placeholder="Enter the limit"
                        name="staffers_per_group"
                        onChange={handleChange}
                        value={groupSettingInfo.staffers_per_group}
                        required
                      />

                      <h1 className=" mb-2">
                        Number of Groups available for practical
                      </h1>
                      <input
                        type="number"
                        className=" mb-4 w-full focus:outline-none border border-slate-700 p-2 rounded-md placeholder:text-slate-700"
                        placeholder="Enter the limit"
                        name="groups_per_day"
                        onChange={handleChange}
                        value={groupSettingInfo.groups_per_day}
                        required
                      />

                      <div className="flex items-center justify-between w-full sm:w-[400px] mb-3">
                        <div>
                          <h3 className="text-[#1D1D1D] font-semibold">
                            Group level
                          </h3>
                          <span className="text-[#1D1D1D] text-sm">
                            Students must be in same level
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleGroupLevel}
                          className={`relative inline-flex items-center h-6 rounded-full w-10 transition-all border-[#C2CBCD] ${
                            groupSettingInfo.must_be_in_the_same_level
                              ? "bg-[#379E37]"
                              : "bg-[#585555]"
                          }`}
                        >
                          <span
                            className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
                              groupSettingInfo.must_be_in_the_same_level
                                ? "translate-x-5"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <button
                        className=" px-3 py-2 rounded-sm bg-[#379E37] text-white hover: bg-opacity-95 duration-500"
                        disabled={isPending}
                      >
                        {isPending ? "Loading..." : "Save changes"}
                      </button>
                    </form>
                  </div>
                  <div className=" w-full h-[38vh] bg-white rounded-lg">
                    <div className="w-full selection:flex items-center justify-between px-3">
                      <h1 className="text-[#379E37] font-bold text-xl">
                        Available groups
                      </h1>
                    </div>
                    <ul className="p-3 h-[28vh] overflow-y-auto">
                      {groups?.data?.map((group) => (
                        <li key={group?.id}>{group?.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </FadeInFromBottom>
      {/* {
        isACtivitiesModalOpen && <ActivitiesModal setIsActivitesModalOpen={setIsActivitesModalOpen} />
      } */}
    </Protected>
  );
}
