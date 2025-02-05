"use client";

import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn, mounted } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && mounted && isLoggedIn === false) {
      router.replace("/auth/sign_in");
    }
  }, [isClient, isLoggedIn, mounted, router]);

  if (!isClient || !mounted) return null;

  return <>{children}</>;
};

export default AuthProvider;
