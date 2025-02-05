"use client";
import React from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/lib/useAuth";

export const Protected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { userDetails } = useAuth();

  //test
  //if (!loading && user == null) router.push("/auth/sign_in");
  return <>{children}</>;
};
