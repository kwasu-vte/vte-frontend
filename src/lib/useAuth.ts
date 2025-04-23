import { useEffect, useState } from "react";

const getIsLoggedIn = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false;
};

const getExpirationDate = () => {
  if (typeof window !== "undefined") {
    const expirationDate = localStorage.getItem("expirationDate");
    return expirationDate ? new Date(expirationDate) : null;
  }
  return null;
};

const getUserDetails = () => {
  if (typeof window !== "undefined") {
    const userDetails = localStorage.getItem("userDetails");
    return userDetails ? JSON.parse(userDetails) : null;
  }
  return null;
};

export const clearAuthData = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userDetails");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("token");
};

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkAuthStatus = () => {
      const currentExpirationDate = getExpirationDate();
      const now = new Date();

      if (currentExpirationDate && now > currentExpirationDate) {
        clearAuthData();
        setIsLoggedIn(false);
        setUserDetails(null);
        setExpirationDate(null);
      } else {
        setIsLoggedIn(getIsLoggedIn());
        setExpirationDate(currentExpirationDate);
        setUserDetails(getUserDetails());
      }
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000 * 60);

    window.addEventListener("storage", checkAuthStatus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  if (!mounted) {
    return {
      isLoggedIn: null,
      expirationDate: null,
      userDetails: null,
      mounted: false,
    };
  }

  return { isLoggedIn, expirationDate, userDetails, mounted };
};

export default useAuth;
