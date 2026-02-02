import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Optional: Verify token with backend
            // const res = await axiosInstance.get("/api/auth/me");
            // setUser(res.data);

            // For now, just trust existence of token or decode it if we had jwt-decode
            // We will assume if token exists, we are logged in. 
            // Real validation happens on API calls (401 will trigger logout)
            setUser({ role: "admin" }); // dummy object or decode token
        } catch (error) {
            console.error("Auth check failed", error);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axiosInstance.post("/api/auth/login", { email, password });
            if (res.data.role !== "admin") {
                throw new Error("Access denied. Admin only.");
            }
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user); // Store the full user object from backend
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isSignedIn: !!user, isLoaded: !loading }}>
            {children}
        </AuthContext.Provider>
    );
};
