"use client";
import { useDeleteUser } from "@/hooks/mutations/useDeleteUser";
import { Mentor } from "@/lib/queries/getMentors";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface DeleteModalProps {
  setIsDeleteModal: (isOpen: boolean) => void;
  deleteType: String;
  selectedStaff: Mentor | null;
}
const DeleteModal: React.FC<DeleteModalProps> = ({
  setIsDeleteModal,
  deleteType,
  selectedStaff,
}) => {
  const { mutate, isPending } = useDeleteUser();

  

  const handleDelete = () => {
    mutate(selectedStaff?.id || "", {
      onSuccess: () => {
        toast.success("Staff deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        setIsDeleteModal(false);
      },
      onError: (error: any) => {
        console.log({ error });

        toast.error(error?.response?.data?.detail || "Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        setIsDeleteModal(false);
      },
    });
  };

  return (
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080] max-h-[100vh]"
      onClick={(e) => {
        setIsDeleteModal(false);
      }}
    >
      <div
        className=" h-fit py-5 lg:w-[40%] bg-[#D7ECD7] rounded-2xl w-[95%]  flex flex-col items-start justify-center px-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className=" mb-5">
          Are you sure you would like to DELETE this {deleteType}? <br /> This
          action cannot be undone
        </h1>
        <div>
          <button
            onClick={handleDelete}
            className=" p-3 bg-red-500 hover:bg-red-300 duration-500 cursor-pointer rounded-md text-white block lg:inline mr-5"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setIsDeleteModal(false)}
            className=" p-3 bg-white hover:bg-slate-200 duration-500 cursor-pointer rounded-md text-black block lg:inline mr-5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
