"use client";
import { useUpdateCourse } from "@/hooks/mutations/useUpdateCourse";
import { useUpdateSkill } from "@/hooks/mutations/useUpdateSkill";
import { Course } from "@/lib/queries/getCourses";
import { Skill } from "@/lib/queries/getSkills";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditCourseModalProps {
  setIsEditCourseModalOpen: (isOpen: boolean) => void;
  selectedCourse: Skill | null;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  setIsEditCourseModalOpen,
  selectedCourse,
}) => {
  const [staffStatus, setStaffStatus] = useState(false);
  const { mutate: updateSkill, isPending: isUpdatingSkill } = useUpdateSkill();
  const [levelId, setLevelId] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    enrollment_deadline: "",
    price: "",
    available_level_ids: [] as string[],
    capacity: 0,
  });

  console.log({ formData });

  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        code: selectedCourse?.code || "",
        title: selectedCourse?.title || "",
        description: selectedCourse?.description || "",
        enrollment_deadline: selectedCourse?.enrollment_deadline || "",
        price: selectedCourse?.price || "",
        available_level_ids:
          selectedCourse.available_levels?.map((levelObj) => levelObj.level) ||
          [],
        capacity: selectedCourse?.capacity || 0,
      });
    }
  }, [selectedCourse]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleLevelIdAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = levelId.trim();

    if (id && !formData.available_level_ids.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        available_level_ids: [...prev.available_level_ids, id],
      }));
      setLevelId("");
    } else {
      toast.error("Please enter a valid unique ID.");
    }
  }

  function removeLevelId(id: string) {
    setFormData((prev) => ({
      ...prev,
      available_level_ids: prev.available_level_ids.filter(
        (level) => level !== id
      ),
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateSkill(
      {
        id: selectedCourse?.id || "",
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("Skill updated successfully!", {
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
          <h1 className=" text-xl text-[#379E37]">Edit Skill</h1>
          <div className=" h-[2px] bg-[#379E37] w-[30%]"></div>
        </div>
        <form className=" text-[#000] w-full" onSubmit={handleSubmit}>
          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Skill Title:
            </label>
            <input
              type="text"
              placeholder="Enter the skill title"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="title"
              onChange={handleChange}
              value={formData.title}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Skill Code:
            </label>
            <input
              type="text"
              placeholder="Enter the skill code"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="code"
              onChange={handleChange}
              value={formData.code}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Skill Description:
            </label>
            <input
              type="text"
              placeholder="Enter the skill description"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Enrollment Deadline:
            </label>
            <input
              type="date"
              placeholder="Enter enrollment deadline"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="enrollment_deadline"
              onChange={handleChange}
              value={formData.enrollment_deadline}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Capacity:
            </label>
            <input
              type="number"
              placeholder="Enter skill capacity"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="capacity"
              onChange={handleChange}
              value={formData.capacity}
            />
          </div>

          <div className=" mb-4">
            <label htmlFor="" className=" block">
              Skill Price:
            </label>
            <input
              type="text"
              placeholder="Enter the skill price"
              className=" w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize"
              name="price"
              onChange={handleChange}
              value={formData.price}
            />
          </div>

          <div className="mb-4">
            <label className="block">Available Levels:</label>
            <div className="flex gap-2">
              <input
                type="string"
                placeholder="Enter level ID"
                className="w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin"
                value={levelId}
                onChange={(e) => setLevelId(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 px-4 py-2 rounded-md text-white"
                onClick={handleLevelIdAdd}
              >
                Add
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {formData.available_level_ids.map((id) => (
                <div
                  key={id}
                  className="bg-[#379e37] text-white px-3 py-1 rounded-md cursor-pointer"
                  onClick={() => removeLevelId(id)}
                >
                  {id} ✕
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              className=" bg-green-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white"
              disabled={isUpdatingSkill}
            >
              {isUpdatingSkill ? "Loading..." : "Edit Skill"}
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
  );
};

export default EditCourseModal;
