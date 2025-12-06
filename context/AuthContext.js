"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            try {
                const parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error("Invalid Token Structure");
                }

                const base64Url = parts[1];
                let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

                const pad = base64.length % 4;
                if (pad) {
                    base64 += '='.repeat(4 - pad);
                }

                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                setUser(JSON.parse(jsonPayload));

            } catch (e) {
                console.error("AuthContext Decode Error (Invalid Token Cleared):", e);
                Cookies.remove("token");
                setUser(null);
            }
        }
    }, []);

    const login = (token, userData) => {
        setUser(userData);

        console.log("LOGIN SUCCESS. Redirecting...");
        router.refresh();

        if (userData.role === 'admin') {
            router.push('/admin/products');
        } else {
            router.push('/');
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);