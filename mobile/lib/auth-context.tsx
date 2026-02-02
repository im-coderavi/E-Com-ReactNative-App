import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Platform } from "react-native";

// Match the API_URL from api.ts or define it here
// Ideally imported from config or env, but hardcoding based on existing file
// Match the API_URL from api.ts or define it here
// Ideally imported from config or env, but hardcoding based on existing file
const API_URL = "http://10.228.3.209:3000/api";

// For physical devices/Android emulator, localhost won't work.
// Recommend user to change this to their IP if needed.
// const API_URL = "http://192.168.1.X:3000/api";

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Helper functions for storage
    const setStorageItem = async (key: string, value: string) => {
        if (Platform.OS === "web") {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    };

    const getStorageItem = async (key: string) => {
        if (Platform.OS === "web") {
            return localStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    };

    const removeStorageItem = async (key: string) => {
        if (Platform.OS === "web") {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    };

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await getStorageItem("token");
                if (storedToken) {
                    setToken(storedToken);
                    // Optional: validate token or fetch user
                    setUser({ role: "customer" }); // dummy
                }
            } catch (error) {
                console.log("Error loading token:", error);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user } = res.data;

            await setStorageItem("token", token);
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error: any) {
            console.error("Login error:", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const signup = async (email, password, name) => {
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, { email, password, name });
            const { token, user } = res.data;

            await setStorageItem("token", token);
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error: any) {
            console.error("Signup error:", error);
            return { success: false, message: error.response?.data?.message || "Signup failed" };
        }
    };

    const logout = async () => {
        await removeStorageItem("token");
        setToken(null);
        setUser(null);
    };

    // Helper for api.ts
    const getToken = async () => {
        return token || await getStorageItem("token");
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, signup, logout, getToken, isSignedIn: !!token, isLoaded: !loading }}>
            {children}
        </AuthContext.Provider>
    );
};
