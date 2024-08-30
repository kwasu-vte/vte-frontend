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

  if (isAuthenticated == true) {
    return (
      <html lang="en">
        <body className={roboto.className} >
          <Sidebar setIsAuthenticated={setIsAuthenticated} />
          <main className=" bg-[#BFE7BF]">{children}</main>
        </body >
      </html >
    );
  } else {
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
                  <p className=' text-sm text-[#6E6E6E]'>Dont have an account? <span className=' text-[#379E37]'><Link href='/signup' className=' underline'>Sign up</Link></span></p>
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

                {/* <Link href={'/studentDashboard'} onClick={()=> setIsAuthenticated(true)} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md'>Login</Link> */}
                <button onClick={() => setIsAuthenticated(true)} className=' text-white bg-[#58AE58] w-[80%] mx-auto text-center py-2 rounded-md'>Login</button>


              </div>
            </div>
          </div>
        </body >
      </html >
    );
  }
}
