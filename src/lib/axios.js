// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL+"/api/v1",
  timeout: 10000, // 10 seconds
  headers: {
    Accept: "application/json",
  },
});

// console.log(process.env.NEXT_PUBLIC_API_URL, "api url"); 

// Optional: add response interceptor for error logging
axiosInstance.interceptors.response.use(
  (response) => {
    // Ensure response.data exists and is valid
    if (!response.data) {
      return { ...response, data: {} };
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    // Handle cases where response might be empty or invalid JSON
    if (error.response && error.response.data === '') {
      error.response.data = {};
    }

    console.error(
      "API Error:",
      status,
      error?.response?.data || error?.message
    );

    // Normalize error shape for consistent handling
    const normalized = {
      status: status || 0,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Unexpected API error",
      data: error?.response?.data || null,
    };
    error.normalized = normalized;
    return Promise.reject(error);
  }
);

export default axiosInstance;
