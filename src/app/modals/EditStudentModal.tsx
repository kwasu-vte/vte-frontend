"use client"
import React, { useState } from 'react'
interface EditStudentModalProps {
    setIsEditStudentModalOpen: (isOpen: boolean) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ setIsEditStudentModalOpen }) => {
    const [staffStatus, setStaffStatus] = useState(false)
    return (
        <div
            className='fixed right-0 bottom-0 left-0 top-0 px-2 py4 overflow-scroll scrollbar-hide z-50 justify-center items-center flex bg-[#00000080] max-h-[100vh]'
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return
                }
                setIsEditStudentModalOpen(false);
            }}
        >
            <div className=' lg:h-[60%] lg:w-[60%] bg-[#D7ECD7] rounded-2xl w-[95%]  min-h-[60%] flex flex-col items-start justify-center px-[10px]'>
                <div className=' w-fit mb-4'>
                    <h1 className=' text-xl text-[#379E37]'>Edit Student</h1>
                    <div className=' h-[2px] bg-[#379E37] w-[30%]'></div>
                </div>
                <form action="" className=' text-[#000] w-full'>
                    <div className=' mb-4'>
                        <label htmlFor="" className=' block'>Staff Number:</label>
                        <input
                            type="text"
                            placeholder='Enter the staff number (e.g Kwas/Biol555)'
                            className=' w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize'
                        />
                    </div>

                    <div className=' mb-4'>
                        <label htmlFor="" className=' block'>Student First name:</label>
                        <input
                            type="text"
                            placeholder='Enter the student first name (e.g John)'
                            className=' w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize'
                        />
                    </div>

                    <div className=' mb-4'>
                        <label htmlFor="" className=' block'>Student Last name:</label>
                        <input
                            type="text"
                            placeholder='Enter the student last name (e.g Doe)'
                            className=' w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize'
                        />
                    </div>

                    <div className=' mb-4'>
                        <label htmlFor="" className=' block'>Assigned Group:</label>
                        {/* <input
                            type="text"
                            placeholder='Enter your last name (e.g Doe)'
                            className=' w-full bg-transparent focus:outline-none border-b border-b-[#379e37] text-[#379e37] placeholder:text-[#379e37] mt-2 placeholder:font-thin capitalize'
                        /> */}
                        {/* <div className=' flex items-center justify-start'>
                            <div
                                onClick={() => setStaffStatus(!staffStatus)}
                                className={`mr-[10px] w-[90px] cursor-pointer h-[40px] px-2 bg-white rounded-full items-center flex ${staffStatus ? "justify-end" : " justify-start"}`}>
                                <div className={`${!staffStatus ? "bg-red-500" : "bg-green-500"} h-[35px] w-[35px] rounded-full`}></div>
                            </div>
                            {
                                staffStatus ? <h1>Active</h1> : <h1>Inactive</h1>
                            }
                        </div> */}
                        <select name="" id="" className=' bg-transparent w-[65%] border border-[#379e37] px-3 rounded-md focus:outline-none'>
                            <option value="">Group A</option>
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={() => setIsEditStudentModalOpen(false)}
                            className=' bg-green-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white'
                        >
                            Save Changes
                        </button>

                        <button
                            onClick={() => setIsEditStudentModalOpen(false)}
                            className=' bg-red-500 p-2 rounded-md block lg:inline mr-4 hover:p-3 duration-500 text-white'
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
    )
}

export default EditStudentModal