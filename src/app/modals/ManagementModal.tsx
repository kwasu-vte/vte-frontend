import React from "react";
import QRCode from "@/assets/qrcode.png";
import Image from "next/image";
import { FadeInFromBottom } from "../components/FadeInFromBottom";
import QRCodeScanner from "../components/QRCodeScanner";
import Link from "next/link";

interface ManagementModalProps {
  setIsManagementModalOpen: (isOpen: boolean) => void;
  setButtonActive: (isOpen: boolean) => void;
}

const ManagementModal: React.FC<ManagementModalProps> = ({
  setIsManagementModalOpen,
  setButtonActive,
}) => {
  return (
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080]"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsManagementModalOpen(false);
        setButtonActive(false);
      }}
    >
      <div className=" w-[65%] h-[50%] bg-[#D7ECD7] flex items-center justify-center">
        <div className=" w-full h-full flex items-center justify-center">
          <FadeInFromBottom>
            <div className=" w-full flex flex-col items-center justify-center">
              <h1 className=" mb-4">What page are you trying to access ?</h1>
              <div className=" w-[45%] flex items-center justify-between">
                <Link
                  href={"/staffManagement"}
                  className=" w-[45%] bg-green-600 text-center py-2 rounded-md hover:bg-opacity-75 duration-300"
                >
                  Mentor Management
                </Link>
                <Link
                  href={"/studentManagement"}
                  className=" w-[45%] bg-green-600 text-center py-2 rounded-md hover:bg-opacity-75 duration-300"
                >
                  Student Management
                </Link>
              </div>
            </div>
            {/* <Image
                        src={QRCode}
                        alt="qr code"
                        width={200}
                    /> */}
            {/* <QRCodeScanner /> */}
          </FadeInFromBottom>
        </div>
      </div>
    </div>
  );
};

export default ManagementModal;
