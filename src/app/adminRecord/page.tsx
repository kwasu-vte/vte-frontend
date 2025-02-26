"use client";
import { Protected } from "@/components/protected";
import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Link, Search } from "lucide-react";
import { Notifications } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuth from "@/lib/useAuth";
import { useFetchAdminDetails } from "@/hooks/queries/useFetchAdminDetails";
import { useFetchGroups } from "@/hooks/queries/useFetchGroups";
import { useFetchGroupDetails } from "@/hooks/queries/usefetchGroupDetails";

const Page = () => {
  const { userDetails } = useAuth();
  const id = userDetails?.id;

  const { data, isLoading, error } = useFetchAdminDetails(id ?? "");
  console.log({ data });

  const { first_name, last_name, username, email, role } = data || {};
  const { data: groups, isLoading: isFetchingGroups } = useFetchGroups();

  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    if (groups?.data?.length) {
      setSelectedGroup(groups?.data[0].id);
    }
  }, [groups]);

  const { data: group, isLoading: isFetchingGroup } =
    useFetchGroupDetails(selectedGroup);

  console.log({ group });

  return (
    <Protected>
      <AdminSidebar />
      <div
        className={`w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4`}
      >
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
              <h1 className="font-bold text-lg">
                {last_name} {first_name}
              </h1>
              <p className="uppercase text-[#379E37] text-xs font-bold">
                Admin
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl">
            Records
          </h1>

          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700">
              Select Group:
            </label>
            <select
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {groups?.data?.map((group) => (
                <option key={group?.id} value={group?.id} className="">
                  {group?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className=" w-full h-[80vh] bg-white p-4 rounded-lg">
          <h1 className=" font-extrabold text-[#379E37] mb-4 text-xl">
            {group?.name}
          </h1>
          <div className="overflow-scroll rounded-md">
            <Table className="rounded-md">
              <TableHeader>
                <TableRow className=" bg-[#BFE7BF7A] hover:bg-[#BFE7BF7A] text-black">
                  <TableHead className=" text-black">S/N</TableHead>
                  <TableHead className=" text-black">Full Name</TableHead>
                  <TableHead className=" text-black">
                    Matriculation Number
                  </TableHead>
                  <TableHead className=" text-black">Group</TableHead>
                  {/* <TableHead>Time Status</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Score</TableHead> */}
                  <TableHead className="text-center text-black">
                    Scores
                    <div className=" flex items-center justify-between">
                      <div className=" w-[20px] text-center">
                        <h1>1st</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>2nd</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>3rd</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>CA</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>Exam</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>Total</h1>
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Sample Table Row */}
                <TableRow>
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>Olusanmi Pelumi</TableCell>
                  <TableCell>Kwas/17/Biol123</TableCell>
                  <TableCell>A</TableCell>
                  <TableCell className="text-right">
                    <div className=" flex items-center justify-between">
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>60</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>100</h1>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>Olusanmi Pelumi</TableCell>
                  <TableCell>Kwas/17/Biol123</TableCell>
                  <TableCell>A</TableCell>
                  <TableCell className="text-right">
                    <div className=" flex items-center justify-between">
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>60</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>100</h1>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>Olusanmi Pelumi</TableCell>
                  <TableCell>Kwas/17/Biol123</TableCell>
                  <TableCell>A</TableCell>
                  <TableCell className="text-right">
                    <div className=" flex items-center justify-between">
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>60</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>100</h1>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>Olusanmi Pelumi</TableCell>
                  <TableCell>Kwas/17/Biol123</TableCell>
                  <TableCell>A</TableCell>
                  <TableCell className="text-right">
                    <div className=" flex items-center justify-between">
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>10</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>60</h1>
                      </div>
                      <div className=" w-[20px] text-center">
                        <h1>100</h1>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Protected>
  );
};

export default Page;
