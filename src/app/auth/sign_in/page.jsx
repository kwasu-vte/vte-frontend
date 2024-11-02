"use client"
import Image from "next/image";
import logo from "@/assets/kwasulogo.png";
import { FadeInFromLeft } from '@/app/components/FadeInFromLeft';
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import '../../globals.css'


export default function Page() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginProcessStarted, setIsLoginProcessStarted] = useState(false)

    function handleSubmit(e) {
        setIsLoginProcessStarted(true)
        e.preventDefault();
        login({ username, password })
    }
    return (
        <div className=' flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
            <FadeInFromLeft>
                <div className=' w-[80%] h-[80%] bg-white rounded-md flex items-center justify-between p-2'>
                    <div className=' w-[45%] flex flex-col items-start justify-start h-full'>
                        <div className=' flex items-center justify-center mb-6'>
                            <Image
                                alt=''
                                src={logo}
                                height={100}
                                width={100} />
                            <h1 className=' text-[#DC9935] font-bold text-lg'>Kwara State <br /> University</h1>
                        </div>

                        <div className=' w-fit block mx-auto mb-10 pb-11'>
                            <h1 className=' font-[800] text-6xl text-center '>Welcome back</h1>
                            <p className=' text-sm text-[#6E6E6E]'>Dont have an account? <a href="/auth/sign_up"><span className=' text-[#379E37]'><button className=' underline'>Sign up</button></span></a></p>
                        </div>

                        <form onSubmit={handleSubmit} className="login relative w-[80%] mx-auto mb-6" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                            <div className="login relative w-full mx-auto mb-6" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                                    placeholder="Enter your email or matric number"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                                    Email / Matric No
                                </label>
                            </div>

                            <div className="relative w-full mx-auto mb-6">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                                    Password
                                </label>
                            </div>
                            {
                                isLoginProcessStarted ? (
                                    <div
                                        className={`bg-green-500 w-full text-white text-[0.85rem] duration-150 py-[1rem] px-[2.3rem] font-semibold tracking-wider md:tracking-widest mt-[1rem] md:mt-[1.5rem] uppercase`}
                                    >
                                        <div className="animate-spin h-5 w-5 mx-auto border-2 border-white rounded-full border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        className={`bg-green-500 md:hover:bg-green-400 w-full text-white text-[0.85rem] duration-150 py-[1rem] px-[2.3rem] font-semibold tracking-wider md:tracking-widest mt-[1rem] md:mt-[1.5rem] uppercase`}
                                    >
                                        Login
                                    </button>
                                )
                            }
                        </form>
                    </div>
                </div>
            </FadeInFromLeft>
        </div>    

        //attempt at making it responsive
    //     <div className="min-h-screen bg-[#BFE7BF] lg:flex lg:items-center lg:justify-center">
    //     <div className="w-full px-6 py-12 lg:w-[80%] lg:h-[80%]">
    //       <div className="lg:bg-white lg:rounded-2xl lg:flex lg:items-center lg:justify-between lg:p-8 lg:h-full">
    //         {/* Left section that becomes full width on mobile */}
    //         <div className="lg:w-[45%] lg:h-full lg:flex lg:flex-col lg:items-start lg:justify-start">
    //           {/* Logo section */}
    //           <div className="flex items-center gap-3 mb-16 lg:mb-6">
    //             <Image
    //               alt=""
    //               src={logo}
    //               height={64}
    //               width={64}
    //               className="lg:h-[100px] lg:w-[100px]"
    //             />
    //             <h1 className="text-[#DC9935] font-bold text-2xl leading-tight lg:text-lg">
    //               Kwara State<br />University
    //             </h1>
    //           </div>
  
    //           {/* Welcome text */}
    //           <div className="text-center mb-20 lg:w-fit lg:block lg:mx-auto lg:mb-10 lg:pb-11">
    //             <h1 className="text-[2.75rem] font-extrabold text-gray-800 mb-4 lg:text-6xl lg:font-[800]">
    //               Welcome back
    //             </h1>
    //             <p className="text-[#6E6E6E] text-lg lg:text-sm">
    //               Don't have an account?{' '}
    //               <a href="/auth/sign_up">
    //                 <span className="text-[#379E37] font-medium">
    //                   <button className="underline hover:text-green-600 transition-colors">Sign up</button>
    //                 </span>
    //               </a>
    //             </p>
    //           </div>
  
    //           {/* Form */}
    //           <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-12 lg:w-[80%] lg:space-y-6">
    //             <div className="relative group">
    //               <input
    //                 type="text"
    //                 id="username"
    //                 name="username"
    //                 className="w-full px-6 py-5 text-lg text-gray-900 border-2 border-green-200 rounded-2xl bg-white/80 
    //                   placeholder:text-gray-400 placeholder:text-lg
    //                   focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400
    //                   transition-all duration-200 ease-in-out
    //                   lg:rounded-lg lg:px-4 lg:py-2 lg:text-sm lg:border-[#58AE58]"
    //                 placeholder="Enter your email or matric number"
    //                 onChange={(e) => setUsername(e.target.value)}
    //               />
    //               <label className="absolute left-3 -top-2.5 px-2 bg-white text-sm font-semibold
    //                 text-gray-700 transition-all duration-200 ease-in-out
    //                 group-focus-within:text-green-500">
    //                 Email / Matric No
    //               </label>
    //             </div>
  
    //             <div className="relative group">
    //               <input
    //                 type="password"
    //                 id="password"
    //                 name="password"
    //                 className="w-full px-6 py-5 text-lg text-gray-900 border-2 border-green-200 rounded-2xl bg-white/80 
    //                   placeholder:text-gray-400 placeholder:text-lg
    //                   focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400
    //                   transition-all duration-200 ease-in-out
    //                   lg:rounded-lg lg:px-4 lg:py-2 lg:text-sm lg:border-[#58AE58]"
    //                 placeholder="Enter your password"
    //                 onChange={(e) => setPassword(e.target.value)}
    //               />
    //               <label className="absolute left-3 -top-2.5 px-2 bg-white text-sm font-semibold
    //                 text-gray-700 transition-all duration-200 ease-in-out
    //                 group-focus-within:text-green-500">
    //                 Password
    //               </label>
    //             </div>
  
    //             {isLoginProcessStarted ? (
    //               <div className="w-full bg-green-500 text-white rounded-2xl py-5 mt-12
    //                 shadow-lg shadow-green-500/20
    //                 lg:rounded-lg lg:py-[1rem] lg:px-[2.3rem] lg:mt-[1.5rem]">
    //                 <div className="animate-spin h-5 w-5 mx-auto border-2 border-white rounded-full border-t-transparent"></div>
    //               </div>
    //             ) : (
    //               <button
    //                 type="submit"
    //                 className="w-full bg-green-500 text-white rounded-2xl py-5 mt-12
    //                   text-lg font-semibold tracking-wide
    //                   shadow-lg shadow-green-500/20
    //                   transition-all duration-200 ease-in-out
    //                   hover:bg-green-400 hover:shadow-xl hover:shadow-green-500/30
    //                   active:transform active:scale-[0.98]
    //                   lg:rounded-lg lg:text-[0.85rem] lg:py-[1rem] lg:px-[2.3rem] lg:font-semibold 
    //                   lg:tracking-widest lg:mt-[1.5rem] lg:uppercase"
    //               >
    //                 Login
    //               </button>
    //             )}
    //           </form>
  
    //           {/* Decorative dots */}
    //           <div className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none lg:hidden">
    //             <div className="absolute bottom-20 left-4 w-2 h-2 bg-green-400/50 rounded-full"></div>
    //             <div className="absolute bottom-32 right-8 w-2 h-2 bg-orange-400/50 rounded-full"></div>
    //             <div className="absolute bottom-12 left-1/2 w-2 h-2 bg-green-500/50 rounded-full"></div>
    //           </div>
    //         </div>
  
    //         {/* Right section - only visible on desktop */}
    //         <div className="hidden lg:block lg:w-[45%]">
    //           {/* Your existing right side content */}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    );
}
