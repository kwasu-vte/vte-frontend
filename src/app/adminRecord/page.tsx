"use client"
import { Protected } from '@/components/protected'
import React, { useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { Link, Search } from 'lucide-react'
import { Notifications } from '@mui/icons-material'
import { useAuth } from '@/lib/auth'

const page = () => {
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    var lastName = "";
    var firstName = "";

    if (!loading) {
        lastName = user.last_name;
        firstName = user.first_name;
    }
    return (
        <Protected>
            <AdminSidebar />
            <div className={`w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4`}>
                <div className="hidden sm:flex items-center justify-between bg-white rounded-md p-2 mb-4">
                    <div className="bg-[#BFE7BF7A] h-[50px] w-[30%] px-3 flex items-center">
                        <Search />
                        <input
                            type="text"
                            className="h-full bg-transparent px-3 focus:outline-none text-black placeholder:text-black text-sm"
                            placeholder="Search here..."
                        />
                    </div>
                    <div className="flex items-center">
                        <Link href={"/studentPages/notifications/"}>
                            <Notifications className="text-[#379E37] mx-4" />
                        </Link>
                        <div className="h-[50px] w-[50px] bg-green-700 rounded-full"></div>
                        <div className="mx-2 flex flex-col items-start">
                            <h1 className="font-bold text-lg">{lastName} {firstName}</h1>
                            <p className="uppercase text-[#379E37] text-xs font-bold">Admin</p>
                        </div>
                    </div>
                </div>
                

                <h1 className=' text-green-700 font-extrabold'>Record</h1>
            </div>
        </Protected>
    )
}

export default page