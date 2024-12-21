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
        <div className="flex items-center justify-center min-h-screen bg-[#BFE7BF]">
            <FadeInFromLeft>
                <div className="w-full md:w-[80%] h-full md:h-[80%] bg-white rounded-md flex flex-col md:flex-row items-center justify-center md:justify-between p-4 md:p-6">
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
                            <h1 className="font-extrabold text-2xl md:text-4xl">Welcome back</h1>
                            <p className="text-sm text-[#6E6E6E]">
                                Don’t have an account?{" "}
                                <a href="/auth/sign_up" className="text-[#379E37] underline">
                                    Sign up
                                </a>
                            </p>
                        </div>

                        {/* Login Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="w-full md:w-[80%] mx-auto mb-4 md:mb-6 px-4 md:px-0"
                        >
                            {/* Email / Matric No Field */}
                            <div className="relative w-full mx-auto mb-4">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                                    placeholder="Enter your email or matric number"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                                    Email / Matric No
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
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                                    Password
                                </label>
                            </div>

                            {/* Login Button */}
                            {isLoginProcessStarted ? (
                                <div
                                    className="bg-green-500 w-full text-white text-[0.85rem] duration-150 py-[1rem] font-semibold tracking-wider mt-4 uppercase flex items-center justify-center"
                                >
                                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-400 w-full text-white text-[0.85rem] duration-150 py-[1rem] font-semibold tracking-wider mt-4 uppercase"
                                >
                                    Login
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </FadeInFromLeft>
        </div>
    );
}