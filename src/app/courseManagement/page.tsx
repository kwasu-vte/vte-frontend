"use client";
import React, { useState } from "react";
import {
  CalendarMonth,
  CalendarViewDayRounded,
  EditCalendarOutlined,
  Notifications,
  Search,
} from "@mui/icons-material";
import Link from "next/link";
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import { Protected } from "@/components/protected";
import AdminSidebar from "../components/AdminSidebar";

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
import ResponsiveAdminSidebar from "../components/ResponsiveAdminSidebar";
import CreateCourseModal from "../modals/CreateCourseModal";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditCourseModal from "../modals/EditCourseModal";
import DeleteModal from "../modals/DeleteModal";
import { useCreateCourse } from "@/hooks/mutations/useCreateCourse";
import useAuth from "@/lib/useAuth";
import { useFetchAdminDetails } from "@/hooks/queries/useFetchAdminDetails";
import { useFetchCourses } from "@/hooks/queries/useFetchCourses";
import { Course } from "@/lib/queries/getCourses";
import DeleteCourseModal from "../modals/DeleteCourseModal";

const Page = () => {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { userDetails } = useAuth();
  const id = userDetails?.id;

  const { data, isLoading, error } = useFetchAdminDetails(id ?? "");
  console.log({ data });

  const { first_name, last_name, username, email, role } = data || {};

  let d = new Date();
  let currentDate = d.toDateString();

  const { data: courses, isLoading: isFetchingCourses } = useFetchCourses();

  console.log({ courses });

  return (
    <Protected>
      <AdminSidebar />
      <FadeInFromBottom>
        <div className=" w-full h-[100vh] overflow-scroll lg:pl-[20%] px-3 lg:px-0 py-2 pr-4">
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
              <Link href={"/studentPages/notifications/"}>
                <Notifications className=" text-[#379E37] mx-4" />
              </Link>
              <div className=" h-[50px] w-[50px] bg-green-700 profile rounded-full mx-1"></div>
              <div className=" mx-1 h-full flex flex-col items-start justify-center">
                <h1 className=" font-bold text-lg">
                  {last_name} {first_name}
                </h1>
                {/* <p className=" uppercase text-[#379E37] text-xs font-bold">
                  200LVL
                </p> */}
              </div>
            </div>
          </div>

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
                      {level}
                      LVL
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

          <div>
            <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl">
              Course Management
            </h1>
          </div>

          <div className=" w-full h-[80vh] bg-white p-4 rounded-lg">
            <div className=" w-full flex items-center justify-end">
              <button
                onClick={() => setIsCreateCourseModalOpen(true)}
                className=" mx-6 hover:border hover:border-[#379e37] bg-[#379E37] px-3 py-2 rounded-lg text-white cursor-pointer hover:bg-white hover:text-[#379E37] duration-500"
              >
                + Add New Course
              </button>

              <div className=" flex items-center justify-center bg-white p-2 rounded-md">
                <CalendarMonth className=" text-[#379E37]" />
                <h1 className=" mx-4">{currentDate}</h1>
              </div>
            </div>
            <div className="mt-2 h-[90%] w-full overflow-scroll">
              <Table>
                <TableHeader className="">
                  <TableRow>
                    <TableHead className="">Course Title</TableHead>
                    <TableHead className="">Staff</TableHead>
                    <TableHead className="">Enrolled Students</TableHead>
                    <TableHead className="">Status</TableHead>
                    <TableHead className=" text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {
                                        data.users.staff.map((staff, index) => ( */}
                  {courses?.data?.map((course) => (
                    <TableRow key={course?.id}>
                      <TableCell className="font-medium">
                        {course?.title}
                      </TableCell>
                      <TableCell>Olusanmi Pelumi</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>
                        <div className=" flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsEditCourseModalOpen(true);
                            }}
                            className=" mx-2"
                          >
                            <EditOutlinedIcon className=" text-yellow-500 hover:text-yellow-300 duration-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsDeleteModal(true);
                            }}
                            className=" mx-2"
                          >
                            <DeleteOutlineOutlinedIcon className=" text-red-500 hover:text-red-300 duration-500" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* ))
                                    } */}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </FadeInFromBottom>
      {isCreateCourseModalOpen && (
        <CreateCourseModal
          setIsCreateCourseModalOpen={setIsCreateCourseModalOpen}
        />
      )}
      {isEditCourseModalOpen && (
        <EditCourseModal
          selectedCourse={selectedCourse}
          setIsEditCourseModalOpen={setIsEditCourseModalOpen}
        />
      )}
      {isDeleteModal && (
        <DeleteCourseModal
          selectedCourse={selectedCourse}
          setIsDeleteModal={setIsDeleteModal}
        />
      )}
    </Protected>
  );
};

export default Page;
