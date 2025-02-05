"use client";
import Image from "next/image";
import logo from "@/assets/kwasulogo.png";
import { FadeInFromLeft } from "@/app/components/FadeInFromLeft";
import { useState } from "react";
import "../../globals.css";
import { Noto_Sans } from "next/font/google";
import loginImage from "@/assets/form-bg-image.png";
import male from "@/assets/login-male.png";
import female from "@/assets/login-female.png";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/hooks/mutations/useSignIn";
import { toast } from "react-toastify";
import useAuth from "@/lib/useAuth";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Page() {
  const router = useRouter();
  const { mutate, isPending } = useSignIn();
  const { userDetails } = useAuth();
  console.log({ userDetails });

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  console.log({ userInfo });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    mutate(userInfo, {
      onSuccess: (data) => {
        toast.success("User signed in successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        setUserInfo({
          email: "",
          password: "",
        });

        router.push("/");

        console.log({ data });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Something went wrong!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      },
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#BFE7BF] login-background">
      <div className=" w-full h-[100vh] flex items-center justify-center">
        <FadeInFromLeft>
          <div className="w-full md:w-[80%] h-full md:h-[90%] lg:bg-white rounded-md flex flex-col md:flex-row items-center justify-center md:justify-between p-4 md:p-[20px]">
            <div className="w-full lg:w-[45%] flex flex-col items-start justify-start h-full p-[20px]">
              {/* Logo and Heading */}
              <div
                className={`flex items-center justify-center mb-20  ${notoSans.className}`}
              >
                <Image
                  alt="Kwara State University Logo"
                  src={logo}
                  className=" w-[30px] md:w-[60px] mr-2"
                />
                <div>
                  <h1 className="text-[#DC9935] font-bold text-lg md:text-medium text-center md:text-left m-0 p-0">
                    Kwara State
                  </h1>
                  <h1
                    className={` text-[#DC9935] font-extrabold text-medium m-0 p-0 ${notoSans.className}`}
                  >
                    University
                  </h1>
                </div>
              </div>

              <div className="text-left mb-6">
                <h1
                  className={`font-extrabold text-4xl md:text-5xl ${notoSans.className} mb-3`}
                >
                  Welcome back
                </h1>
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
                className="w-full mb-4 md:mb-6 px-0"
              >
                {/* Matric No Field */}
                <div className="relative w-full mx-auto mb-4">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                    placeholder="Enter your matric number"
                    onChange={handleChange}
                    value={userInfo.email}
                    required
                  />
                  <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                    Matric Number or email
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
                    value={userInfo.password}
                    required
                  />
                  <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                    Password
                  </label>
                </div>

                {/* Login Button */}
                {isPending ? (
                  <div className="bg-green-500 w-full text-white text-[0.85rem] duration-150 py-[1rem] font-semibold tracking-wider mt-4 uppercase flex items-center justify-center">
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
            <div className=" hidden w-[45%] h-full lg:flex items-end justify-center relative">
              <Image src={loginImage} alt="" className=" max-h-full" />
              <div className=" z-[50] h-[90%] w-full absolute">
                <div className=" h-full z-[100] w-[105%] flex flex-col items-center justify-between">
                  <div className=" h-[70%] flex flex-col items-center justify-center w-full">
                    <h1
                      className={`${notoSans.className} font-extrabold text-4xl bg-[#DC9935] p-2 rounded-md text-green-500 mb-6`}
                    >
                      Kwasu
                    </h1>
                    <p
                      className={` font-extrabold text-white text-2xl text-center ${notoSans.className}`}
                    >
                      Center For <br />
                      Entrepreneurs <br />
                      Payment Platform <br />
                    </p>
                  </div>
                  <div className=" flex items-center justify-between w-[600px] overflow-visible">
                    <Image src={female} alt="" className=" w-[310px]" />
                    <Image src={male} alt="" className=" w-[400px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInFromLeft>
      </div>
    </div>
  );
}
