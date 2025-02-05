"use client";
import Image from "next/image";
import logo from "@/assets/kwasulogo.png";
import { FadeInFromBottom } from "@/app/components/FadeInFromBottom";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Noto_Sans } from "next/font/google";
import loginImage from "@/assets/form-bg-image.png";
import male from "@/assets/login-male.png";
import female from "@/assets/login-female.png";
import { Password } from "@mui/icons-material";
import { useCreateUser } from "@/hooks/mutations/useCreateUser";
import { toast } from "react-toastify";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Page() {
  const router = useRouter();
  const { mutate, isPending } = useCreateUser();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    matric_number: "",
    level: "100",
    role: "student",
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

    const userData = {
      ...userInfo,
      username: userInfo.first_name,
      password: userInfo.last_name.toLowerCase(),
      password2: userInfo.last_name.toLowerCase(),
    };

    mutate(userData, {
      onSuccess: (data) => {
        toast.success("User created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        setUserInfo({
          username: "",
          email: "",
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
          matric_number: "",
          level: "100",
          role: "student",
        });

        router.push("/");

        console.log({ data });
      },
      onError: (error: any) => {
        console.log({ error });

        toast.error(error?.response?.data?.detail || "Something went wrong!", {
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
        <FadeInFromBottom>
          <div className="w-full md:w-[80%] h-full md:h-[90%] lg:bg-white rounded-md flex flex-col md:flex-row items-center justify-center md:justify-between p-4 md:p-[20px]">
            <div className="w-full md:w-[45%] flex flex-col items-start justify-start h-full px-4">
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
                  Get Started
                </h1>
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
                className="w-full mb-4 md:mb-6 px-0"
              >
                {/* Name Field */}
                {/* <div className="relative w-full mx-auto mb-4">
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                                        placeholder="Enter your first name"
                                        onChange={handleChange}
                                    />
                                    <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                                        First Name
                                    </label>
                                </div> */}

                <div className="w-full flex flex-col md:flex-row md:space-x-4 mb-4">
                  <div className="relative w-full md:w-[48%] mb-4 md:mb-0">
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your first name"
                      onChange={handleChange}
                      value={userInfo.first_name}
                      required
                    />
                    <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                      First Name
                    </label>
                  </div>
                  <div className="relative w-full md:w-[48%] mb-4 md:mb-0">
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      placeholder="Enter your last name"
                      onChange={handleChange}
                      value={userInfo.last_name}
                      required
                    />
                    <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                      Last Name
                    </label>
                  </div>
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
                    value={userInfo.email}
                    required
                  />
                  <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                    Email
                  </label>
                </div>

                {/* Password Field */}
                {/* <div className="relative w-full mx-auto mb-4">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                                        placeholder="Enter your password"
                                        onChange={handleChange}
                                    />
                                    <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                                        Password
                                    </label>
                                </div> */}

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
                      value={userInfo.matric_number}
                      required
                    />
                    <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                      Matric Number
                    </label>
                  </div>
                  <div className="relative w-full md:w-[48%]">
                    <select
                      id="level"
                      name="level"
                      className="placeholder:text-sm font-thin block w-full px-4 py-2 text-sm text-gray-900 border border-[#58AE58] rounded-lg focus:outline-none peer"
                      // placeholder="Enter your level"
                      onChange={handleChange}
                      value={userInfo.level}
                      required
                    >
                      <option value="100">100 level</option>
                      <option value="200">200 level</option>
                      <option value="300">300 level</option>
                      <option value="400">400 level</option>
                      <option value="500">500 level</option>
                      <option value="600">600 level</option>
                    </select>
                    <label className="absolute left-3 -top-2.5 px-1 bg-white rounded-md text-sm text-black font-bold transition-all">
                      Level
                    </label>
                  </div>
                </div>

                {/* Sign Up Button */}
                {isPending ? (
                  <div className="bg-green-500 rounded-md w-full text-white text-[0.85rem] duration-150 py-4 font-semibold tracking-wider mt-4 uppercase flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-500 rounded-md hover:bg-green-400 w-full text-white text-[0.85rem] duration-150 py-4 font-semibold tracking-wider mt-4 uppercase"
                  >
                    Sign Up
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
        </FadeInFromBottom>
      </div>
    </div>
  );
}
