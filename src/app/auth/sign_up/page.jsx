"use client"

import Image from "next/image";

import logo from "@/assets/kwasulogo.png";
import { FadeInFromBottom } from "@/app/components/FadeInFromBottom";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [isSignUpProcessStarted, setIsSignUpProcessStarted] = useState(false)
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "matric_number": "",
        "level": "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setUserInfo((prev) => {
            return ({
                ...prev,
                [name]: value,
            })
        })
    }
    async function handleSubmit(e) {
        setIsSignUpProcessStarted(true)
        e.preventDefault();
        console.log(userInfo);
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(userInfo)
        });
        if (res.ok) {
            console.log(await res.json());
            router.push("/auth/sign_in");
        }
        else {
            console.log(await res.json());
            router.push("/auth/sign_up");
        }
    }
    return (
        // <div className='flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
        //     <FadeInFromBottom>
        //         <div className=' w-[80%] h-[80%] bg-white rounded-md flex items-center justify-between p-2'>
        //             <div className=' w-[45%] flex flex-col items-start justify-start h-full'>
        //                 <div className=' flex items-center justify-center mb-6'>
        //                     <Image
        //                         alt='logo'
        //                         src={logo}
        //                         height={100}
        //                         width={100} />
        //                     <h1 className=' text-[#DC9935] font-bold text-lg'>Kwara State <br /> University</h1>
        //                 </div>

        //                 <div className=' w-[80%] mx-auto mb-10'>
        //                     <h1 className=' font-[800] text-6xl text-left mx-auto'>Get started</h1>
        //                     <p className=' text-sm text-[#6E6E6E]'>already have an account? <a href="/auth/sign_in"><span className=' text-[#379E37]'><button className=' underline'>Log in</button></span></a></p>
        //                 </div>

        //                 <form onSubmit={handleSubmit} className="relative w-[80%] mx-auto mb-6">
        //                     <div className="relative w-full mx-auto mb-6">
        //                         <input
        //                             type="text"
        //                             id="first_name"
        //                             name="first_name"
        //                             className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                             placeholder="Enter your first name"
        //                             onChange={handleChange}
        //                         />
        //                         <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
        //                             First Name
        //                         </label>
        //                     </div>

        //                     <div className="relative w-full mx-auto mb-6">
        //                         <input
        //                             type="text"
        //                             id="last_name"
        //                             name="last_name"
        //                             className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                             placeholder="Enter your last name"
        //                             onChange={handleChange}
        //                         />
        //                         <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
        //                             Last Name
        //                         </label>
        //                     </div>

        //                     <div className="relative w-full mx-auto mb-6">
        //                         <input
        //                             type="email"
        //                             id="email"
        //                             name="email"
        //                             className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                             placeholder="Enter your email"
        //                             onChange={handleChange}
        //                         />
        //                         <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
        //                             Email
        //                         </label>
        //                     </div>

        //                     <div className=" w-full mx-auto flex items-center justify-between p-0 m-0 mb-4">
        //                         <div className="relative w-[48%] mx-auto mb-6">
        //                             <input
        //                                 type="text"
        //                                 id="matric_number"
        //                                 name="matric_number"
        //                                 className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                                 placeholder="Enter your matric number"
        //                                 onChange={handleChange}
        //                             />
        //                             <label

        //                                 className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
        //                             >
        //                                 Matric Number
        //                             </label>
        //                         </div>
        //                         <div className="relative w-[48%] mx-auto mb-6">
        //                             <input
        //                                 type="text"
        //                                 id="level"
        //                                 name="level"
        //                                 className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                                 placeholder="Enter your level"
        //                                 onChange={handleChange}
        //                             />
        //                             <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
        //                             >
        //                                 Level
        //                             </label>
        //                         </div>
        //                     </div>

        //                     {/* <button type="submit" className=' text-white bg-[#58AE58] w-full mx-auto text-center py-2 rounded-md'>Sign up</button> */}
        //                     {
        //                         isSignUpProcessStarted ? (
        //                             <div
        //                                 className={`bg-green-500 w-full text-white text-[0.85rem] duration-150 py-[1rem] px-[2.3rem] font-semibold tracking-wider md:tracking-widest mt-[1rem] md:mt-[1.5rem] uppercase`}
        //                             >
        //                                 <div className="animate-spin h-5 w-5 mx-auto border-2 border-white rounded-full border-t-transparent"></div>
        //                             </div>
        //                         ) : (
        //                             <button
        //                                 type="submit"
        //                                 className={`bg-green-500 md:hover:bg-green-400 w-full text-white text-[0.85rem] duration-150 py-[1rem] px-[2.3rem] font-semibold tracking-wider md:tracking-widest mt-[1rem] md:mt-[1.5rem] uppercase`}
        //                             >
        //                                 Sign Up
        //                             </button>
        //                         )
        //                     }
        //                 </form>
        //             </div>
        //         </div>

        //         {/* <div className=" h-[100vh] md:hidden w-[90%] flex flex-col items-start justify-start mx-auto">
        //             <div className=' flex items-center justify-center mb-6'>
        //                 <Image
        //                     alt=''
        //                     src={logo}
        //                     height={100}
        //                     width={100} />
        //                 <h1 className=' text-[#DC9935] font-extrabold text-lg'>Kwara State <br /> University</h1>
        //             </div>

        //             <div className=' w-fit mb-10'>
        //                 <h1 className=' font-[800] text-4xl text-center mx-auto'>Welcome back</h1>
        //                 <p className=' text-sm text-[#6E6E6E]'>Dont have an account? <a href="/auth/sign_up"><span className=' text-[#379E37]'><button className=' underline'>Sign up</button></span></a></p>
        //             </div>

        //             <form onSubmit={handleSubmit} className="login relative w-full mx-auto mb-6">
        //                 <div className="relative w-full mx-auto mb-6">
        //                     <input
        //                         type="text"
        //                         id="first_name"
        //                         name="first_name"
        //                         className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                         placeholder="Enter your first name"
        //                         onChange={handleChange}
        //                     />
        //                     <label className="absolute left-3 -top-2.5 px-1 bg-[#BFE7BF] text-sm text-black font-bold transition-all">
        //                         First Name
        //                     </label>
        //                 </div>

        //                 <div className="relative w-full mx-auto mb-6">
        //                     <input
        //                         type="text"
        //                         id="last_name"
        //                         name="last_name"
        //                         className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                         placeholder="Enter your last name"
        //                         onChange={handleChange}
        //                     />
        //                     <label className="absolute left-3 -top-2.5 px-1 bg-[#BFE7BF] text-sm text-black font-bold transition-all">
        //                         Last Name
        //                     </label>
        //                 </div>

        //                 <div className="relative w-full mx-auto mb-6">
        //                     <input
        //                         type="email"
        //                         id="email"
        //                         name="email"
        //                         className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                         placeholder="Enter your email"
        //                         onChange={handleChange}
        //                     />
        //                     <label className="absolute left-3 -top-2.5 px-1 bg-[#BFE7BF] text-sm text-black font-bold transition-all">
        //                         Email
        //                     </label>
        //                 </div>

        //                 <div className=" w-full mx-auto flex items-center justify-between p-0 m-0 mb-4">
        //                     <div className="relative w-[48%] mx-auto mb-6">
        //                         <input
        //                             type="text"
        //                             id="matric_number"
        //                             name="matric_number"
        //                             className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                             placeholder="Enter your matric number"
        //                             onChange={handleChange}
        //                         />
        //                         <label

        //                             className="absolute left-3 -top-2.5 px-1 bg-[#BFE7BF] text-sm text-black font-bold transition-all"
        //                         >
        //                             Matric Number
        //                         </label>
        //                     </div>
        //                     <div className="relative w-[48%] mx-auto mb-6">
        //                         <input
        //                             type="text"
        //                             id="level"
        //                             name="level"
        //                             className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
        //                             placeholder="Enter your level"
        //                             onChange={handleChange}
        //                         />
        //                         <label className="absolute left-3 -top-2.5 px-1 bg-[#BFE7BF] text-sm text-black font-bold transition-all"
        //                         >
        //                             Level
        //                         </label>
        //                     </div>
        //                 </div>

        //                 {
        //                     isSignUpProcessStarted ? (
        //                         <div
        //                             className={`bg-green-500 w-full text-white text-[0.85rem] duration-150 py-[1rem] px-[2.3rem] font-semibold tracking-wider md:tracking-widest mt-[1rem] md:mt-[1.5rem] uppercase`}
        //                         >
        //                             <div className="animate-spin h-5 w-5 mx-auto border-2 border-white rounded-full border-t-transparent"></div>
        //                         </div>
        //                     ) : (
        //                         <button
        //                             type="submit"
        //                             className={`bg-green-500 md:hover:bg-green-400 w-full text-white text-[0.85rem] duration-150 py-[1rem] px-[2.3rem] font-semibold tracking-wider md:tracking-widest mt-[1rem] md:mt-[1.5rem] uppercase`}
        //                         >
        //                             Sign Up
        //                         </button>
        //                     )
        //                 }
        //             </form>
        //         </div> */}
        //     </FadeInFromBottom>
        // </div>

    //mobile view v1
    <div className="flex items-center justify-center min-h-screen bg-[#BFE7BF]">
    <FadeInFromBottom>
        <div className="w-full md:w-[80%] h-full md:h-[80%] bg-white rounded-md flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between p-4 md:p-6">
            {/* Logo and Heading */}
            <div className="w-full md:w-[45%] flex flex-col items-center md:items-start justify-start h-full px-4">
                <div className="flex items-center justify-center mb-6">
                    <Image
                        alt="Kwara State University Logo"
                        src={logo}
                        height={80}
                        width={80}
                        className="md:h-[100px] md:w-[100px]"
                    />
                    <h1 className="text-[#DC9935] font-bold text-lg md:text-2xl ml-2 text-center md:text-left">
                        Kwara State <br /> University
                    </h1>
                </div>

                <div className="text-center md:text-left mb-6">
                    <h1 className="font-extrabold text-2xl md:text-4xl">Get started</h1>
                    <p className="text-sm text-[#6E6E6E]">
                        Already have an account?{" "}
                        <a href="/auth/sign_in" className="text-[#379E37] underline">
                            Login
                        </a>
                    </p>
                </div>

                {/* Sign Up Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-[80%] mx-auto mb-4 md:mb-6 px-4 md:px-0"
                >
                    {/* Name Field */}
                    <div className="relative w-full mx-auto mb-4">
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your name"
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                            Name
                        </label>
                    </div>

                    {/* Email Field */}
                    <div className="relative w-full mx-auto mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                            Email
                        </label>
                    </div>

                    {/* Password Field */}
                    <div className="relative w-full mx-auto mb-4">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                            Password
                        </label>
                    </div>

                    {/* Matric Number and Level Fields */}
                    <div className="w-full flex flex-col md:flex-row md:space-x-4 mb-4">
                        <div className="relative w-full md:w-[48%] mb-4 md:mb-0">
                            <input
                                type="text"
                                id="matric_number"
                                name="matric_number"
                                className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                                placeholder="Enter your matric number"
                                onChange={handleChange}
                            />
                            <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                                Matric Number
                            </label>
                        </div>
                        <div className="relative w-full md:w-[48%]">
                            <input
                                type="text"
                                id="level"
                                name="level"
                                className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                                placeholder="Enter your level"
                                onChange={handleChange}
                            />
                            <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                                Level
                            </label>
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    {isSignUpProcessStarted ? (
                        <div className="bg-green-500 w-full text-white text-[0.85rem] duration-150 py-4 font-semibold tracking-wider mt-4 uppercase flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-400 w-full text-white text-[0.85rem] duration-150 py-4 font-semibold tracking-wider mt-4 uppercase"
                        >
                            Sign Up
                        </button>
                    )}
                </form>
            </div>
        </div>
    </FadeInFromBottom>
</div>

    );
}