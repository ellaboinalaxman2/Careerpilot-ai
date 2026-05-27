import api from "./api";

const API_URL = "/auth";

// Register user
const register = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Get token
const getToken = () => {
  return localStorage.getItem("token");
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
};

export default authService;
