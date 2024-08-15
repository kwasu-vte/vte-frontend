import React from 'react'
import Image from 'next/image'
import elearning from '../../assets/elearning.jpg'

const SignupPage = () => {
    return (
        <div className=' h-full w-full p-4 sm:p-10 bg-gradient-to-tl from-green-400 to-green-100'>
            <h1 className=' text-green-700 font-serif text-center text-4xl sm:text-6xl'><span>KWASU</span> VTE</h1>
            <form action="" className=' bg-white rounded-sm sm:rounded-md sm:py-5 mt-4 sm:px-11 px-4 py-4 sm:w-[35%] m-auto flex flex-col items-start justify-center'>
                <div className=' max-w-fit'>
                    <h1 className=' text-black font-bold text-2xl'>Registration</h1>
                    <div className=' mb-4 h-[3px] w-[50%] bg-green-500'></div>
                </div>
                <div className=' w-full'>
                    <input type="text" placeholder='First Name' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                    <input type="text" placeholder='Last Name' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                    <input type="text" placeholder='Matric Number' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                    <input type="password" placeholder='Create Password' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                    <input type="password" placeholder='Confirm Password' className=' mb-4 block px-4 py-2 border border-slate-400 rounded-sm md:rounded-md w-full focus:outline-none placeholder:text-slate-400 text-black text-sm' />
                    <div className=' flex items-center justify-start w-full mb-5'>
                        <input type="checkbox" name="" id="" />
                        <h1 className=' ml-4 text-black text-xs'>I agree to the tems & conditions</h1>
                    </div>
                    <input type="submit" value={"Register Now!"} className=' mb-4 w-full text-center text-sm py-2 bg-green-500 font-bold cursor-pointer duration-500 hover:text-lg text-white'/>
                    <h1 className=' text-black text-xs text-center'>Already have an account? <span className=' text-blue-500'><a href="">Sign in</a></span></h1>
                </div>
            </form>
        </div>
    )
}

export default SignupPage
