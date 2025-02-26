"use client";

import { Protected } from "@/components/protected";
import { useFetchGroups } from "@/hooks/queries/useFetchGroups";
import React from "react";
import AdminSidebar from "../components/AdminSidebar";

const Attendance = () => {
  const { data: groups, isLoading } = useFetchGroups();

  return (
    <Protected>
      <AdminSidebar />
      <div
        className={`w-full h-[100vh] overflow-scroll p-4 sm:pl-[20%] sm:py-2 sm:pr-4`}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-green-800">
            Groups Attendance
          </h2>
          <div>
            <label className="mr-2 font-medium text-green-900">
              Select Group:
            </label>
            <select className="border p-2 rounded bg-white">
              {isLoading ? (
                <option>Loading...</option>
              ) : (
                groups?.map((group: { id: string; name: string }) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>
    </Protected>
  );
};

export default Attendance;
