import { LoginType, Tokens, UserInfo } from '@/lib/definitions';
import { redirect } from 'next/navigation';
//import encrypt from '@/lib/encrypt';

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const Login = async(params: LoginType) =>  {
    console.log(params);
    try {
        const response = await fetch(`${API_URL}api/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `username=${params.username}&password=${params.password}`,
        });
        
        if (response.ok) {
          const data: UserInfo = await response.json();
          console.log('Login successful', data);

          if (!data.status){throw new Error("Something Went Wrong Try Again Later")}   
          if (!data.is_active) {throw new Error("User has been deactivated")}

          let user_info = {
            "email": data["email"],
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "matric_number": data["matric_number"],
            "role": data["role"],
            "level": data["level"],
            "is_superuser": data["is_superuser"],
          }
          
          Cookies.set("access_token", data["access_token"]);
          Cookies.set("refresh_token", data["refresh_token"]);
          Cookies.set("user_info", JSON.stringify(user_info))
          
          return true
        }
        return false
      } catch (error) {
          console.error("Error logging in:", error);
          return false
      }
}

export const statusBasemodel = async (params:Tokens) => {
  const data = {"access_token":params.access_token}
  try{
    const response = await fetch(`${API_URL}api/auth/refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization" : `Bearer ${params.refresh_token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.refreshed) {
        localStorage.removeItem("access_token");
        localStorage.setItem("access_token", data.access_token);

        return true
      }
    }else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("login_status")

      return false
    }

  }catch (error) {
    console.error("Error logging in:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("login_status")

    return false
  }
}

export const confirmAuthStatus = async (params:Tokens) => {
  if (!params.access_token || !params.refresh_token) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("login_status")
    redirect("/auth/sign_in")
  }

  const confirm = statusBasemodel(params);
  if (!confirm) {
    redirect("/auth/sign_in")
  }

}

export const checkLoginStatus = async () => {
  const access_token = localStorage.getItem("access_token")!;
  const refresh_token = localStorage.getItem("refresh_token")!;
  const role = localStorage.getItem("role");

  if (!access_token && !refresh_token && !role) {
    return false
  }
  
  const data: Tokens = {"access_token": access_token, "refresh_token": refresh_token}
  const confirm = statusBasemodel(data);
  if (!confirm) {
    return false
  }
  return true

}