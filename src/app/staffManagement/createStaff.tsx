"use client";
import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import Cookies from "js-cookie";

import { FadeInFromBottom } from "../components/FadeInFromBottom";
import { useCreateUser } from "@/hooks/mutations/useCreateUser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateStaffModal = ({ isOpen, onOpenChange }) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateUser();
  const [staffInfo, setStaffInfo] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    matric_number: "",
    level: "",
    role: "mentor",
  });

  console.log({ staffInfo });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setStaffInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit() {
    const userData = {
      ...staffInfo,
      username: staffInfo.first_name,
      password2: staffInfo.password,
    };

    mutate(userData, {
      onSuccess: (data) => {
        toast.success("Staff created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        setStaffInfo({
          username: "",
          email: "",
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
          matric_number: "",
          level: "",
          role: "",
        });

        console.log({ data });

        router.push("/staffManagement");
      },
      onError: (error: any) => {
        console.log({ error });

        toast.error(error?.response?.data?.detail || "Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        router.push("/staffManagement");
      },
    });
  }

  return (
    <FadeInFromBottom>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          backdrop: "bg-[#00000080] backdrop-opacity-40",
          base: "border-[#292f46] bg-[#D7ECD7]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader> */}
              <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl py-4 px-3">
                Create Staff
              </h1>
              {/* </ModalHeader> */}
              <ModalBody>
                {/* {message.error && (
                  <p className="text-[#ea3a3a] mb-4">{message.message}</p>
                )}
                {!message.error && message.message != "" && (
                  <p className="text-green-500 mb-4">{message.message}</p>
                )} */}
                <input
                  onChange={handleChange}
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  className="w-full p-2 mb-4 rounded-md"
                  value={staffInfo.first_name}
                  required
                />
                <input
                  onChange={handleChange}
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  className="w-full p-2 mb-4 rounded-md"
                  value={staffInfo.last_name}
                  required
                />
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 mb-4 rounded-md"
                  value={staffInfo.email}
                  required
                />
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 mb-4 rounded-md"
                  value={staffInfo.password}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <button
                  className="p-2 px-4 rounded-md hover:text-red-500 duration-500"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="bg-green-600 duration-500 hover:bg-green-500 text-white p-2 px-4 rounded-md"
                >
                  {isPending ? "Loading..." : "Submit"}
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </FadeInFromBottom>
  );
};

export default CreateStaffModal;
