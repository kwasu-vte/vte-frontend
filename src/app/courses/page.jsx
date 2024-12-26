"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { CalendarMonth, Notifications } from '@mui/icons-material'
import { Search } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import Cookies from 'js-cookie'
import clsx from 'clsx'

import { FadeInFromBottom } from '../components/FadeInFromBottom'

import { Protected } from '@/components/protected'
import Sidebar from '../components/Sidebar'
import { useAuth } from '@/lib/auth'
import { makePayment } from '@/lib/info'
import ResponsiveSidebar from '../components/ResponsiveSidebar';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '700'], // Specify the weights you want to use
});

export default function Page() {
    const { loading, user } = useAuth();
    const [selectionDetails, setSelectionDetails] = useState({
        "course_code": "",
        "course_specialization": "",
    });
    const [courses, setCourses] = React.useState([]);
    const [specializations, setSpecializations] = React.useState([]);

    useEffect(() => {
        const fetchCourse = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/courses/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
            });
            const data = await res.json();
            setCourses(data);
            console.log(data);
        }

        fetchCourse();
    }, [])

    let first_name, last_name, level;
    let currentDate = (new Date()).toDateString();

    if (!loading && user) {
        first_name = user.first_name;
        last_name = user.last_name;
        level = user.level;
    }

    function updateCourseCode(course) {
        updateCourseSpecialization("");
        if (course.specialization) {
            setSpecializations(course.specialization);
        } else {
            setSpecializations([]);
        }
        setSelectionDetails((prev) => {
            return ({
                ...prev,
                course_code: course.course,
            })
        })
    }

    function updateCourseSpecialization(course_specialization) {
        setSelectionDetails((prev) => {
            return ({
                ...prev,
                course_specialization,
            })
        })
    }

    return (
        <Protected>
            <Sidebar />
            <FadeInFromBottom>
                <div className={` w-full min-h-[100vh] lg:overflow-hidden px-2 lg:px-0 lg:pl-[20%] pb-5 py-2 lg:pr-4`}>
                    <div className=' h-[60px] w-full bg-transparent rounded-md hidden lg:flex items-center justify-between p-2 mb-4'>
                        <div className=' flex items-center justify-center bg-white p-2 rounded-md'>
                            <CalendarMonth className=' text-[#379E37]' />
                            <select name="" id="" className=' mx-4 appearance-none'>
                                <option value="">{currentDate}</option>
                            </select>
                        </div>
                        <div className=' flex items-center justify-center bg-white rounded-md py-2 px-3'>
                            <Link href={'/notifications/'}>
                                <Notifications className=' text-[#379E37] mx-4' />
                            </Link>
                            <div className=' h-[50px] w-[50px] bg-green-700 profile rounded-full mx-1'></div>
                            <div className=' mx-1 h-full flex flex-col items-start justify-center'>
                                <h1 className=' font-bold text-lg'>{first_name} {last_name}</h1>
                                <p className=' uppercase text-[#379E37] text-xs font-bold'>{level}LVL</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile header */}
                    <div className=" lg:hidden w-[100vw] h-[60px] px-3 flex items-center justify-between">
                        <ResponsiveSidebar />

                        <div className=" h-[90%] w-fit bg-white rounded-lg px-2">
                            <div className=" h-full flex items-center justify-center">
                                <div className=" mx-2 bg-[#BFE7BF7A] h-[40px] w-[40px] rounded-md flex items-center justify-center p-2 cursor-pointer">
                                    <Search />
                                </div>

                                <Link href={"/notifications/"}>
                                    <Notifications className=" text-[#379E37] mr-3" />
                                </Link>


                                <div className=" mx-1 h-full flex flex-col items-start justify-center min-w-[100px]">
                                    <h1 className=" font-bold text-md">
                                        {first_name} {last_name}
                                    </h1>
                                    <div className="flex">
                                        <p className=" uppercase text-[#379E37] text-xs font-bold mr-4">
                                            {level}LVL
                                        </p>
                                        <select className="text-xs uppercase font-semibold  text-[#B7802C] border-none focus:outline-none" name="course" id="course">
                                            <option value="gns-202">gns202</option>
                                            <option value="vte-202">vte202</option>
                                            <option value=""></option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div className=" h-[30px] w-[30px] bg-green-700 profile rounded-full mx-1"></div>
                            </div>
                        </div>
                    </div>

                    <div className=' w-full flex flex-col lg:flex-row items-center justify-between'>
                        <div className=' w-full lg:w-[60%]'>
                            <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Course Code</h1>
                            <div className=' bg-white w-full px-3 flex items-center justify-start py-3 rounded-md mb-3'>
                                <Search />
                                <input type="text" className=' h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm' placeholder='Search here...' />
                            </div>
                            <div className={`${montserrat.className} text-sm font-thin w-full bg-white h-[250px] overflow-scroll rounded-md py-3 mb-4`}>
                                {courses?.map((course, idx) => {
                                    return (
                                        // @ts-ignore
                                        <h1 onClick={() => updateCourseCode(course)} key={`${course.course}-${idx}`} className='cursor-pointer w-full bg-white py-2 px-10 border-b border-b-slate-300'>{course.course}</h1>
                                    );
                                })}
                            </div>

                            <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Course Specialization</h1>
                            <div className=' bg-white w-full px-3 flex items-center justify-start py-3 rounded-md mb-3'>
                                <Search />
                                <input type="text" className=' h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm' placeholder='Search here...' />
                            </div>
                            <div className={`${montserrat.className} text-sm font-thin w-full bg-white h-[250px] overflow-scroll rounded-md py-3 mb-4`}>
                                {specializations.map((specialization, idx) => {
                                    return (
                                        <h1 onClick={() => updateCourseSpecialization(specialization)} key={`${specialization}-${idx}`} className='cursor-pointer w-full bg-white py-2 px-10 border-b border-b-slate-300 uppercase'>{specialization}</h1>
                                    );
                                })}
                            </div>
                        </div>

                        <PaymentBlock selectionDetails={selectionDetails} />
                    </div>
                </div>
            </FadeInFromBottom>
        </Protected>
    )
}


function PaymentBlock({ selectionDetails }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handlePaymentClick() {
        let course = selectionDetails.course_code;
        let specialization = selectionDetails.course_specialization;
        if (course == "") return;
        setLoading(true);
        let url = await makePayment({ course, specialization });
        if (url) {
            router.push(url);
        } else {
            setLoading(false);
        }
    }


    return (
        <div className=' w-full lg:w-[40%] min-h-[100vh] flex flex-col items-center justify-start py-24'>
            <div className=' w-full text-center mb-4'>
                <h1 className=' font-bold text-[#379E37] text-xl mb-4'>Selection Details</h1>
                <div className=' w-[80%] m-auto py-4 bg-[#98c898] rounded-lg mb-4'>
                    <div className=' text-center mb-4'>
                        <p>Assigned Group Name</p>
                        <h1 className=' uppercase font-extrabold text-3xl'>null</h1>
                    </div>

                    <div className=' text-center mb-4'>
                        <p>Group Number</p>
                        <h1 className=' uppercase font-extrabold text-3xl'>null</h1>
                    </div>

                    <div className=' text-center mb-4'>
                        <p>Course Code</p>
                        <h1 className=' uppercase font-extrabold text-3xl'>{selectionDetails.course_code}</h1>
                    </div>

                    <div className=' text-center mb-4'>
                        <p>Course Group</p>
                        <h1 className=' uppercase font-extrabold text-3xl'>{selectionDetails.course_specialization}</h1>
                    </div>

                    <div className=' text-center mb-4'>
                        <p>Amount To Be Paid</p>
                        <h1 className=' uppercase font-extrabold text-3xl'>N 1,100</h1>
                    </div>
                </div>
                <div className=' w-full flex flex-col items-center justify-center'>
                    <button onClick={handlePaymentClick} type='button' className={"w-[80%] bg-[#379E37] text-white mb-4 py-2 rounded-md"} disabled={loading}>{loading ? "loading..." : "Make Payment"}</button>
                    <Link href={"/payment"} className=' text-sm text-[#379E37] underline'>Show Payment History</Link>
                </div>
            </div>
        </div>
    );
}