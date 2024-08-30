"use client";
import { Inter, Roboto_Condensed } from "next/font/google";
import { Urbanist } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import logo from '@/assets/kwasulogo.png'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Specify the weights you want to use
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formType, setFormType] = useState("admin-log-in")

  if (isAuthenticated == true) {
    return (
      <html lang="en">
        <body className={roboto.className} >
          <div className=' flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
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

                <div className=' w-fit mx-auto mb-10'>
                  <h1 className=' font-[800] text-6xl text-center mx-auto'>Welcome back</h1>
                  <p className=' text-sm text-[#6E6E6E]'>Dont have an account? <span className=' text-[#379E37]'><button className=' underline'>Sign up</button></span></p>
                </div>

                <div className="relative w-[80%] mx-auto mb-6">
                  <input
                    type="email"
                    id="name"
                    name="name"
                    className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                    placeholder="Enter your email"
                  />
                  <label

                    className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                  >
                    Email
                  </label>
                </div>

                <div className="relative w-[80%] mx-auto mb-6">
                  <input
                    type="password"
                    id="name"
                    name="name"
                    className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                    placeholder="Enter your password"
                  />
                  <label

                    className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                  >
                    Password
                  </label>
                </div>

                <button onClick={() => setIsAuthenticated(true)} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md'>Login</button>
              </div>
            </div>
          </div>
        </body >
      </html >
    );
  } else {
    if (formType === "log-in") {
      return (
        <html lang="en">
          <body className={roboto.className} >
            <div className=' flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
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

                  <div className=' w-fit mx-auto mb-10'>
                    <h1 className=' font-[800] text-6xl text-center mx-auto'>Welcome back</h1>
                    <p className=' text-sm text-[#6E6E6E]'>Dont have an account? <span className=' text-[#379E37]'><button className=' underline' onClick={() => setFormType("sign-up")}>Sign up</button></span></p>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="email"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your email"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="password"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your password"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Password
                    </label>
                  </div>

                 

                  <button onClick={() => setIsAuthenticated(true)} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md mb-4'>Login</button>
                  <p className=' w-[80%] mx-auto text-sm text-[#6E6E6E]'>Are you an admin? <span className=' text-[#379E37]'><button onClick={() => setFormType("admin-log-in")} className=' underline'>Log in as administartor</button></span></p>
                </div>
              </div>
            </div>
          </body >
        </html >
      );
    } else if (formType === "sign-up") {
      return (
        <html lang="en">
          <body className={roboto.className} >
            <div className=' flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
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

                  <div className=' w-[80%] mx-auto mb-10'>
                    <h1 className=' font-[800] text-6xl text-left mx-auto'>Get started</h1>
                    <p className=' text-sm text-[#6E6E6E]'>already have an account? <span className=' text-[#379E37]'><button onClick={() => setFormType("log-in")} className=' underline'>Log in</button></span></p>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your name"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Name
                    </label>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="email"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your email"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="password"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your password"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Password
                    </label>
                  </div>

                  <div className=" w-[80%] mx-auto flex items-center justify-between p-0 m-0 mb-4">
                    <div className="relative w-[48%] mx-auto mb-6">
                      <input
                        type="password"
                        id="name"
                        name="name"
                        className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                        placeholder="Enter your password"
                      />
                      <label

                        className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative w-[48%] mx-auto mb-6">
                      <input
                        type="password"
                        id="name"
                        name="name"
                        className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                        placeholder="Enter your password"
                      />
                      <label

                        className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                      >
                        Password
                      </label>
                    </div>
                  </div>

                  <button onClick={() => setIsAuthenticated(true)} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md'>Sign up</button>
                </div>
              </div>
            </div>
          </body >
        </html >
      );
    } else if (formType === "admin-log-in") {
      return (
        <html lang="en">
          <body className={roboto.className} >
            <div className=' flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
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

                  <div className=' w-fit mx-auto mb-10'>
                    <h1 className=' font-[800] text-6xl text-center mx-auto'>Welcome back</h1>
                    <p className=' text-sm text-[#6E6E6E]'>Dont have an account? <span className=' text-[#379E37]'><button className=' underline' onClick={() => setFormType("sign-up")}>Sign up</button></span></p>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="email"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your email"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="password"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your staff ID"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Staff ID
                    </label>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your department"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Department
                    </label>
                  </div>

                  <div className="relative w-[80%] mx-auto mb-6">
                    <input
                      type="password"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your password"
                    />
                    <label

                      className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                    >
                      Password
                    </label>
                  </div>

                 

                  <button onClick={() => setIsAuthenticated(true)} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md mb-4'>Login</button>
                  <p className=' w-[80%] mx-auto text-sm text-[#6E6E6E]'>Are you a student? <span className=' text-[#379E37]'><button onClick={() => setFormType("log-in")} className=' underline'>Log in as student</button></span></p>
                </div>
              </div>
            </div>
          </body >
        </html >
      );
    }
  }
}
