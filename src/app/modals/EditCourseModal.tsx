"use client";
import { useUpdateCourse } from "@/hooks/mutations/useUpdateCourse";
import { Course } from "@/lib/queries/getCourses";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditCourseModalProps {
  setIsEditCourseModalOpen: (isOpen: boolean) => void;
  selectedCourse: Course | null;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  setIsEditCourseModalOpen,
  selectedCourse,
}) => {
  const [staffStatus, setStaffStatus] = useState(false);
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    department: "",
    price: "",
  });

  console.log({ formData });

  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        code: selectedCourse?.code || "",
        title: selectedCourse?.title || "",
        description: selectedCourse?.description || "",
        department: selectedCourse?.department || "",
        price: selectedCourse?.price || "",
      });
    }
  }, [selectedCourse]);

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

    updateCourse(
      {
        courseId: selectedCourse?.id || "",
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("Course updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });

          setIsEditCourseModalOpen(false);
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

          setIsEditCourseModalOpen(false);
        },
      }
    );
  };

  return (
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080] max-h-[100vh]"
      onClick={(e) => {
        setIsEditCourseModalOpen(false);
      }}
    >
      <div
        className="lg:w-[60%] bg-[#D7ECD7] rounded-2xl w-[95%] py-4 flex flex-col items-start justify-center px-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-fit mb-4">
          <h1 className=" text-xl text-[#379E37]">Edit Course</h1>
          <div className=" h-[2px] bg-[#379E37] w-[30%]"></div>
        </div>
        <form className=" text-[#000] w-full" onSubmit={handleSubmit}>
          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Course Title:
            </label>
            <input
              type="text"
              placeholder="Enter the course title (e.g EDD203)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="title"
              onChange={handleChange}
              value={formData.title}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Course Code:
            </label>
            <input
              type="text"
              placeholder="Enter the course title (e.g EDD203)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="code"
              onChange={handleChange}
              value={formData.code}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Course Description:
            </label>
            <input
              type="text"
              placeholder="Enter the course title (e.g EDD203)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Course Department:
            </label>
            <input
              type="text"
              placeholder="Enter the course title (e.g EDD203)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="department"
              onChange={handleChange}
              value={formData.department}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Course Price:
            </label>
            <input
              type="text"
              placeholder="Enter the course title (e.g EDD203)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="price"
              onChange={handleChange}
              value={formData.price}
            />
          </div>

          {/* <div className=" mb-4">
            <label htmlFor="" className=" block">
              Staff First name:
            </label>
            <input
              type="text"
              placeholder="Enter the staff first name (e.g John)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
            />
          </div> */}

          {/* <div className=" mb-4">
            <label htmlFor="" className=" block">
              Staff Last name:
            </label>
            <input
              type="text"
              placeholder="Enter the staff last name (e.g Doe)"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
            />
          </div> */}

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Status:
            </label>
            {/* <input
                            type="text"
                            placeholder='Enter your last name (e.g Doe)'
                            className=' w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize'
                        /> */}
            <div className=" flex items-center justify-start">
              <div
                onClick={() => setStaffStatus(!staffStatus)}
                className={`mr-[10px] w-[90px] cursor-pointer h-[40px] px-2 bg-white rounded-full items-center flex ${
                  staffStatus ? "justify-end" : " justify-start"
                }`}
              >
                <div
                  className={`${
                    !staffStatus ? "bg-red-500" : "bg-green-500"
                  } h-[35px] w-[35px] rounded-full`}
                ></div>
              </div>
              {staffStatus ? <h1>Active</h1> : <h1>Inactive</h1>}
            </div>
          </div>

          <div>
            <button
              className=" bg-green-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? "Loading..." : "Edit Course"}
            </button>

            <button
              onClick={() => setIsEditCourseModalOpen(false)}
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

export default EditCourseModal;
