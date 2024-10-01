"use client";
import { Inter, Roboto_Condensed } from "next/font/google";
import { Urbanist } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { createContext, useContext, useState } from "react";
import logo from '@/assets/kwasulogo.png'
import Image from 'next/image'
import Link from 'next/link'
import AdminSidebar from "./components/AdminSidebar";
import StaffSidebar from "./components/StaffSidebar";


const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Specify the weights you want to use
});


const MyPropContext = createContext<string | null>(null);
export function useMyProp() {
  return useContext(MyPropContext);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const myProp = "admin"
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [formType, setFormType] = useState<string>("log-in")
  const [sidebarType, setSidebarType] = useState<string>("student")

  const handleLogin = async () => {
    const username = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
    const password = (document.querySelector('input[type="password"]') as HTMLInputElement).value;
    console.log(username, password);

    try {
      const response = await fetch("https://vte-backend.onrender.com/api/auth/token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful', data);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('token_type', data.token_type);
        localStorage.setItem('role', data.role);
        if (data.status == true) {
          setSidebarType("student")
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  const handleAdminLogin = async () => {
    const username = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
    const password = (document.querySelector('input[type="password"]') as HTMLInputElement).value;
    console.log(username, password);

    try {
      const response = await fetch("https://vte-backend.onrender.com/api/auth/token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful', data);

        setSidebarType("admin")
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }


  if (isAuthenticated == true) {
    if (sidebarType === "student") {
      const myProp = "student"
      return (
        <html lang="en">
          <body className={roboto.className} >
            <Sidebar setIsAuthenticated={setIsAuthenticated} />
            <MyPropContext.Provider value={myProp} >
              <main className="flex-grow mx-auto py-8 bg-[#BFE7BF]">
                {children}
              </main>
            </MyPropContext.Provider>
          </body >
        </html >
      );
    } else if (sidebarType == "staff") {
      const myProp = "staff"
      return (
        <html lang="en">
          <body className={roboto.className} >
            <StaffSidebar setIsAuthenticated={setIsAuthenticated} />
            <MyPropContext.Provider value={myProp} >
              <main className="flex-grow mx-auto py-8 bg-[#BFE7BF]">
                {children}
              </main>
            </MyPropContext.Provider>
          </body >
        </html >
      );
    } else {
      const myProp = "admin"
      return (
        <html lang="en">
          <body className={roboto.className} >
            <AdminSidebar setIsAuthenticated={setIsAuthenticated} />
            <MyPropContext.Provider value={myProp} >
              <main className="flex-grow mx-auto py-8 bg-[#BFE7BF]">
                {children}
              </main>
            </MyPropContext.Provider>
          </body >
        </html >
      );
    }

  } else {
    if (isAuthenticated == false && formType === "log-in") {
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

                  <div className="login relative w-[80%] mx-auto mb-6" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your email or matric number"
                    />
                    <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                      Email / Matric No
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
                    <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
                      Password
                    </label>
                  </div>
                  <button onClick={() => { setIsAuthenticated(true); setSidebarType("student") }} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md mb-4'>Login</button>
                  <p className=' w-[80%] mx-auto text-sm text-[#6E6E6E]'>Are you an admin? <span className=' text-[#379E37]'><button onClick={() => setFormType("admin-log-in")} className=' underline'>Log in as administartor</button></span></p>
                </div>
              </div>
            </div>
          </body >
        </html >
      );
    } else if (isAuthenticated == false && formType === "sign-up") {
      return (
        <html lang="en">
          <body className={roboto.className} >
            <div className=' flex items-center justify-center h-[100vh] bg-[#BFE7BF]'>
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
                    <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
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
                    <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all">
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
                        type="text"
                        id="name"
                        name="name"
                        className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                        placeholder="Enter your matric number"
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
                        id="name"
                        name="name"
                        className=" placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                        placeholder="Enter your level"
                      />
                      <label className="absolute left-3 -top-2.5 px-1 bg-white text-sm text-black font-bold transition-all"
                      >
                        Level
                      </label>
                    </div>
                  </div>

                  <button onClick={() => { setIsAuthenticated(true); setSidebarType("student") }} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md'>Sign up</button>
                </div>
              </div>
            </div>
          </body >
        </html >
      );
    } else if (isAuthenticated == false && formType === "admin-log-in") {
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



                  <button onClick={() => { setIsAuthenticated(true); setSidebarType("admin") }} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md mb-4'>Login</button>
                  <p className=' w-[80%] mx-auto text-sm text-[#6E6E6E]'>Are you a student? <span className=' text-[#379E37]'><button onClick={() => setFormType("log-in")} className=' underline'>Log in as student</button></span></p>
                  <p className=' w-[80%] mx-auto text-sm text-[#6E6E6E]'>Are you a staff? <span className=' text-[#379E37]'><button onClick={() => setFormType("staff-log-in")} className=' underline'>Log in as staff</button></span></p>
                </div>
              </div>
            </div>
          </body >
        </html >
      );
    } else if (isAuthenticated == false && formType === "staff-log-in") {
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



                  <button onClick={() => { setIsAuthenticated(true); setSidebarType("staff") }} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md mb-4'>Login</button>
                  <p className=' w-[80%] mx-auto text-sm text-[#6E6E6E]'>Are you a student? <span className=' text-[#379E37]'><button onClick={() => setFormType("log-in")} className=' underline'>Log in as student</button></span></p>
                  <p className=' w-[80%] mx-auto text-sm text-[#6E6E6E]'>Are you an admin? <span className=' text-[#379E37]'><button onClick={() => setFormType("admin-log-in")} className=' underline'>Log in as administrator</button></span></p>
                </div>
              </div>
            </div>
          </body >
        </html >
      );
    }
  }
}
