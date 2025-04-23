"use client";
import { useCreateGroup } from "@/hooks/mutations/useCreategroup";
import { useFetchSkills } from "@/hooks/queries/useFetchSkills";
import { useFetchStudents } from "@/hooks/queries/useFetchStudents";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface CreateGroupModalProps {
  setIsCreateGroupModalOpen: (isOpen: boolean) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  setIsCreateGroupModalOpen,
}) => {
  const { mutate, isPending } = useCreateGroup();
  const [groupInfo, setGroupInfo] = useState({
    skill_id: "",
  });

  console.log({ groupInfo });

  const { data: skills, isLoading: isFetchingSkills } = useFetchSkills();

  console.log({ skills });

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
          skill_id: "",
          force: false,
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
              Select skill:
            </label>
            <select
              name=""
              id=""
              onChange={(e) =>
                setGroupInfo({
                  ...groupInfo,
                  skill_id: e.target.value,
                })
              }
            >
              <option value="">Select skill</option>
              {skills?.data?.map((skill) => (
                <option key={skill?.id} value={skill?.id}>
                  {skill?.title}
                </option>
              ))}
            </select>
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
