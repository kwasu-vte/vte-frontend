"use client";
import { useCreateGroup } from "@/hooks/mutations/useCreategroup";
import { useFetchCourses } from "@/hooks/queries/useFetchCourses";
import { useFetchStudents } from "@/hooks/queries/useFetchStudents";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface CreateGroupModalProps {
  setIsCreateGroupModalOpen: (isOpen: boolean) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  setIsCreateGroupModalOpen,
}) => {
  const [staffStatus, setStaffStatus] = useState(false);
  const { data: students, isLoading: isFetchingStudents } = useFetchStudents();
  const { data: courses, isLoading: isFetchingCourses } = useFetchCourses();
  const { mutate, isPending } = useCreateGroup();
  const [groupInfo, setGroupInfo] = useState({
    name: "",
    end_date: "",
    course: "",
    members: [] as string[],
  });

  console.log({ groupInfo });

  const handleSelectStudent = (userId: string) => {
    setGroupInfo((prev) => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId],
    }));
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setGroupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    mutate(groupInfo, {
      onSuccess: (data) => {
        toast.success("Group created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        setGroupInfo({
          name: "",
          end_date: "",
          course: "",
          members: [] as string[],
        });

        setIsCreateGroupModalOpen(false);

        console.log({ data });
      },
      onError: (error: any) => {
        console.log({ error });

        toast.error(error?.response?.data?.detail || "Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      },
    });
  }

  return (
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080] max-h-[100vh]"
      onClick={(e) => {
        setIsCreateGroupModalOpen(false);
      }}
    >
      <div
        className="lg:w-[60%] bg-[#D7ECD7] rounded-2xl w-[95%] flex flex-col items-start justify-center px-[10px] py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-fit mb-4">
          <h1 className=" text-xl text-[#379E37]">Create New Group</h1>
          <div className=" h-[2px] bg-[#379E37] w-[30%]"></div>
        </div>
        <form onSubmit={handleSubmit} className=" text-[#000] w-full">
          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Group Title:
            </label>
            <input
              type="text"
              placeholder="Enter the group title"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="name"
              value={groupInfo.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="course" className="block">
              Select a Course:
            </label>

            <div className="relative">
              <select
                id="course"
                name="course"
                value={groupInfo.course}
                onChange={(e) =>
                  setGroupInfo({ ...groupInfo, course: e.target.value })
                }
                className="w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize max-h-[40px] h-[40px] overflow-hidden"
              >
                <option value="">Select a Course</option>
                {courses?.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                    className="truncate"
                  >
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Group End Date:
            </label>

            <input
              type="date"
              value={groupInfo.end_date}
              onChange={(e) =>
                setGroupInfo({ ...groupInfo, end_date: e.target.value })
              }
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Select Members
            </label>

            {isFetchingStudents ? (
              <p>Loading students...</p>
            ) : (
              <select
                multiple
                onChange={(e) => handleSelectStudent(e.target.value)}
                className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin"
              >
                {students?.map((student) => (
                  <option
                    key={student?.id}
                    value={student?.id}
                    className="mb-1"
                  >
                    {`${student?.last_name} ${student?.first_name} - ${student?.level}L`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Selected Members:</h3>
            <ul>
              {groupInfo.members.map((id) => {
                const student = students?.find((student) => student.id === id);
                return (
                  <li key={id} className="text-blue-600">
                    {student
                      ? `${student.last_name} ${student.first_name}`
                      : "Unknown User"}
                  </li>
                );
              })}
            </ul>
          </div>

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
              className=" bg-green-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white disabled:pointer-events-none"
              disabled={isPending}
            >
              {isPending ? "Creating Group..." : "Create Group"}
            </button>

            <button
              onClick={() => setIsCreateGroupModalOpen(false)}
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

export default CreateGroupModal;
