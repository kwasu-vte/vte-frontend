import React from "react";
interface StudentDetailsModalProps {
  setIsStudentDeatilsModalOpen: (isOpen: boolean) => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  setIsStudentDeatilsModalOpen,
}) => {
  return (
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080] max-h-[100vh]"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsStudentDeatilsModalOpen(false);
      }}
    >
      <div className=" w-[25%] bg-[#D7ECD7] p-5">
        <h1 className=" text-4xl text-green-600 mb-4">Student Details</h1>

        <h1 className=" mb-1">First Name:</h1>
        <h1 className=" text-green-600 text-xl mb-4">Pelumi</h1>

        <h1 className=" mb-1">Last Name:</h1>
        <h1 className=" text-green-600 text-xl mb-4">Olusanmi</h1>

        <h1 className=" mb-1">Assigned Group:</h1>
        <h1 className=" text-green-600 text-xl mb-4">Group A</h1>

        <h1 className=" mb-1">Assigned Staff:</h1>
        <h1 className=" text-green-600 text-xl mb-4">Luqman Lawal</h1>

        <h1 className=" mb-1">Matric Number:</h1>
        <h1 className=" text-green-600 text-xl mb-4">22/47ED/2222</h1>

        <h1 className=" mb-1">Department:</h1>
        <h1 className=" text-green-600 text-xl mb-4">Electrical Engineering</h1>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
