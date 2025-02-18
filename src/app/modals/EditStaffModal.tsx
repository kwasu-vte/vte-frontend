"use client";

import { useUpdateUser } from "@/hooks/mutations/useUpdateUser";
import { Mentor } from "@/lib/queries/getMentors";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditStaffModalProps {
  setIsEditStaffModalOpen: (isOpen: boolean) => void;
  selectedStaff: Mentor | null;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({
  setIsEditStaffModalOpen,
  selectedStaff,
}) => {
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    // password: "",
    // password2: "",
    first_name: "",
    last_name: "",
    role: "mentor",
  });

  console.log({ formData });

  useEffect(() => {
    if (selectedStaff) {
      setFormData({
        username: selectedStaff?.username || "",
        email: selectedStaff?.email || "",
        // password: selectedStaff?.password || "",
        // password2: selectedStaff?.password2 || "",
        first_name: selectedStaff?.first_name || "",
        last_name: selectedStaff?.last_name || "",
        role: "mentor",
      });
    }
  }, [selectedStaff]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      ...formData,
      username: formData.first_name,
    };
    updateUser(
      {
        userId: selectedStaff?.id || "",
        data: userData,
      },
      {
        onSuccess: () => {
          toast.success("Staff updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });

          setIsEditStaffModalOpen(false);
        },
        onError: (error: any) => {
          console.log({ error });

          toast.error(
            error?.response?.data?.detail || "Something went wrong!",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
            }
          );

          setIsEditStaffModalOpen(false);
        },
      }
    );
  };

  return (
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080] max-h-[100vh]"
      onClick={() => {
        setIsEditStaffModalOpen(false);
      }}
    >
      <div
        className="lg:w-[60%] bg-[#D7ECD7] rounded-2xl w-[95%] flex flex-col items-start justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-fit mb-4">
          <h1 className=" text-xl text-[#379E37]">Edit Staff</h1>
          <div className=" h-[2px] bg-[#379E37] w-[30%]"></div>
        </div>
        <form className=" text-[#000] w-full" onSubmit={handleSubmit}>
          {/* <div className=" mb-4">
            <label htmlFor="" className=" block">
              Staff Number:
            </label>
            <input
              type="text"
              placeholder="Enter the staff number (e.g Kwas/Biol555)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
            />
          </div> */}

          <div className=" mb-4">
            <label htmlFor="First name" className=" block">
              Staff First name:
            </label>
            <input
              type="text"
              placeholder="Enter the staff first name (e.g John)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="first_name"
              value={formData?.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="Last name" className=" block">
              Staff Last name:
            </label>
            <input
              type="text"
              placeholder="Enter the staff last name (e.g Doe)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="last_name"
              value={formData?.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="Email" className=" block">
              Staff Email:
            </label>
            <input
              type="text"
              placeholder="Enter the staff email (e.g doe@gmail.com)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Assigned Group:
            </label>
            <select
              name=""
              id=""
              className=" bg-transparent w-[65%] border border-[#379e37] px-3 rounded-md focus:outline-none"
            >
              <option value="">Group A</option>
            </select>
          </div>

          <div>
            <button
              disabled={isUpdating}
              className=" bg-green-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white"
            >
              {isUpdating ? "Loading..." : "Save Changes"}
            </button>

            <button
              onClick={() => setIsEditStaffModalOpen(false)}
              className=" bg-red-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    
  );
};

export default EditStaffModal;
