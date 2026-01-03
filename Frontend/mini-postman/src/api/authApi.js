import api from "./axios";

export const authApi = {
  // POST /auth/signup
  signup: async (email, password) => {
    const response = await api.post("/auth/signup", { email, password });
    return response.data;
  },

  // POST /auth/login
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Store token
  setToken: (token) => {
    localStorage.setItem("token", token);
  },
};

export default authApi;