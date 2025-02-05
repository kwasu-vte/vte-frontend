"use client";
import React, { useState } from "react";
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
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import { Protected } from "@/components/protected";
import AdminSidebar from "../components/AdminSidebar";

const level = "";
const groupName = "";
const groupNo = "40";
const groupWhatsappLink = "40";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteModal from "../modals/DeleteModal";
import EditStudentModal from "../modals/EditStudentModal";
import StudentDetailsModal from "../modals/StudentDetailsModal";
import { useFetchStudents } from "@/hooks/queries/useFetchStudents";
import { Student } from "@/lib/queries/getStudents";
import DeleteStudentModal from "../modals/DeleteStudentModal";
import useAuth from "@/lib/useAuth";
import { useFetchAdminDetails } from "@/hooks/queries/useFetchAdminDetails";

const Page = () => {
  const { userDetails } = useAuth();
  const id = userDetails?.id;

  const { data, isLoading, error } = useFetchAdminDetails(id ?? "");
  console.log({ data });

  const { first_name, last_name, username, email, role } = data || {};
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [isStudentDetailsModalOpen, setIsStudentDeatilsModalOpen] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  let d = new Date();
  let currentDate = d.toDateString();

  const { data: students, isLoading: isFetchingStudents } = useFetchStudents();
  console.log({ students });

  return (
    <Protected>
      <AdminSidebar />
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
              <div className=" h-[50px] w-[50px] bg-green-700 profile rounded-full mx-1"></div>
              <div className=" mx-1 h-full flex flex-col items-start justify-center">
                <h1 className=" font-bold text-lg">
                  {last_name} {first_name}
                </h1>
                <p className=" uppercase text-[#379E37] text-xs font-bold">
                  Admin
                </p>
              </div>
            </div>
          </div>

          <div>
            <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl">
              Student Management
            </h1>
          </div>

          <div className=" w-full h-[80vh] bg-white p-4 rounded-lg">
            <div className=" flex items-center justify-end">
              <div className=" flex items-center justify-center bg-white p-2 rounded-md">
                <CalendarMonth className=" text-[#379E37]" />
                <select name="" id="" className=" mx-4 appearance-none">
                  <option value="">{currentDate}</option>
                </select>
              </div>
            </div>
            <div className=" h-[90%] w-full overflow-scroll">
              <Table>
                <TableHeader className=" bg-[#BFE7BF7A]">
                  <TableRow>
                    <TableHead className=" text-black font-extrabold">
                      S/N
                    </TableHead>
                    <TableHead className=" text-black font-extrabold">
                      Full Name
                    </TableHead>
                    <TableHead className=" text-black font-extrabold">
                      Staff Number
                    </TableHead>
                    <TableHead className=" text-black font-extrabold">
                      Email
                    </TableHead>
                    <TableHead className=" text-black font-extrabold">
                      Assigned Group
                    </TableHead>
                    <TableHead className="text-right text-black font-extrabold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students?.map((student) => (
                    <TableRow
                      onClick={() => setIsStudentDeatilsModalOpen(true)}
                      key={student?.id}
                    >
                      <TableCell className="font-medium">
                        {`${student?.id.slice(0, 6)}...`}
                      </TableCell>
                      <TableCell>
                        {student?.first_name} {student?.last_name}
                      </TableCell>
                      <TableCell>{student?.matric_number}</TableCell>
                      <TableCell>{student?.email}</TableCell>
                      <TableCell>Group A</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEditStudentModalOpen(true);
                          }}
                          className=" mx-2"
                        >
                          <EditOutlinedIcon className=" text-yellow-500 hover:text-yellow-300 duration-500" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDeleteModal(true);
                          }}
                          className=" mx-2"
                        >
                          <DeleteOutlineOutlinedIcon className=" text-red-500 hover:text-red-300 duration-500" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </FadeInFromBottom>
      {isDeleteModal && (
        <DeleteStudentModal
          setIsDeleteModal={setIsDeleteModal}
          selectedStudent={selectedStudent}
        />
      )}
      {isEditStudentModalOpen && (
        <EditStudentModal
          setIsEditStudentModalOpen={setIsEditStudentModalOpen}
          selectedStudent={selectedStudent}
        />
      )}
      {/* {isStudentDetailsModalOpen && (
        <StudentDetailsModal
          setIsStudentDeatilsModalOpen={setIsStudentDeatilsModalOpen}
        />
      )} */}
    </Protected>
  );
};

export default Page;
