import { LoginType, Tokens, UserInfo } from '@/lib/definitions';
import { redirect } from 'next/navigation';
//import encrypt from '@/lib/encrypt';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const Login = async(params: LoginType) => {
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

          if (!data.status){throw new Error("SomethingWent Wrong Try Again Later")}   
          if (!data.is_active) {throw new Error("User has been deactivated")}

          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('role', data.role);

          return data

        }
      } catch (error) {
          console.error("Error logging in:", error);
          throw new Error(`Error: ${error}`)
      }
}

export const confirmAuthStatus = async (params:Tokens) => {
  if (!params.access_token || !params.refresh_token) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    redirect("/")
  }
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
      }
    }else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");

      redirect("/")
    }

  }catch (error) {
    console.error("Error logging in:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");

    redirect("/")
  }
}