"use client"

import Image from "next/image";

import logo from "@/assets/kwasulogo.png";
import { FadeInFromBottom } from "@/app/components/FadeInFromBottom";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "matric_number": "",
        "level": "",
    });

    function handleChange (e) {
        const {name, value} = e.target;
        setUserInfo((prev) => {
            return ({
                ...prev,
                [name]: value,
            })
        })
    }
    async function handleSubmit(e) {
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
        <div className=' flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
            <FadeInFromBottom>
            <div className=' w-[80%] h-[80%] bg-white rounded-md flex items-center justify-between p-2'>
                <div className=' w-[45%] flex flex-col items-start justify-start h-full'>
                <div className=' flex items-center justify-center mb-6'>
                    <Image
                    alt='logo'
                    src={logo}
                    height={100}
                    width={100} />
                    <h1 className=' text-[#DC9935] font-bold text-lg'>Kwara State <br /> University</h1>
                </div>

                <div className=' w-[80%] mx-auto mb-10'>
                    <h1 className=' font-[800] text-6xl text-left mx-auto'>Get started</h1>
                    <p className=' text-sm text-[#6E6E6E]'>already have an account? <span className=' text-[#379E37]'><button className=' underline'>Log in</button></span></p>
                </div>

                <form onSubmit={handleSubmit} className="relative w-[80%] mx-auto mb-6">
                    <div className="relative w-full mx-auto mb-6">
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your first name"
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                            First Name
                        </label>
                    </div>

                    <div className="relative w-full mx-auto mb-6">
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your last name"
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                            Last Name
                        </label>
                    </div>

                    <div className="relative w-full mx-auto mb-6">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                            Email
                        </label>
                    </div>

                    <div className=" w-full mx-auto flex items-center justify-between p-0 m-0 mb-4">
                        <div className="relative w-[48%] mx-auto mb-6">
                        <input
                            type="text"
                            id="matric_number"
                            name="matric_number"
                            className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your matric number"
                            onChange={handleChange}
                        />
                        <label

                            className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                        >
                            Matric Number
                        </label>
                        </div>
                        <div className="relative w-[48%] mx-auto mb-6">
                        <input
                            type="text"
                            id="level"
                            name="level"
                            className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                            placeholder="Enter your level"
                            onChange={handleChange}
                        />
                        <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                        >
                            Level
                        </label>
                        </div>
                    </div>

                    <button type="submit" className=' text-white bg-[#58AE58] w-full mx-auto text-center py-2 rounded-md'>Sign up</button>
                </form>
                </div>
            </div>
            </FadeInFromBottom>
        </div>
    );
}