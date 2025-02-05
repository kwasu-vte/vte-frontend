"use client";
import { useUpdateUser } from "@/hooks/mutations/useUpdateUser";
import { Student } from "@/lib/queries/getStudents";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditStudentModalProps {
  setIsEditStudentModalOpen: (isOpen: boolean) => void;
  selectedStudent: Student | null;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  setIsEditStudentModalOpen,
  selectedStudent,
}) => {
  const [staffStatus, setStaffStatus] = useState(false);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    // password: "",
    // password2: "",
    matric_number: "",
    level: "",
    first_name: "",
    last_name: "",
    role: "mentor",
  });

  console.log({ formData });

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        username: selectedStudent?.username || "",
        email: selectedStudent?.email || "",
        // password: selectedStaff?.password || "",
        // password2: selectedStaff?.password2 || "",
        first_name: selectedStudent?.first_name || "",
        last_name: selectedStudent?.last_name || "",
        matric_number: selectedStudent?.matric_number || "",
        level: selectedStudent?.level || "",
        role: "student",
      });
    }
  }, [selectedStudent]);

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
      password: formData.last_name,
      password2: formData.last_name,
    };
    updateUser(
      {
        userId: selectedStudent?.id || "",
        data: userData,
      },
      {
        onSuccess: () => {
          toast.success("Student updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });

          setIsEditStudentModalOpen(false);
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

          setIsEditStudentModalOpen(false);
        },
      }
    );
  };

  return (
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080] max-h-[100vh]"
      onClick={(e) => {
        setIsEditStudentModalOpen(false);
      }}
    >
      <div
        className="lg:w-[60%] bg-[#D7ECD7] rounded-2xl w-[95%] flex flex-col items-start justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-fit mb-4">
          <h1 className=" text-xl text-[#379E37]">Edit Student</h1>
          <div className=" h-[2px] bg-[#379E37] w-[30%]"></div>
        </div>
        <form className=" text-[#000] w-full" onSubmit={handleSubmit}>
          <div className=" mb-4">
            <label htmlFor="First name" className=" block">
              Student First name:
            </label>
            <input
              type="text"
              placeholder="Enter the student first name (e.g John)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="first_name"
              value={formData?.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="Last name" className=" block">
              Student Last name:
            </label>
            <input
              type="text"
              placeholder="Enter the student last name (e.g Doe)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="last_name"
              value={formData?.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="Email" className=" block">
              Student Email:
            </label>
            <input
              type="text"
              placeholder="Enter the student email (e.g doe@gmail.com)"
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
              onClick={() => setIsEditStudentModalOpen(false)}
              className=" bg-red-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    // course title
    // staff name
    // status
    // enrolled students
  );
};

export default EditStudentModal;
