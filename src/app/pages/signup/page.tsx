"use client";
import '../../../app/globals.css'
import React, { useState } from 'react'
import Image from 'next/image'
import paystackLogo from '../../../assets/paystack_logo.png'

const SignupPage = () => {
    const [formType, setFormType] = useState("SignIn")
    const [signupType, setSignupType] = useState(true)

    if (formType === "SignUp") {
        return (
            <div className=' home-bg h-full w-full p-4 sm:p-10'>
                <h1 className=' text-green-500 font-serif text-center text-4xl sm:text-6xl'><span>KWASU</span> VTE</h1>

                <form action="" className=' bg-white rounded-sm sm:rounded-md sm:py-5 mt-4 sm:px-11 px-4 py-4 sm:w-[45%] md:w-[35%] m-auto flex flex-col items-start justify-center'>
                    <div className=' max-w-fit'>
                        <h1 className=' text-black font-bold text-2xl'>Registration</h1>
                        <div className=' mb-4 h-[3px] w-[50%] bg-green-500'></div>
                    </div>
                    <div className=' w-full'>
                        <input type="text" placeholder='First Name' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                        <input type="text" placeholder='Last Name' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                        <input type="text" placeholder='Matric Number' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                        <input type="number" placeholder='Phone number' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm appearance-none' />
                        {/* <input type="text" placeholder='Price' value={"NGN 4500"} className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' /> */}

                        <div className=' flex flex-col w-full h-full mb-4'>
                            <label htmlFor="#" className=' text-sm text-slate-400'>Select your course</label>
                            <select name="" id="" className=' text-slate-400 appearance-none py-2 focus:outline-none rounded-sm md:rounded-md border border-slate-400 focus:border-black text-sm text-center'>
                                <option value="">--Select course--</option>
                                <option value="">VTE204</option>
                                <option value="">VTE206</option>
                                <option value="">VTE304</option>
                                <option value="">VTE306</option>
                            </select>
                        </div>
                        <div className=' flex flex-col items-start justify-center h-full mb-4'>
                            <h1 className=' text-sm text-slate-400'>Payment Bill: NGN 2,000.00</h1>
                            <div className=' flex flex-col md:flex-row items-start md:items-center justify-center text-sm w-fit my-4 border border-slate-300 p-3 rounded-md hover:cursor-pointer hover:bg-slate-200 duration-500'>
                                <h1>Pay with</h1>
                                <Image
                                    src={paystackLogo}
                                    width={120}
                                    height={50}
                                    className=' md:mx-3'
                                    alt='paystack logo' />
                            </div>
                        </div>

                        <div className=' flex items-center justify-start w-full mb-5'>
                            <input type="checkbox" name="" id="" />
                            <h1 className=' ml-4 text-black text-xs'>I agree to the tems & conditions</h1>
                        </div>
                        <a href="/pages/dashboard" className=' block mb-4 w-full text-center text-sm py-2 bg-green-500 font-bold cursor-pointer duration-500 hover:text-lg text-white'>Register Now!</a>
                        <h1 className=' text-black text-xs text-center'>Already have an account? <span className=' text-blue-500'><h1 className=' inline cursor-pointer' onClick={() => setFormType("SignIn")}>Sign in</h1></span></h1>
                    </div>
                </form>
            </div>
        )
    } else {
        return (
            <div className=' home-bg h-full w-full p-4 sm:p-10'>
                <h1 className=' text-green-500 font-serif text-center text-4xl sm:text-6xl'><span>KWASU</span> VTE</h1>

                <form action="" className=' bg-white rounded-sm sm:rounded-md sm:py-5 mt-4 sm:px-11 px-4 py-4 sm:w-[45%] md:w-[35%] m-auto flex flex-col items-start justify-center'>
                    <div className=' max-w-fit'>
                        <h1 className=' text-black font-bold text-2xl'>Sign In</h1>
                        <div className=' mb-4 h-[3px] w-[50%] bg-green-500'></div>
                    </div>
                    <div className=' w-full'>
                        <input type="text" placeholder='Matric Number' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                        <input type="password" placeholder='Enter Password' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                        <a href="/pages/dashboard" className=' block mb-4 w-full text-center text-sm py-2 bg-green-500 font-bold cursor-pointer duration-500 hover:text-lg text-white'>Login</a>
                        <h1 className=' text-black text-xs text-center'>Don't have an account? <span className=' text-blue-500'><h1 className=' inline cursor-pointer' onClick={() => setFormType("SignUp")}>Sign up</h1></span></h1>
                    </div>
                </form>
            </div>
        )
    }

}

export default SignupPage
