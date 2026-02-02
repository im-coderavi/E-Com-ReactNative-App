import { useAuth } from "../lib/auth-context";
import axios from "axios";
import { useEffect } from "react";

// Use environment variable with fallback to hardcoded IP
// localhost will work in simulator
// For physical device, ensure both device and dev machine are on same network
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.228.3.209:3000/api";

// prod url will work in your physical device
// const API_URL = "https://expo-ecommerce-th4ln.sevalla.app/api"

console.log("📡 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Add response interceptor for error handling
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          console.error("❌ Request timeout - check network connection");
        } else if (error.message === 'Network Error') {
          console.error("❌ Network Error - ensure backend is running and accessible");
          console.error("📍 Trying to connect to:", API_URL);
        } else if (error.response) {
          console.error("❌ API Error:", error.response.status, error.response.data);
        } else {
          console.error("❌ Unexpected error:", error.message);
        }
        return Promise.reject(error);
      }
    );

    // cleanup: remove interceptors when component unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [getToken]);

  return api;
};

// on every single req, we would like have an auth token so that our backend knows that we're authenticated
// we're including the auth token under the auth headers
