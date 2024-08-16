"use client";
import Image from "next/image";
import SignupPage from "../app/pages/signup/page";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 4000)
  })

  return (
    <main className=" bg-white h-[100vh] w-[100vw]">
      {
        isLoading ? (
          <div className="h-[100vh] w-[100vh] flex items-center justify-center name-reveal-container">
            <div className=' h-[25px] w-[25px] md:h-[50px] md:w-[50px] mx-4 bg-gradient-to-tl from-green-400 to-green-100 rounded-full ball'></div>
            <div className="name-reveal text-4xl md:text-7xl font-thin text-green-500 text-center">KWASU VTE</div>
          </div>
        ) : (
          <SignupPage />
        )
      }

    </main>
  );
}
