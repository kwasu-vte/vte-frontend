"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import logo from "../../assets/kwasulogo.png";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import {
  Book,
  CloudDone,
  Group,
  HomeRounded,
  Layers,
  LogoutRounded,
  Person2,
  Settings,
  WalletRounded,
} from "@mui/icons-material";
import customer from "@/assets/customerSupport.png";
import ManagementModal from "../modals/ManagementModal";

const ResponsiveAdminSidebar = () => {
  // const { logout } = useAuth();
  let currentPath = usePathname();
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <MenuIcon className=" text-[#379E37]" />
        </SheetTrigger>
        <SheetContent className=" bg-gradient-to-t from-[#133813] to-[#379E37]">
          <SheetHeader>
            <SheetTitle>
              <Image src={logo} alt="" className=" m-auto w-[50%] my-[30px]" />
            </SheetTitle>
            <SheetDescription></SheetDescription>
            <div className=" w-full">
              <Link href="/">
                <div
                  className={
                    currentPath === "/"
                      ? "flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                      : "flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                  }
                >
                  <HomeRounded className="mx-2" />
                  Dashboard
                </div>
              </Link>

              <button
                className=" w-full"
                onClick={() => {
                  setIsManagementModalOpen(true);
                  setButtonActive(true);
                }}
              >
                <div
                  className={
                    buttonActive
                      ? "flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                      : "flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                  }
                >
                  <Person2 className=" mx-2" />
                  Management
                </div>
              </button>
              {/* <Link href="/staffManagement"> */}
              {/* <button>
                                <div
                                    className={
                                        currentPath === '/staffManagement'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <Person2 className=' mx-2' />
                                    Management
                                </div>
                            </button> */}
              {/* </Link> */}

              {/* <Link href="/studentManagement">
                                <div
                                    className={
                                        currentPath === '/studentManagement'
                                            ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                            : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                    }
                                >
                                    <Person2 className=' mx-2' />
                                    Student Mgt.
                                </div>
                            </Link> */}

              <Link href="/adminRecord">
                <div
                  className={
                    currentPath === "/adminRecord"
                      ? "flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                      : "flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                  }
                >
                  <CloudDone className=" mx-2" />
                  Record
                </div>
              </Link>

              <Link href="/courseManagement">
                <div
                  className={
                    currentPath === "/courseManagement"
                      ? "flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                      : "flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                  }
                >
                  <Group className=" mx-2" />
                  Course Mgt.
                </div>
              </Link>

              <Link href="/groupManagement">
                <div
                  className={
                    currentPath === "/groupManagement"
                      ? "flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                      : "flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                  }
                >
                  <Group className=" mx-2" />
                  Group Mgt.
                </div>
              </Link>
            </div>

            <div className=" flex flex-col items-center justify-center">
              <Image src={customer} alt="" width={60} height={60} />
              <h1 className=" text-white mt-4">Customer Support</h1>
            </div>

            <Link href={"/"}>
              <button
                // onClick={logout}
                className=" bg-[#9BCE9B] text-[#0B200B] px-2 rounded-md py-1 hover:px-4 duration-500"
              >
                <LogoutRounded className=" mx-2" /> Logout
              </button>
            </Link>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      {isManagementModalOpen && (
        <ManagementModal
          setIsManagementModalOpen={setIsManagementModalOpen}
          setButtonActive={setButtonActive}
        />
      )}
    </div>
  );
};

export default ResponsiveAdminSidebar;
