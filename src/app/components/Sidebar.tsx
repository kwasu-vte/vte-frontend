"use client";
import React, { useEffect, useState } from "react";
import logo from "../../assets/kwasulogo.png";
import Image from "next/image";
import Link from "next/link";
import {
  Book,
  CalendarMonth,
  HomeRounded,
  LogoutRounded,
  Settings,
  WalletRounded,
} from "@mui/icons-material";
import customer from "@/assets/customerSupport.png";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { Logout } from "@/lib/utils";
import QRCodeModal from "../modals/QRCodeModal";
import { FadeInFromBottom } from "./FadeInFromBottom";
import { FadeInFromLeft } from "./FadeInFromLeft";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import StudentQRCode from "../modals/StudentQRCode";
import { MenuIcon } from "lucide-react";

const Sidebar = () => {
  // const { logout } = useAuth();
  const [IsQRcodeModalOpen, setIsQRcodeModalOpen] = useState(false);
  const currentPath = usePathname();
  const [buttonActive, setButtonActive] = useState(false);

  return (
    <>
      <div className=" hidden lg:block z-50 fixed h-[100vh] py-2 w-[18%]">
        <FadeInFromLeft>
          <div className=" h-full w-full bg-gradient-to-t from-[#133813] to-[#379E37] mx-2 rounded-md flex flex-col items-center justify-between pb-10">
            <div className=" w-full">
              <Image
                src={logo}
                // height={200}
                // width={200}
                alt=""
                className=" m-auto w-[50%] my-[30px]"
              />
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

                <Link href="/courses">
                  <div
                    className={
                      currentPath === "/courses"
                        ? "flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                        : "flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                    }
                  >
                    <Book className=" mx-2" />
                    Course
                  </div>
                </Link>

                <button
                  className=" w-full"
                  onClick={() => {
                    setIsQRcodeModalOpen(true);
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
                    <CalendarMonth className=" mx-2" />
                    Attendance
                  </div>
                </button>

                {/* <Link href="/payment" onClick={() => setCurrentPath('/payment')}>
                            <div
                                className={
                                    currentPath === '/payment'
                                        ? 'flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                        : 'flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2'
                                }
                            >
                                <WalletRounded className=' mx-2' />
                                Payment
                            </div>
                        </Link> */}

                <Link href="/settings">
                  <div
                    className={
                      currentPath === "/settings"
                        ? "flex items-center justify-start w-[80%] px-2 duration-500 text-[#379E37] bg-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                        : "flex items-center justify-start w-[80%] px-2 duration-500 text-white font-bold hover:text-[#379E37] rounded-md m-auto hover:bg-white mb-4 text-left py-2"
                    }
                  >
                    <Settings className=" mx-2" />
                    Settings
                  </div>
                </Link>
              </div>
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
          </div>
        </FadeInFromLeft>

        {IsQRcodeModalOpen && (
          <StudentQRCode
            setIsStudentQRCodeOpen={setIsQRcodeModalOpen}
            setButtonActive={setButtonActive}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
