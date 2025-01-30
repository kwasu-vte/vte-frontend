"use client"
import { createContext, useContext, useEffect, useState } from "react";

import Cookies from "js-cookie";
import { redirect, useRouter } from "next/navigation";
import { userInfo } from "./definitions";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Automatically check authentication on initial load
    useEffect(() => {

        const checkAuth = async () => {
        try {
            if (!loading) return
            const access_token = Cookies.get("access_token");
            const refresh_token = Cookies.get("refresh_token");

            if (access_token != null && access_token != "") {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/core/token/verify/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"token": access_token}),
                });
            
                if (response.ok) {
                    const data = await response.json();
                    if (data.refreshed) {
                        Cookies.set("access_token", data["access_token"]);
                    }
                }else {
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    Cookies.remove("user_info")
                }
                let user_info = Cookies.get("user_info")
                user_info = user_info == ""? null: JSON.parse(user_info)
                setUser(user_info);
            }
            
            //test
            setUser(userInfo);
            
        } catch (err) {
            console.error("Not authenticated", err);
            
            if (err.response && err.response.status === 401) {
                const refresh_token = Cookies.get("refresh_token");

                const refresh_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/core/token/refresh/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"refresh": refresh_token}),
                });

                if (refresh_response.ok) {
                    const data = await refresh_response.json();
                    if (data.refreshed) {
                        Cookies.set("access_token", data["access"]);
                    }
                }else {
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    Cookies.remove("user_info")
                }
                let user_info = Cookies.get("user_info")
                user_info = user_info == ""? null: JSON.parse(user_info)
                setUser(user_info);

            }
        } finally {
            setLoading(false);
        }
        };

        checkAuth();
    }, [loading]);

    const login = async (credentials) => {
        console.log(credentials);
        try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/core/token/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: {username:credentials.username, 
                password:credentials.password}},
            );

        if (res.ok) {
            let data = await res.json();
            console.log(data);
            let user_info = data
            /* let user_info = {
                "email": data["email"],
                "first_name": data["first_name"],
                "last_name": data["last_name"],
                "matric_number": data["matric_number"],
                "role": data["role"],
                "level": data["level"],
                "is_superuser": data["is_superuser"],
            } */
            
            Cookies.set("access_token", data["access_token"]);
            Cookies.set("refresh_token", data["refresh_token"]);
            Cookies.set("user_info", JSON.stringify(user_info))
        } else {
            console.log("there is a problem");
        }
        } catch (err) {
            console.error("Login failed", err);
            //test
            Cookies.set("user_info", JSON.stringify(userInfo))
        }
        window.location.href = "/";
    }

    const logout = () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user_info");
        setUser(null);
        router.push("/auth/sign_in");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
        {/* {!loading && children} */}
        {children}
        </AuthContext.Provider>
    );
}
