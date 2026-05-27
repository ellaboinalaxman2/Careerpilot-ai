import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to false for CORS
  timeout: 60000, // 60 second timeout for file uploads
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      contentType: config.headers["Content-Type"],
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage for request:", config.url);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      success: true,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.error("Unauthorized - Token may be expired");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }

    return Promise.reject(error);
  },
);

export default api;
