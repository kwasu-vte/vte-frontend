"use client";
import React, { useState } from "react";
import {
  CalendarMonth,
  CalendarViewDayRounded,
  Notifications,
  Search,
} from "@mui/icons-material";
import Link from "next/link";
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import { Protected } from "@/components/protected";
import AdminSidebar from "../components/AdminSidebar";
const lastName = "Ojuoye";
const firstName = "Moshood";
const level = "";
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
import CreateGroupModal from "../modals/CreateGroupModal";
import EditGroupModal from "../modals/EditGroupModal";
import useAuth from "@/lib/useAuth";
import { useFetchAdminDetails } from "@/hooks/queries/useFetchAdminDetails";
import { useFetchGroups } from "@/hooks/queries/useFetchGroups";
import { Group } from "@/lib/queries/getGroups";
import DeleteGroupModal from "../modals/DeleteGroupModal";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { userDetails, mounted, isLoggedIn } = useAuth();
  const id = userDetails?.id;
  const router = useRouter();

  if (mounted && isLoggedIn === false) {
    router.push("/auth/sign_in");
  }

  const { data, isLoading, error } = useFetchAdminDetails(id ?? "");
  console.log({ data });

  const { first_name, last_name, username, email, role } = data || {};

  let d = new Date();
  let currentDate = d.toDateString();

  const { data: groups, isLoading: isFetchingGroups } = useFetchGroups();

  console.log({groups});
  

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
                  {first_name} {last_name}
                </h1>
                <p className=" uppercase text-[#379E37] text-xs font-bold">
                  Admin
                </p>
              </div>
            </div>
          </div>

          <div>
            <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl">
              Group Management
            </h1>
          </div>

          <div className=" w-full h-[80vh] bg-white p-4 rounded-lg">
            <div className=" w-full flex items-center justify-end">
              <button
                onClick={() => setIsCreateGroupModalOpen(true)}
                className=" mx-6 hover:border hover:border-[#379e37] bg-[#379E37] px-3 py-2 rounded-lg text-white cursor-pointer hover:bg-white hover:text-[#379E37] duration-500"
              >
                + Add New Group
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
                    <TableHead className="">Group Title</TableHead>
                    <TableHead className="">Staff</TableHead>
                    <TableHead className="">Enrolled Students</TableHead>
                    <TableHead className="">Skill</TableHead>
                    <TableHead className=" text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {groups?.data?.map((group) => (
                    <TableRow key={group?.id}>
                      <TableCell className="font-medium">
                        {group?.name}
                      </TableCell>
                      <TableCell>{group?.primary_mentor?.first_name} {group?.primary_mentor?.last_name}</TableCell>
                      <TableCell>{group?.members?.length || "0"}</TableCell>
                      <TableCell>{group?.skil?.code}</TableCell>
                      <TableCell>
                        <div className=" flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedGroup(group);
                              setIsEditGroupModalOpen(true);
                            }}
                            className=" mx-2"
                          >
                            <EditOutlinedIcon className=" text-yellow-500 hover:text-yellow-300 duration-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedGroup(group);
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
      {isCreateGroupModalOpen && (
        <CreateGroupModal
          setIsCreateGroupModalOpen={setIsCreateGroupModalOpen}
        />
      )}
      {isEditGroupModalOpen && (
        <EditGroupModal
          setIsEditGroupModalOpen={setIsEditGroupModalOpen}
          selectedGroup={selectedGroup}
        />
      )}
      {isDeleteModal && (
        <DeleteGroupModal
          setIsDeleteModal={setIsDeleteModal}
          selectedGroup={selectedGroup}
        />
      )}
    </Protected>
  );
};

export default Page;
