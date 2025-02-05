import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const instance = axios.create({
  baseURL,
  timeout: 30000,
});

instance.interceptors.request.use((config) => {
  const userDetailsString = localStorage.getItem("userDetails");

  if (config.url === "/api/core/register" || config.url === "/api/core/token") {
    return config;
  }

  if (userDetailsString) {
    try {
      const userDetails = JSON.parse(userDetailsString);
      const token = userDetails?.access || userDetails?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing userDetails from localStorage:", error);
    }
  }

  return config;
});
