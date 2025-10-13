import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      // Don't show toast here - let individual components handle it
      return Promise.reject(error);
    }

    // Log HTTP errors but don't show toast (components will handle it)
    const status = error.response?.status;
    console.error('API Error:', status, error.response.data);

    return Promise.reject(error);
  }
);

export default axiosInstance;
