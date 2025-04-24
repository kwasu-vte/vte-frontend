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
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";

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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CreateStaffModal from "./createStaff";
import data from "@/helpers/demodata";
import DeleteModal from "../modals/DeleteModal";
import EditStaffModal from "../modals/EditStaffModal";
import { useFetchMentors } from "@/hooks/queries/useFetchMentors";
import { Mentor } from "@/lib/queries/getMentors";
import useAuth from "@/lib/useAuth";
import { useFetchAdminDetails } from "@/hooks/queries/useFetchAdminDetails";
import { useRouter } from "next/navigation";

const Page = () => {
  // const { loading, user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Mentor | null>(null);
  const router = useRouter();

  const { userDetails, mounted, isLoggedIn } = useAuth();
  const id = userDetails?.id;

  if (mounted && isLoggedIn === false) {
    router.push("/auth/sign_in");
  }

  const { data, isLoading, error } = useFetchAdminDetails(id ?? "");
  console.log({ data });

  const { first_name, last_name, username, email, role } = data || {};

  // if (!loading && user) {
  //   lastName = user.last_name;
  //   firstName = user.first_name;
  // }

  let d = new Date();
  let currentDate = d.toDateString();

  const { data: mentors, isLoading: isFetchingMentors } = useFetchMentors();

  console.log({ mentors });

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
              Staff Management
            </h1>
          </div>

          <div className=" w-full h-[80vh] bg-white p-4 rounded-lg">
            <div className=" flex items-center justify-between">
              <button
                onClick={onOpen}
                className="bg-green-600 hover:border-[2px] hover:border-green-600 hover:bg-transparent hover:text-green-600 duration-500 text-white rounded-md p-2 px-4"
              >
                + Create New Staff
              </button>
              <div className=" flex items-center justify-center bg-white p-2 rounded-md">
                <CalendarMonth className=" text-[#379E37]" />
                <select name="" id="" className=" mx-4 appearance-none">
                  <option value="">{currentDate}</option>
                </select>
              </div>
            </div>
            <div className="mt-2 h-[90%] w-full overflow-scroll">
              <Table>
                <TableHeader className=" bg-[#BFE7BF7A]">
                  <TableRow>
                    <TableHead className=" text-black">S/N</TableHead>
                    <TableHead className=" text-black">Full Name</TableHead>
                    <TableHead className=" text-black">Staff Email</TableHead>
                    <TableHead className=" text-black">
                      Assigned Group
                    </TableHead>
                    <TableHead className=" text-right text-black">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentors?.data?.map((staff, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {`${staff?.id.slice(0, 6)}...`}
                      </TableCell>
                      <TableCell>
                        {staff?.first_name} {staff?.last_name}
                      </TableCell>
                      <TableCell>{staff?.email}</TableCell>
                      <TableCell>Group {staff?.group || ""}</TableCell>
                      <TableCell>
                        <div className=" flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
                              setIsEditStaffModalOpen(true);
                            }}
                            className=" mx-2"
                          >
                            <EditOutlinedIcon className=" text-yellow-500 hover:text-yellow-300 duration-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
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
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </FadeInFromBottom>
      {isDeleteModal && (
        <DeleteModal
          setIsDeleteModal={setIsDeleteModal}
          deleteType={"staff"}
          selectedStaff={selectedStaff}
        />
      )}
      {isEditStaffModalOpen && (
        <EditStaffModal
          setIsEditStaffModalOpen={setIsEditStaffModalOpen}
          selectedStaff={selectedStaff}
        />
      )}
      <CreateStaffModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </Protected>
  );
};

export default Page;
