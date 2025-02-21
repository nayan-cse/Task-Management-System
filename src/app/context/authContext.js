// Add this at the top of your file to mark it as a client component
"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for stored tokens
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
        } else {
            router.push("/login"); // Redirect to login if tokens are not found
        }
    }, [router]);

    const refreshAccessToken = async() => {
        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/refresh-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            const data = await res.json();
            setLoading(false);

            if (res.status === 200) {
                // Store new access token and refresh token
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
            } else {
                // If refreshing token fails, log out the user
                logout();
            }
        } catch (error) {
            setLoading(false);
            console.error("Error refreshing token:", error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);
        router.push("/login");
    };

    return ( <
        AuthContext.Provider value = {
            {
                accessToken,
                refreshToken,
                loading,
                refreshAccessToken,
                logout,
            }
        } >
        { children } <
        /AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
