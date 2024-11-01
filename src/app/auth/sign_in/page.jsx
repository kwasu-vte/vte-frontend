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
    );
}
